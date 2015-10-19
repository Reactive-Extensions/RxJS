'use strict';

var errors = require('./internal/errors');
var inherits = require('util').inherits;

global.Rx || (global.Rx = {});
if (!global.Rx.immediateScheduler) {
  require('./scheduler/immediatescheduler');
}

function Notification() { }

Notification.prototype._accept = function (onNext, onError, onCompleted) {
  throw new errors.NotImplementedError();
};

Notification.prototype._acceptObserver = function (onNext, onError, onCompleted) {
  throw new errors.NotImplementedError();
};

/**
 * Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.
 * @param {Function | Observer} observerOrOnNext Function to invoke for an OnNext notification or Observer to invoke the notification on..
 * @param {Function} onError Function to invoke for an OnError notification.
 * @param {Function} onCompleted Function to invoke for an OnCompleted notification.
 * @returns {Any} Result produced by the observation.
 */
Notification.prototype.accept = function (observerOrOnNext, onError, onCompleted) {
  return observerOrOnNext && typeof observerOrOnNext === 'object' ?
    this._acceptObserver(observerOrOnNext) :
    this._accept(observerOrOnNext, onError, onCompleted);
};

/**
 * Returns an observable sequence with a single notification.
 *
 * @memberOf Notifications
 * @param {Scheduler} [scheduler] Scheduler to send out the notification calls on.
 * @returns {Observable} The observable sequence that surfaces the behavior of the notification upon subscription.
 */
Notification.prototype.toObservable = function (scheduler) {
  var self = this;
  isScheduler(scheduler) || (scheduler = global.Rx.immediateScheduler);
  return new AnonymousObservable(function (o) {
    return scheduler.schedule(self, function (_, notification) {
      notification._acceptObserver(o);
      notification.kind === 'N' && o.onCompleted();
    });
  });
};

function OnNextNotification(value) {
  this.value = value;
  this.kind = 'N';
}

inherits(OnNextNotification, Notification);

OnNextNotification.prototype._accept = function (onNext) {
  return onNext(this.value);
};

OnNextNotification.prototype._acceptObserver = function (o) {
  return o.onNext(this.value);
};

OnNextNotification.prototype.toString = function () {
  return 'OnNext(' + this.value + ')';
};

function OnErrorNotification(error) {
  this.error = error;
  this.kind = 'E';
}

inherits(OnErrorNotification, Notification);

OnErrorNotification.prototype._accept = function (onNext, onError) {
  return onError(this.error);
};

OnErrorNotification.prototype._acceptObserver = function (o) {
  return o.onError(this.error);
};

OnErrorNotification.prototype.toString = function () {
  return 'OnError(' + this.error + ')';
};

function OnCompletedNotification() {
  this.kind = 'C';
}

inherits(OnCompletedNotification, Notification);

OnCompletedNotification.prototype._accept = function (onNext, onError, onCompleted) {
  return onCompleted();
};

OnCompletedNotification.prototype._acceptObserver = function (o) {
  return o.onCompleted();
};

OnCompletedNotification.prototype.toString = function () {
  return 'OnCompleted()';
};


/**
* Creates an object that represents an OnNext notification to an observer.
* @param {Any} value The value contained in the notification.
* @returns {Notification} The OnNext notification containing the value.
*/
Notification.createOnNext = function (value) {
  return new OnNextNotification(value);
};

/**
* Creates an object that represents an OnError notification to an observer.
* @param {Any} error The exception contained in the notification.
* @returns {Notification} The OnError notification containing the exception.
*/
Notification.createOnError = function (error) {
  return new OnErrorNotification(error);
};

/**
* Creates an object that represents an OnCompleted notification to an observer.
* @returns {Notification} The OnCompleted notification.
*/
Notification.createOnCompleted = function () {
  return new OnCompletedNotification();
};

module.exports = Notification;
