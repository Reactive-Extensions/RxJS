'use strict';

var AbstractObserver = require('../observer/abstractobserver');
var ObservableBase = require('./observablebase');
var inherits = require('util').inherits;

function ToArrayObserver(o) {
  this.o = o;
  this.a = [];
  AbstractObserver.call(this);
}

inherits(ToArrayObserver, AbstractObserver);

ToArrayObserver.prototype.next = function (x) { this.a.push(x); };
ToArrayObserver.prototype.error = function (e) { this.o.onError(e);  };
ToArrayObserver.prototype.completed = function () { this.o.onNext(this.a); this.o.onCompleted(); };

function ToArrayObservable(source) {
  this.source = source;
  ObservableBase.call(this);
}

inherits(ToArrayObservable, ObservableBase);

ToArrayObservable.prototype.subscribeCore = function(o) {
  return this.source.subscribe(new ToArrayObserver(o));
};

/**
* Creates an array from an observable sequence.
* @returns {Observable} An observable sequence containing a single element with a list containing all the elements of the source sequence.
*/
module.exports = function toArray(o) {
  return new ToArrayObservable(o);
};
