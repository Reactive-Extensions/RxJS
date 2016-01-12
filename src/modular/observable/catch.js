'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var NAryDisposable = require('../narydisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var inherits = require('inherits');

global.Rx || (global.Rx = {});
if (!global.Rx.currentThreadScheduler) {
  require('../scheduler/currentthreadscheduler');
}

function CatchObserver(state, recurse) {
  this._state = state;
  this._recurse = recurse;
  AbstractObserver.call(this);
}

inherits(CatchObserver, AbstractObserver);

CatchObserver.prototype.next = function (x) { this._state.o.onNext(x); };
CatchObserver.prototype.error = function (e) { this._state.lastError = e; this._recurse(this._state); };
CatchObserver.prototype.completed = function () { this._state.o.onCompleted(); };

function CatchObservable(sources) {
  this.sources = sources;
  ObservableBase.call(this);
}

inherits(CatchObservable, ObservableBase);

function scheduleMethod(state, recurse) {
  if (state.isDisposed) { return; }
  if (state.i < state.sources.length) {
    var currentValue = state.sources[state.i++];
    isPromise(currentValue) && (currentValue = fromPromise(currentValue));

    var d = new SingleAssignmentDisposable();
    state.subscription.setDisposable(d);
    d.setDisposable(currentValue.subscribe(new CatchObserver(state, recurse)));
  } else {
    if (state.lastError !== null) {
      state.o.onError(state.lastError);
    } else {
      state.o.onCompleted();
    }
  }
}

function IsDisposedDisposable(s) {
  this._s = s;
}

IsDisposedDisposable.prototype.dispose = function () {
  !this._s.isDisposed && (this._s.isDisposed = true);
};

CatchObservable.prototype.subscribeCore = function (o) {
  var subscription = new SerialDisposable();
  var state = {
    isDisposed: false,
    sources: this.sources,
    i: 0,
    subscription: subscription,
    lastError: null,
    o: o
  };

  var cancelable = global.Rx.currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
  return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
};

module.exports = function catch_() {
  var len = arguments.length, args = new Array(len);
  for (var i = 0; i < len; i++) { args[i] = arguments[i]; }
  return new CatchObservable(args);
};
