'use strict';

var Observable = require('../observable');
var Observer = require('../observer');
var addProperties = require('../internal/addproperties');
var inherits = require('util').inherits;

function AnonymousSubject(observer, observable) {
  this.observer = observer;
  this.observable = observable;
  Observable.call(this);
}

inherits(AnonymousSubject, Observable);

addProperties(AnonymousSubject.prototype, Observer.prototype, {
  _subscribe: function (o) {
    return this.observable.subscribe(o);
  },
  onCompleted: function () {
    this.observer.onCompleted();
  },
  onError: function (error) {
    this.observer.onError(error);
  },
  onNext: function (value) {
    this.observer.onNext(value);
  }
});

/**
 * Creates a subject from the specified observer and observable.
 * @param {Observer} observer The observer used to send messages to the subject.
 * @param {Observable} observable The observable used to subscribe to messages sent from the subject.
 * @returns {Subject} Subject implemented using the given observer and observable.
 */
module.exports = function create(observer, observable) {
  return new AnonymousSubject(observer, observable);
};
