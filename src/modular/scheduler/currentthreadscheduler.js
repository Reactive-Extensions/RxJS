'use strict';

var Scheduler = require('../scheduler');
var ScheduledItem = require('./scheduleditem');
var PriorityQueue = require('../internal/priorityqueue');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, thrower = tryCatchUtils.thrower;
var inherits = require('inherits');

function CurrentThreadScheduler() {
  Scheduler.call(this);
}

CurrentThreadScheduler.queue = null;

inherits(CurrentThreadScheduler, Scheduler);

function runTrampoline () {
  while (CurrentThreadScheduler.queue.length > 0) {
    var item = CurrentThreadScheduler.queue.dequeue();
    !item.isCancelled() && item.invoke();
  }
}

CurrentThreadScheduler.prototype.schedule = function (state, action) {
  var si = new ScheduledItem(this, state, action, this.now());

  if (!CurrentThreadScheduler.queue) {
    CurrentThreadScheduler.queue = new PriorityQueue(4);
    CurrentThreadScheduler.queue.enqueue(si);

    var result = tryCatch(runTrampoline)();
    CurrentThreadScheduler.queue = null;
    if (result === global._Rx.errorObj) { thrower(result.e); }
  } else {
    CurrentThreadScheduler.queue.enqueue(si);
  }
  return si.disposable;
};

CurrentThreadScheduler.prototype.scheduleRequired = function () { return !CurrentThreadScheduler.queue; };

global._Rx || (global._Rx = {});
global._Rx.currentThreadScheduler = new CurrentThreadScheduler();

Scheduler.currentThread = global._Rx.currentThreadScheduler;
