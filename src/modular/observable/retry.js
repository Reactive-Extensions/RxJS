'use strict';

var ObservableBase = require('./observablebase');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var AbstractObserver = require('../observer/abstractobserver');
var NAryDisposable = require('../narydisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var tryCatch = require('../internal/trycatchutils').tryCatch;
var inherits = require('inherits');

global._Rx || (global._Rx = {});
if (!global._Rx.currentThreadScheduler) {
  require('../scheduler/currentthreadscheduler');
}

var $iterator$ = '@@iterator';

function repeat(value, count) {
  return {
    '@@iterator': function () {
      return {
        remaining: count,
        next: function () {
          if (this.remaining === 0) { return { done: true, value: undefined }; }
          if (this.remaining > 0) { this.remaining--; }
          return { done: false, value: value };
        }
      };
    }
  };
}

function CatchErrorObserver(state, recurse) {
  this._state = state;
  this._recurse = recurse;
  AbstractObserver.call(this);
}

inherits(CatchErrorObserver, AbstractObserver);

CatchErrorObserver.prototype.next = function (x) { this._state.o.onNext(x); };
CatchErrorObserver.prototype.error = function (e) { this._state.lastError = e; this._recurse(this._state); };
CatchErrorObserver.prototype.completed = function () { this._state.o.onCompleted(); };

function IsDisposedDisposable(state) {
  this._s = state;
  this.isDisposed = false;
}

IsDisposedDisposable.prototype.dispose = function () {
  if (!this.isDisposed) {
    this.isDisposed = true;
    this._s.isDisposed = true;
  }
};

function CatchErrorObservable(sources) {
  this.sources = sources;
  ObservableBase.call(this);
}

inherits(CatchErrorObservable, ObservableBase);

function scheduleMethod(state, recurse) {
  if (state.isDisposed) { return; }
  var currentItem = tryCatch(state.e.next).call(state.e);
  if (currentItem === global._Rx.errorObj) { return state.o.onError(currentItem.e); }
  if (currentItem.done) { return state.lastError !== null ? state.o.onError(state.lastError) : state.o.onCompleted(); }

  var currentValue = currentItem.value;
  isPromise(currentValue) && (currentValue = fromPromise(currentValue));

  var d = new SingleAssignmentDisposable();
  state.subscription.setDisposable(d);
  d.setDisposable(currentValue.subscribe(new CatchErrorObserver(state, recurse)));
}

CatchErrorObservable.prototype.subscribeCore = function (o) {
  var subscription = new SerialDisposable();
  var state = {
    isDisposed: false,
    e: this.sources[$iterator$](),
    subscription: subscription,
    lastError: null,
    o: o
  };

  var cancelable = global._Rx.currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
  return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
};

module.exports = function retry(source, retryCount) {
  return new CatchErrorObservable(repeat(source, retryCount));
};
