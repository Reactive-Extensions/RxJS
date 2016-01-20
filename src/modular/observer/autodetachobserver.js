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

AutoDetachObserver.prototype.next = function (value) {
  var result = tryCatch(this.observer.onNext).call(this.observer, value);
  if (result === global._Rx.errorObj) {
    this.dispose();
    thrower(result.e);
  }
};

AutoDetachObserver.prototype.error = function (err) {
  var result = tryCatch(this.observer.onError).call(this.observer, err);
  this.dispose();
  result === global._Rx.errorObj && thrower(result.e);
};

AutoDetachObserver.prototype.completed = function () {
  var result = tryCatch(this.observer.onCompleted).call(this.observer);
  this.dispose();
  result === global._Rx.errorObj && thrower(result.e);
};

AutoDetachObserver.prototype.setDisposable = function (value) { this.m.setDisposable(value); };
AutoDetachObserver.prototype.getDisposable = function () { return this.m.getDisposable(); };

AutoDetachObserver.prototype.dispose = function () {
  AbstractObserver.prototype.dispose.call(this);
  this.m.dispose();
};

module.exports = AutoDetachObserver;
