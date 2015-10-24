'use strict';

var Disposable = require('./disposable');
var Observable = require('./observable');
var Observer = require('./observer');
var InnerSubscription = require('./internal/innersubscription');
var addProperties = require('./internal/addproperties');
var cloneArray = require('./internal/clonearray');
var inherits = require('util').inherits;

/**
*  Represents the result of an asynchronous operation.
*  The last value before the OnCompleted notification, or the error received through OnError, is sent to all subscribed observers.
*/
function AsyncSubject() {
  Observable.call(this);
  this.isDisposed = false;
  this.isStopped = false;
  this.hasValue = false;
  this.observers = [];
  this.hasError = false;
}

inherits(AsyncSubject, Observable);

addProperties(AsyncSubject.prototype, Observer.prototype, {
  _subscribe: function (o) {
    Disposable.checkDisposed(this);

    if (!this.isStopped) {
      this.observers.push(o);
      return new InnerSubscription(this, o);
    }

    if (this.hasError) {
      o.onError(this.error);
    } else if (this.hasValue) {
      o.onNext(this.value);
      o.onCompleted();
    } else {
      o.onCompleted();
    }

    return Disposable.empty;
  },
  /**
   * Indicates whether the subject has observers subscribed to it.
   * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
   */
  hasObservers: function () {
    Disposable.checkDisposed(this);
    return this.observers.length > 0;
  },
  /**
   * Notifies all subscribed observers about the end of the sequence, also causing the last received value to be sent out (if any).
   */
  onCompleted: function () {
    var i;
    Disposable.checkDisposed(this);
    if (!this.isStopped) {
      this.isStopped = true;
      var os = cloneArray(this.observers), len = os.length;

      if (this.hasValue) {
        for (i = 0; i < len; i++) {
          var o = os[i];
          o.onNext(this.value);
          o.onCompleted();
        }
      } else {
        for (i = 0; i < len; i++) {
          os[i].onCompleted();
        }
      }

      this.observers.length = 0;
    }
  },
  /**
   * Notifies all subscribed observers about the error.
   * @param {Mixed} error The Error to send to all observers.
   */
  onError: function (error) {
    Disposable.checkDisposed(this);
    if (!this.isStopped) {
      this.isStopped = true;
      this.hasError = true;
      this.error = error;

      for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
        os[i].onError(error);
      }

      this.observers.length = 0;
    }
  },
  /**
   * Sends a value to the subject. The last value received before successful termination will be sent to all subscribed and future observers.
   * @param {Mixed} value The value to store in the subject.
   */
  onNext: function (value) {
    Disposable.checkDisposed(this);
    if (this.isStopped) { return; }
    this.value = value;
    this.hasValue = true;
  },
  /**
   * Unsubscribe all observers and release resources.
   */
  dispose: function () {
    this.isDisposed = true;
    this.observers = null;
    this.error = null;
    this.value = null;
  }
});

module.exports = AsyncSubject;
