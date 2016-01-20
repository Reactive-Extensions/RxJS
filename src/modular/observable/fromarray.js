'use strict';

var ObservableBase = require('./observablebase');
var Scheduler = require('../scheduler');
var inherits = require('inherits');

global._Rx || (global._Rx = {});
if (!global._Rx.currentThreadScheduler) {
  require('../scheduler/currentthreadscheduler');
}

function scheduleMethod(o, args) {
  return function loopRecursive (i, recurse) {
    if (i < args.length) {
      o.onNext(args[i]);
      recurse(i + 1);
    } else {
      o.onCompleted();
    }
  };
}

function FromArrayObservable(args, scheduler) {
  this._args = args;
  this._scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(FromArrayObservable, ObservableBase);

FromArrayObservable.prototype.subscribeCore = function (o) {
  return this._scheduler.scheduleRecursive(0, scheduleMethod(o, this._args));
};

module.exports = function fromArray(array, scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = global._Rx.currentThreadScheduler);
  return new FromArrayObservable(array, scheduler);
};
