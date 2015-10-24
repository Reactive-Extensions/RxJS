'use strict';

var Disposable = require('./disposable');
var Observable = require('./observable');
var Observer = require('./observer');
var InnerSubscription = require('./internal/innersubscription');
var addProperties = require('./internal/addproperties');
var cloneArray = require('./internal/clonearray');
var inherits = require('util').inherits;

/**
*  Represents an object that is both an observable sequence as well as an observer.
*  Each notification is broadcasted to all subscribed observers.
*/
function Subject() {
  Observable.call(this);
  this.isDisposed = false;
  this.isStopped = false;
  this.observers = [];
  this.hasError = false;
}

inherits(Subject, Observable);

addProperties(Subject.prototype, Observer.prototype, {
  _subscribe: function (o) {
    Disposable.checkDisposed(this);
    if (!this.isStopped) {
      this.observers.push(o);
      return new InnerSubscription(this, o);
    }
    if (this.hasError) {
      o.onError(this.error);
      return Disposable.empty;
    }
    o.onCompleted();
    return Disposable.empty;
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
    if (!this.isStopped) {
      this.isStopped = true;
      for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
        os[i].onCompleted();
      }

      this.observers.length = 0;
    }
  },
  /**
   * Notifies all subscribed observers about the exception.
   * @param {Mixed} error The exception to send to all observers.
   */
  onError: function (error) {
    Disposable.checkDisposed(this);
    if (!this.isStopped) {
      this.isStopped = true;
      this.error = error;
      this.hasError = true;
      for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
        os[i].onError(error);
      }

      this.observers.length = 0;
    }
  },
  /**
   * Notifies all subscribed observers about the arrival of the specified element in the sequence.
   * @param {Mixed} value The value to send to all observers.
   */
  onNext: function (value) {
    Disposable.checkDisposed(this);
    if (!this.isStopped) {
      for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
        os[i].onNext(value);
      }
    }
  },
  /**
   * Unsubscribe all observers and release resources.
   */
  dispose: function () {
    this.isDisposed = true;
    this.observers = null;
  }
});

Subject.addToObject = function (operators) {
  Object.keys(operators).forEach(function (operator) {
    Subject[operator] = operators[operator];
  });
};

Subject.addToPrototype = function (operators) {
  Object.keys(operators).forEach(function (operator) {
    Subject.prototype[operator] = function () {
      var args = [this];
      args.push.apply(args, arguments);
      return operators[operator].apply(null, args);
    };
  });
};


module.exports = Subject;
