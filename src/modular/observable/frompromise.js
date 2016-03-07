'use strict';

var ObservableBase = require('./observablebase');
var Scheduler = require('../scheduler');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, errorObj = tryCatchUtils.errorObj;
var isFunction = require('../helpers/isfunction');
var inherits = require('inherits');

function FromPromiseObservable(p, s) {
  this._p = p;
  this._s = s;
  ObservableBase.call(this);
}

inherits(FromPromiseObservable, ObservableBase);

function scheduleNext(s, state) {
  var o = state[0], data = state[1];
  o.onNext(data);
  o.onCompleted();
}

function scheduleError(s, state) {
  var o = state[0], err = state[1];
  o.onError(err);
}

FromPromiseObservable.prototype.subscribeCore = function(o) {
  var sad = new SingleAssignmentDisposable(), self = this, p = self._p;

  if (isFunction(p)) {
    p = tryCatch(p)();
    if (p === errorObj) {
      o.onError(p.e);
      return sad;
    }
  }

  p
    .then(function (data) {
      sad.setDisposable(self._s.schedule([o, data], scheduleNext));
    }, function (err) {
      sad.setDisposable(self._s.schedule([o, err], scheduleError));
    });

  return sad;
};

/**
* Converts a Promise to an Observable sequence
* @param {Promise|Function} An ES6 Compliant promise or a function that returns one
* @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
*/
module.exports = function fromPromise(promise, scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = Scheduler.async);
  return new FromPromiseObservable(promise, scheduler);
};
