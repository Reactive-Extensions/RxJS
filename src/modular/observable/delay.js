'use strict';

var ObservableBase = require('./observablebase');
var materialize = require('./materialize');
var timestamp = require('./timestamp');
var isObservable = require('../observable').isObservable;
var AbstractObserver = require('../observer/abstractobserver');
var BinaryDisposable = require('../binarydisposable');
var CompositeDisposable = require('../CompositeDisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var isFunction = require('../helpers/isfunction');
var isScheduler = require('../scheduler').isScheduler;
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

global._Rx || (global._Rx = {});
if (!global._Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function scheduleRelative (state, recurse) {
  if (state.error) { return; }
  state.running = true;

  var result;
  do {
    result = null;
    if (state.q.length > 0 && state.q[0].timestamp - state.scheduler.now() <= 0) {
      result = state.q.shift().value;
    }
    if (result) { result.accept(state.o); }
  } while (result);

  var shouldRecurse = false;
  var recurseDueTime = 0;

  if (state.q.length > 0) {
    shouldRecurse = true;
    recurseDueTime = Math.max(0, state.q[0].timestamp - state.scheduler.now());
  } else {
    state.active = false;
  }

  state.running = false;
  if (state.error) {
    state.o.onError(state.error);
  } else if (shouldRecurse) {
    recurse(state, recurseDueTime);
  }
}

function DelayRelativeObserver(state) {
  this._s = state;
  AbstractObserver.call(this);
}

inherits(DelayRelativeObserver, AbstractObserver);

DelayRelativeObserver.prototype.next = function (notification) {
  var shouldRun;
  if (notification.value.kind === 'E') {
    this._s.q = [];
    this._s.q.push(notification);
    this._s.error = notification.value.error;
    shouldRun = !this._s.running;
  } else {
    this._s.q.push({ value: notification.value, timestamp: notification.timestamp + this._s.dueTime });
    shouldRun = !this._s.active;
    this._s.active = true;
  }
  if (shouldRun) {
    if (this._s.error) {
      this._s.o.onError(this._s.error);
    } else {
      var d = new SingleAssignmentDisposable();
      this._s.cancelable.setDisposable(d);
      d.setDisposable(this._s.scheduler.scheduleRecursiveFuture(this._s, this._s.dueTime, scheduleRelative));
    }
  }
};

DelayRelativeObserver.prototype.error = function (e) { throw e; };
DelayRelativeObserver.prototype.completed = function () { };

function DelayRelativeObservable(source, dueTime, scheduler) {
  this.source = source;
  this._dueTime = dueTime;
  this._scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(DelayRelativeObservable, ObservableBase);

DelayRelativeObservable.prototype.subscribeCore = function (o) {
  var state = {
    active: false,
    cancelable: new SerialDisposable(),
    error: null,
    q: [],
    running: false,
    o: o,
    dueTime: this._dueTime,
    scheduler: this._scheduler
  };

  var subscription = timestamp(materialize(this.source), this._scheduler)
    .subscribe(new DelayRelativeObserver(state));

  return new BinaryDisposable(subscription, state.cancelable);
};

function DelayAbsoluteObservable(source, dueTime, scheduler) {
  this.source = source;
  this._dueTime = dueTime;
  this._scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(DelayAbsoluteObservable, ObservableBase);

DelayAbsoluteObservable.prototype.subscribe = function (o) {
  var obs = new DelayRelativeObservable(this.source, this._dueTime - this._scheduler.now(), this._scheduler);
  return obs.subscribe(o);
};

function DelaySelectorObseravble(source, subscriptionDelay, delayDurationSelector) {
  this.source = source;
  this._selector = null;
  this._subDelay = null;
  if (isFunction(subscriptionDelay)) {
    this._selector = subscriptionDelay;
  } else {
    this._subDelay = subscriptionDelay;
    this._selector = delayDurationSelector;
  }
  ObservableBase.call(this);
}

inherits(DelaySelectorObseravble, ObservableBase);

DelaySelectorObseravble.prototype.subscribeCore = function (o) {
  var delays = new CompositeDisposable(),
      atEnd = false,
      subscription = new SerialDisposable(),
      selector = this._selector,
      subDelay = this._subDelay,
      source = this.source;

  function start() {
    subscription.setDisposable(source.subscribe(
      function (x) {
        var delay = tryCatch(selector)(x);
        if (delay === global._Rx.errorObj) { return o.onError(delay.e); }
        var d = new SingleAssignmentDisposable();
        delays.add(d);
        d.setDisposable(delay.subscribe(
          function () {
            o.onNext(x);
            delays.remove(d);
            done();
          },
          function (e) { o.onError(e); },
          function () {
            o.onNext(x);
            delays.remove(d);
            done();
          }
        ));
      },
      function (e) { o.onError(e); },
      function () {
        atEnd = true;
        subscription.dispose();
        done();
      }
    ));
  }

  function done () {
    atEnd && delays.length === 0 && o.onCompleted();
  }

  if (!subDelay) {
    start();
  } else {
    subscription.setDisposable(subDelay.subscribe(start, function (e) { o.onError(e); }, start));
  }

  return new BinaryDisposable(subscription, delays);
};

/**
 *  Time shifts the observable sequence by dueTime.
 *  The relative time intervals between the values are preserved.
 *
 * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
 * @param {Scheduler} [scheduler] Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.
 * @returns {Observable} Time-shifted sequence.
 */
module.exports = function delay () {
  var source = arguments[0], firstArg = arguments[1];
  if (typeof firstArg === 'number' || firstArg instanceof Date) {
    var dueTime = firstArg, scheduler = arguments[2];
    isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
    return dueTime instanceof Date ?
      new DelayAbsoluteObservable(source, dueTime, scheduler) :
      new DelayRelativeObservable(source, dueTime, scheduler);
  } else if (isObservable(firstArg) || isFunction(firstArg)) {
    return new DelaySelectorObseravble(source, firstArg, arguments[2]);
  } else {
    throw new Error('Invalid arguments');
  }
};
