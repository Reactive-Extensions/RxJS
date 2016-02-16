'use strict';

var ObservableBase = require('./observablebase');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var Subject = require('../subject');
var BinaryDisposable = require('../binarydisposable');
var NAryDisposable = require('../narydisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var inherits = require('inherits');

global._Rx || (global._Rx = {});
if (!global._Rx.currentThreadScheduler) {
  require('../scheduler/currentthreadscheduler');
}

var $iterator$ = '@@iterator';

function repeat(value) {
  return {
    '@@iterator': function () {
      return {
        next: function () {
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

function RepeatWhenObservable(source, notifier) {
  this.source = source;
  this._notifier = notifier;
  ObservableBase.call(this);
}

inherits(RepeatWhenObservable, ObservableBase);

RepeatWhenObservable.prototype.subscribeCore = function (o) {
  var completions = new Subject(),
    notifier = new Subject(),
    handled = this._notifier(completions),
    notificationDisposable = handled.subscribe(notifier);

  var e = this.source[$iterator$]();

  var state = { isDisposed: false },
    lastError,
    subscription = new SerialDisposable();
  var cancelable = global._Rx.currentThreadScheduler.scheduleRecursive(null, function (_, recurse) {
    if (state.isDisposed) { return; }
    var currentItem = e.next();

    if (currentItem.done) {
      if (lastError) {
        o.onError(lastError);
      } else {
        o.onCompleted();
      }
      return;
    }

    // Check if promise
    var currentValue = currentItem.value;
    isPromise(currentValue) && (currentValue = fromPromise(currentValue));

    var outer = new SingleAssignmentDisposable();
    var inner = new SingleAssignmentDisposable();
    subscription.setDisposable(new BinaryDisposable(inner, outer));
    outer.setDisposable(currentValue.subscribe(
      function(x) { o.onNext(x); },
      function (exn) { o.onError(exn); },
      function() {
        inner.setDisposable(notifier.subscribe(recurse, function(ex) {
          o.onError(ex);
        }, function() {
          o.onCompleted();
        }));

        completions.onNext(null);
        outer.dispose();
      }));
  });

  return new NAryDisposable([notificationDisposable, subscription, cancelable, createDisposable(state)]);
};

module.exports = function repeatWhen (source, notifier) {
  return new RepeatWhenObservable(repeat(source), notifier);
};
