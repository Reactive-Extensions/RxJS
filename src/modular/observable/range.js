'use strict';

var ObservableBase = require('./observablebase');
var Scheduler = require('../scheduler');
var inherits = require('inherits');

global._Rx || (global._Rx = {});
if (!global._Rx.currentThreadScheduler) {
  require('../scheduler/currentthreadscheduler');
}

function RangeObservable(start, count, scheduler) {
  this.start = start;
  this.rangeCount = count;
  this.scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(RangeObservable, ObservableBase);

function loopRecursive(start, count, o) {
  return function loop (i, recurse) {
    if (i < count) {
      o.onNext(start + i);
      recurse(i + 1);
    } else {
      o.onCompleted();
    }
  };
}

RangeObservable.prototype.subscribeCore = function (o) {
  return this.scheduler.scheduleRecursive(
    0,
    loopRecursive(this.start, this.rangeCount, o)
  );
};

/**
*  Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
* @param {Number} start The value of the first integer in the sequence.
* @param {Number} count The number of sequential integers to generate.
* @param {Scheduler} [scheduler] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.
* @returns {Observable} An observable sequence that contains a range of sequential integral numbers.
*/
module.exports = function range(start, count, scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = global._Rx.currentThreadScheduler);
  return new RangeObservable(start, count, scheduler);
};
