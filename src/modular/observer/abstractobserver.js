'use strict';

var Observer = require('../observer');
var inherits = require('inherits');
var NotImplementedError = require('../internal/errors').NotImplementedError;

function notImplemented() {
  throw new NotImplementedError();
}

function AbstractObserver() {
  this.isStopped = false;
  Observer.call(this);
}

inherits(AbstractObserver, Observer);

// Must be implemented by other observers
AbstractObserver.prototype.next = notImplemented;
AbstractObserver.prototype.error = notImplemented;
AbstractObserver.prototype.completed = notImplemented;

AbstractObserver.prototype.onNext = function (value) {
  if (!this.isStopped) { this.next(value); }
};

AbstractObserver.prototype.onError = function (error) {
  if (!this.isStopped) {
    this.isStopped = true;
    this.error(error);
  }
};

AbstractObserver.prototype.onCompleted = function () {
  if (!this.isStopped) {
    this.isStopped = true;
    this.completed();
  }
};

AbstractObserver.prototype.dispose = function () {
  this.isStopped = true;
};

AbstractObserver.prototype.fail = function (e) {
  if (!this.isStopped) {
    this.isStopped = true;
    this.error(e);
    return true;
  }

  return false;
};

module.exports = AbstractObserver;
