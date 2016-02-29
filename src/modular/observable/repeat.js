'use strict';

var ObservableBase = require('./observablebase');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var AbstractObserver = require('../observer/abstractobserver');
var Scheduler = require('../scheduler');
var NAryDisposable = require('../narydisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var inherits = require('inherits');

var $iterator$ = '@@iterator';

function repeatValue(value, count) {
  count == null && (count = -1);
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

function createDisposable(state) {
  return {
    isDisposed: false,
    dispose: function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        state.isDisposed = true;
      }
    }
  };
}

function ConcatObserver(state, recurse) {
  this._state = state;
  this._recurse = recurse;
  AbstractObserver.call(this);
}

inherits(ConcatObserver, AbstractObserver);

ConcatObserver.prototype.next = function (x) { this._state.o.onNext(x); };
ConcatObserver.prototype.error = function (e) { this._state.o.onError(e); };
ConcatObserver.prototype.completed = function () { this._recurse(this._state); };

function ConcatObservable(sources) {
  this.sources = sources;
  ObservableBase.call(this);
}

inherits(ConcatObservable, ObservableBase);

function scheduleMethod(state, recurse) {
  if (state.isDisposed) { return; }
  var currentItem = state.e.next();
  if (currentItem.done) { return state.o.onCompleted(); }

  // Check if promise
  var currentValue = currentItem.value;
  isPromise(currentValue) && (currentValue = fromPromise(currentValue));

  var d = new SingleAssignmentDisposable();
  state.subscription.setDisposable(d);
  d.setDisposable(currentValue.subscribe(new ConcatObserver(state, recurse)));
}

ConcatObservable.prototype.subscribeCore = function (o) {
  var subscription = new SerialDisposable();
  var state = {
    isDisposed: false,
    o: o,
    subscription: subscription,
    e: this.sources[$iterator$]()
  };

  var cancelable = Scheduler.queue.scheduleRecursive(state, scheduleMethod);
  return new NAryDisposable([subscription, cancelable, createDisposable(state)]);
};

module.exports = function repeat(source, repeatCount) {
  return new ConcatObservable(repeatValue(source, repeatCount));
};
