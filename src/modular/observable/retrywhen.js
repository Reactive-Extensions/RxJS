'use strict';

var ObservableBase = require('./observablebase');
var fromPromise = require('./frompromise');
var isPromise = require('../helpers/ispromise');
var Subject = require('../subject');
var Scheduler = require('../scheduler');
var BinaryDisposable = require('../binarydisposable');
var NAryDisposable = require('../narydisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var inherits = require('inherits');

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

function CatchErrorWhenObservable(source, notifier) {
  this.source = source;
  this._notifier = notifier;
  ObservableBase.call(this);
}

inherits(CatchErrorWhenObservable, ObservableBase);

CatchErrorWhenObservable.prototype.subscribeCore = function (o) {
  var exceptions = new Subject(),
    notifier = new Subject(),
    handled = this._notifier(exceptions),
    notificationDisposable = handled.subscribe(notifier);

  var e = this.source[$iterator$]();

  var state = { isDisposed: false },
    lastError,
    subscription = new SerialDisposable();
  var cancelable = Scheduler.queue.scheduleRecursive(null, function (_, recurse) {
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
      function (exn) {
        inner.setDisposable(notifier.subscribe(recurse, function(ex) {
          o.onError(ex);
        }, function() {
          o.onCompleted();
        }));

        exceptions.onNext(exn);
        outer.dispose();
      },
      function() { o.onCompleted(); }));
  });

  return new NAryDisposable([notificationDisposable, subscription, cancelable, createDisposable(state)]);
};

module.exports = function retryWhen (source, notifier) {
  return new CatchErrorWhenObservable(repeat(source), notifier);
};
