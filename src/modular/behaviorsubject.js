'use strict';

var Observable = require('./observable');
var Observer = require('./observer');
var Disposable = require('./disposable');
var InnerSubscription = require('./internal/innersubscription');
var addProperties = require('./internal/addproperties');
var cloneArray = require('./internal/clonearray');
var thrower = require('./internal/trycatchutils').thrower;
var inherits = require('util').inherits;

/**
*  Represents a value that changes over time.
*  Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications.
*/
function BehaviorSubject(value) {
  this.value = value;
  this.observers = [];
  this.isDisposed = false;
  this.isStopped = false;
  this.hasError = false;
  Observable.call(this);
}

inherits(BehaviorSubject, Observable);

addProperties(BehaviorSubject.prototype, Observer.prototype, {
  _subscribe: function (o) {
    Disposable.checkDisposed(this);
    if (!this.isStopped) {
      this.observers.push(o);
      o.onNext(this.value);
      return new InnerSubscription(this, o);
    }
    if (this.hasError) {
      o.onError(this.error);
    } else {
      o.onCompleted();
    }
    return Disposable.empty;
  },
  /**
   * Gets the current value or throws an exception.
   * Value is frozen after onCompleted is called.
   * After onError is called always throws the specified exception.
   * An exception is always thrown after dispose is called.
   * @returns {Mixed} The initial value passed to the constructor until onNext is called; after which, the last value passed to onNext.
   */
  getValue: function () {
    Disposable.checkDisposed(this);
    if (this.hasError) { thrower(this.error); }
    return this.value;
  },
  /**
   * Indicates whether the subject has observers subscribed to it.
   * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
   */
  hasObservers: function () { return this.observers.length > 0; },
  /**
   * Notifies all subscribed observers about the end of the sequence.
   */
  onCompleted: function () {
    Disposable.checkDisposed(this);
    if (this.isStopped) { return; }
    this.isStopped = true;
    for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
      os[i].onCompleted();
    }

    this.observers.length = 0;
  },
  /**
   * Notifies all subscribed observers about the exception.
   * @param {Mixed} error The exception to send to all observers.
   */
  onError: function (error) {
    Disposable.checkDisposed(this);
    if (this.isStopped) { return; }
    this.isStopped = true;
    this.hasError = true;
    this.error = error;

    for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
      os[i].onError(error);
    }

    this.observers.length = 0;
  },
  /**
   * Notifies all subscribed observers about the arrival of the specified element in the sequence.
   * @param {Mixed} value The value to send to all observers.
   */
  onNext: function (value) {
    Disposable.checkDisposed(this);
    if (this.isStopped) { return; }
    this.value = value;
    for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
      os[i].onNext(value);
    }
  },
  /**
   * Unsubscribe all observers and release resources.
   */
  dispose: function () {
    this.isDisposed = true;
    this.observers = null;
    this.value = null;
    this.error = null;
  }
});

module.exports = BehaviorSubject;
