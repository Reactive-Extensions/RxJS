'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var BinaryDisposable = require('../binarydisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var isFunction = require('../helpers/isfunction');
var isScheduler = require('../scheduler').isScheduler;
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('util').inherits;

global.Rx || (global.Rx = {});
if (!global.Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function DebounceObserver(o, dt, scheduler, cancelable) {
  this._o = o;
  this._d = dt;
  this._scheduler = scheduler;
  this._c = cancelable;
  this._v = null;
  this._hv = false;
  this._id = 0;
  AbstractObserver.call(this);
}

inherits(DebounceObserver, AbstractObserver);

function scheduleFuture(s, state) {
  state.self._hv && state.self._id === state.currentId && state.self._o.onNext(state.x);
  state.self._hv = false;
}

DebounceObserver.prototype.next = function (x) {
  this._hv = true;
  this._v = x;
  var currentId = ++this._id, d = new SingleAssignmentDisposable();
  this._c.setDisposable(d);
  d.setDisposable(this._scheduler.scheduleFuture({
    self: this,
    currentId: currentId,
    x: x
  }, scheduleFuture));
};

DebounceObserver.prototype.error = function (e) {
  this._c.dispose();
  this._o.onError(e);
  this._hv = false;
  this._id++;
};

DebounceObserver.prototype.completed = function () {
  this._c.dispose();
  this._hv && this._o.onNext(this._v);
  this._o.onCompleted();
  this._hv = false;
  this._id++;
};

function DebounceObservable(source, dt, s) {
  isScheduler(s) || (s = global.Rx.defaultScheduler);
  this.source = source;
  this._dt = dt;
  this._s = s;
  ObservableBase.call(this);
}

inherits(DebounceObservable, ObservableBase);

DebounceObservable.prototype.subscribeCore = function (o) {
  var cancelable = new SerialDisposable();
  return new BinaryDisposable(
    this.source.subscribe(new DebounceObserver(o, this._dt, this._s, cancelable)),
    cancelable);
};

function DebounceInnerObserver(s, d, currentId) {
  this._s = s;
  this._d = d;
  this._currentId = currentId;
  AbstractObserver.call(this);
}

inherits(DebounceInnerObserver, AbstractObserver);

DebounceInnerObserver.prototype.next = function () {
  this._s.hasValue && this._s.id === this._currentid && this._s.o.onNext(this._s.value);
  this._s.hasValue = false;
  this._d.dispose();
};

DebounceInnerObserver.prototype.error = function (e) { this._s.o.onError(e); };

DebounceInnerObserver.prototype.completed = function () {
  this._s.hasValue && this._s.id === this._currentid && this._s.o.onNext(this._s.value);
  this._s.hasValue = false;
  this._d.dispose();
};

function DebounceSelectorObserver(s) {
  this._s = s;
  AbstractObserver.call(this);
}

inherits(DebounceSelectorObserver, AbstractObserver);

DebounceSelectorObserver.prototype.next = function (x) {
  var throttle = tryCatch(this._s.fn)(x);
  if (throttle === global.Rx.errorObj) { return this._s.o.onError(throttle.e); }

  isPromise(throttle) && (throttle = fromPromise(throttle));

  this._s.hasValue = true;
  this._s.value = x;
  this._s.id++;
  var currentId = this._s.id, d = new SingleAssignmentDisposable();
  this._s.cancelable.setDisposable(d);
  d.setDisposable(throttle.subscribe(new DebounceInnerObserver(this._s, d, currentId)));
};

DebounceSelectorObserver.prototype.error = function (e) {
  this._s.cancelable.dispose();
  this._s.o.onError(e);
  this._s.hasValue = false;
  this._s.id++;
};

DebounceSelectorObserver.prototype.completed = function () {
  this._s.cancelable.dispose();
  this._s.hasValue && this._s.o.onNext(this._s.value);
  this._s.o.onCompleted();
  this._s.hasValue = false;
  this._s.id++;
};

function DebounceSelectorObservable(source, fn) {
  this.source = source;
  this._fn = fn;
  ObservableBase.call(this);
}

inherits(DebounceSelectorObservable, ObservableBase);

DebounceSelectorObservable.prototype.subscribeCore = function (o) {
  var state = {
    value: null,
    hasValue: false,
    cancelable: new SerialDisposable(),
    id: 0,
    o: o,
    fn: this._fn
  };

  return new BinaryDisposable(
    state.cancelable,
    this.source.subscribe(new DebounceSelectorObserver(state))
  );
};

module.exports = function debounce() {
  var source = arguments[0];
  if (isFunction (arguments[1])) {
    return new DebounceSelectorObservable(source, arguments[1]);
  } else if (typeof arguments[1] === 'number') {
    return new DebounceObservable(source, arguments[1], arguments[2]);
  } else {
    throw new Error('Invalid arguments');
  }
};
