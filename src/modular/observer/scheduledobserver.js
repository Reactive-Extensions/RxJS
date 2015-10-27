'use strict';

var AbstractObserver = require('./abstractobserver');
var SerialDisposable = require('../serialdisposable');
var inherits = require('util').inherits;
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, thrower = tryCatchUtils.thrower;

function ScheduledObserver(scheduler, observer) {
  AbstractObserver.call(this);
  this.scheduler = scheduler;
  this.observer = observer;
  this.isAcquired = false;
  this.hasFaulted = false;
  this.queue = [];
  this.disposable = new SerialDisposable();
}

inherits(ScheduledObserver, AbstractObserver);

function enqueueNext(observer, x) { return function () { observer.onNext(x); }; }
function enqueueError(observer, e) { return function () { observer.onError(e); }; }
function enqueueCompleted(observer) { return function () { observer.onCompleted(); }; }

ScheduledObserver.prototype.next = function (x) {
  this.queue.push(enqueueNext(this.observer, x));
};

ScheduledObserver.prototype.error = function (e) {
  this.queue.push(enqueueError(this.observer, e));
};

ScheduledObserver.prototype.completed = function () {
  this.queue.push(enqueueCompleted(this.observer));
};

function scheduleMethod(state, recurse) {
  var work;
  if (state.queue.length > 0) {
    work = state.queue.shift();
  } else {
    state.isAcquired = false;
    return;
  }
  var res = tryCatch(work)();
  if (res === global.Rx.errorObj) {
    state.queue = [];
    state.hasFaulted = true;
    return thrower(res.e);
  }
  recurse(state);
}

ScheduledObserver.prototype.ensureActive = function () {
  var isOwner = false;
  if (!this.hasFaulted && this.queue.length > 0) {
    isOwner = !this.isAcquired;
    this.isAcquired = true;
  }
  isOwner &&
    this.disposable.setDisposable(this.scheduler.scheduleRecursive(this, scheduleMethod));
};

ScheduledObserver.prototype.dispose = function () {
  AbstractObserver.prototype.dispose.call(this);
  this.disposable.dispose();
};

module.exports = ScheduledObserver;
