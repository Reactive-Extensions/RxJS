'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var Subject = require('../subject');
var CompositeDisposable = require('../compositedisposable');
var RefCountDisposable = require('../refcountdisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var addRef = require('../internal/addref');
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('util').inherits;

global.Rx || (global.Rx = {});
if (!global.Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function createTimer (state) {
  var m = new SingleAssignmentDisposable(),
   isSpan = false,
   isShift = false;
  state.timerD.setDisposable(m);
  if (state.nextSpan === state.nextShift) {
    isSpan = true;
    isShift = true;
  } else if (state.nextSpan < state.nextShift) {
    isSpan = true;
  } else {
    isShift = true;
  }
  var newTotalTime = isSpan ? state.nextSpan : state.nextShift,
    ts = newTotalTime - state.totalTime;

  state.totalTime = newTotalTime;

  isSpan && (state.nextSpan += state.timeShift);
  isShift && (state.nextShift += state.timeShift);

  m.setDisposable(state.scheduler.scheduleFuture(null, ts, function () {
    if (isShift) {
      var s = new Subject();
      state.q.push(s);
      state.o.onNext(addRef(s, state.refCountDisposable));
    }
    isSpan && state.q.shift().onCompleted();
    createTimer(state);
 }));
}

function WindowTimeObserver(state) {
  this._s = state;
  AbstractObserver.call(this);
}

WindowTimeObserver.prototype.next = function (x) {
  for (var i = 0, len = this._s.q.length; i < len; i++) { this._s.q[i].onNext(x); }
};

WindowTimeObserver.prototype.error = function (e) {
  for (var i = 0, len = this._s.q.length; i < len; i++) { this._s.q[i].onError(e); }
  this._s.o.onError(e);
};

WindowTimeObserver.prototype.completed = function () {
  for (var i = 0, len = this._s.q.length; i < len; i++) { this._s.q[i].onCompleted(); }
  this._s.o.onCompleted();
};

function WindowTimeObservable (source, timeSpan, timeShift, scheduler) {
  this.source = source;
  this._timeSpan = timeSpan;
  this._timeShift = timeShift;
  this._scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(WindowTimeObservable, ObservableBase);

WindowTimeObservable.prototype.subscribeCore = function (o) {
  var timerD = new SerialDisposable(),
    groupDisposable = new CompositeDisposable(timerD),
    refCountDisposable = new RefCountDisposable(groupDisposable),
    q = [];

  var state = {
    o: o,
    timerD: timerD,
    groupDisposable: groupDisposable,
    refCountDisposable: refCountDisposable,
    timeSpan: this._timeSpan,
    timeShift: this._timeShift,
    nextSpan: this._timeSpan,
    nextShift: this._timeShift,
    totalTime: 0,
    scheduler: this._scheduler,
    q: q
  };

  q.push(new Subject());
  o.onNext(addRef(q[0], refCountDisposable));
  createTimer(state);
  groupDisposable.add(this.source.subscribe(new WindowTimeObserver(state)));

  return refCountDisposable;
};

module.exports = function windowTime (source, timeSpan, timeShiftOrScheduler, scheduler) {
  var timeShift;
  timeShiftOrScheduler == null && (timeShift = timeSpan);
  isScheduler(scheduler) || (scheduler = global.Rx.defaultScheduler);
  if (typeof timeShiftOrScheduler === 'number') {
    timeShift = timeShiftOrScheduler;
  } else if (isScheduler(timeShiftOrScheduler)) {
    timeShift = timeSpan;
    scheduler = timeShiftOrScheduler;
  }
  return new WindowTimeObservable(source, timeSpan, timeShift, scheduler);
};
