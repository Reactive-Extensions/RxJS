'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var Disposable = require('../disposable');
var NAryDisposable = require('../narydisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var inherits = require('util').inherits;

global.Rx || (global.Rx = {});
if (!global.Rx.immediateScheduler) {
  require('../scheduler/immediatescheduler');
}

function ConcatObserver(s, fn) {
  this._s = s;
  this._fn = fn;
  AbstractObserver.call(this);
}

inherits(ConcatObserver, AbstractObserver);

ConcatObserver.prototype.next = function (x) { this._s.o.onNext(x); };
ConcatObserver.prototype.error = function (e) { this._s.o.onError(e); };
ConcatObserver.prototype.completed = function () { this._s.i++; this._fn(this._s); };

function ConcatObservable(sources) {
  this._sources = sources;
  ObservableBase.call(this);
}

inherits(ConcatObservable, ObservableBase);

function scheduleRecursive (state, recurse) {
  if (state.disposable.isDisposed) { return; }
  if (state.i === state.sources.length) { return state.o.onCompleted(); }

  // Check if promise
  var currentValue = state.sources[state.i];
  isPromise(currentValue) && (currentValue = fromPromise(currentValue));

  var d = new SingleAssignmentDisposable();
  state.subscription.setDisposable(d);
  d.setDisposable(currentValue.subscribe(new ConcatObserver(state, recurse)));
}

ConcatObservable.prototype.subscribeCore = function(o) {
  var subscription = new SerialDisposable();
  var disposable = Disposable.create();
  var state = {
    o: o,
    i: 0,
    subscription: subscription,
    disposable: disposable,
    sources: this._sources
  };

  var cancelable = global.Rx.immediateScheduler.scheduleRecursive(state, scheduleRecursive);
  return new NAryDisposable([subscription, disposable, cancelable]);
};

/**
 * Concatenates all the observable sequences.
 * @param {Array | Arguments} args Arguments or an array to concat to the observable sequence.
 * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
 */
module.exports = function concat () {
  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  return new ConcatObservable(args);
};
