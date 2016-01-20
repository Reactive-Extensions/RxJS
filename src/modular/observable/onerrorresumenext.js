'use strict';

var ObservableBase = require('./observablebase');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var AbstractObserver = require('../observer/abstractobserver');
var BinaryDisposable = require('../binarydisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var inherits = require('inherits');

global._Rx || (global._Rx = {});
if (!global._Rx.immediateScheduler) {
  require('../scheduler/immediatescheduler');
}

function OnErrorResumeNextObserver(state, recurse) {
  this._state = state;
  this._recurse = recurse;
  AbstractObserver.call(this);
}

inherits(OnErrorResumeNextObserver, AbstractObserver);

OnErrorResumeNextObserver.prototype.next = function (x) { this._state.o.onNext(x); };
OnErrorResumeNextObserver.prototype.error = function () { this._recurse(this._state); };
OnErrorResumeNextObserver.prototype.completed = function () { this._recurse(this._state); };

function OnErrorResumeNextObservable(sources) {
  this.sources = sources;
  ObservableBase.call(this);
}

inherits(OnErrorResumeNextObservable, ObservableBase);

function scheduleMethod(state, recurse) {
  if (state.pos < state.sources.length) {
    var current = state.sources[state.pos++];
    isPromise(current) && (current = fromPromise(current));
    var d = new SingleAssignmentDisposable();
    state.subscription.setDisposable(d);
    d.setDisposable(current.subscribe(new OnErrorResumeNextObserver(state, recurse)));
  } else {
    state.o.onCompleted();
  }
}

OnErrorResumeNextObservable.prototype.subscribeCore = function (o) {
  var subscription = new SerialDisposable(),
    state = {
      pos: 0,
      subscription: subscription,
      o: o,
      sources: this.sources
    },
    cancellable = global._Rx.immediateScheduler.scheduleRecursive(state, scheduleMethod);
  return new BinaryDisposable(subscription, cancellable);
};

/**
 * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
 * @returns {Observable} An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.
 */
module.exports = function onErrorResumeNext () {
  var len = arguments.length, sources = new Array(len);
  for(var i = 0; i < len; i++) { sources[i] = arguments[i]; }
  return new OnErrorResumeNextObservable(sources);
};
