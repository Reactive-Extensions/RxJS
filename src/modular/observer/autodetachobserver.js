'use strict';

var AbstractObserver = require('./abstractobserver');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var inherits = require('inherits');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, thrower = tryCatchUtils.thrower;

function AutoDetachObserver(observer) {
  AbstractObserver.call(this);
  this.observer = observer;
  this.m = new SingleAssignmentDisposable();
}

inherits(AutoDetachObserver, AbstractObserver);

var AutoDetachObserverPrototype = AutoDetachObserver.prototype;

AutoDetachObserverPrototype.next = function (value) {
  var result = tryCatch(this.observer.onNext).call(this.observer, value);
  if (result === global.Rx.errorObj) {
    this.dispose();
    thrower(result.e);
  }
};

AutoDetachObserverPrototype.error = function (err) {
  var result = tryCatch(this.observer.onError).call(this.observer, err);
  this.dispose();
  result === global.Rx.errorObj && thrower(result.e);
};

AutoDetachObserverPrototype.completed = function () {
  var result = tryCatch(this.observer.onCompleted).call(this.observer);
  this.dispose();
  result === global.Rx.errorObj && thrower(result.e);
};

AutoDetachObserverPrototype.setDisposable = function (value) { this.m.setDisposable(value); };
AutoDetachObserverPrototype.getDisposable = function () { return this.m.getDisposable(); };

AutoDetachObserverPrototype.dispose = function () {
  AbstractObserver.prototype.dispose.call(this);
  this.m.dispose();
};

module.exports = AutoDetachObserver;
