'use strict';

var Scheduler = require('./scheduler');
var ScheduledItem = require('./scheduleditem');
var PriorityQueue = require('../internal/priorityqueue');
var inherits = require('inherits');

function QueueScheduler() {
  Scheduler.call(this);
}

QueueScheduler.queue = null;

inherits(QueueScheduler, Scheduler);

function runTrampoline () {
  while (QueueScheduler.queue.length > 0) {
    var item = QueueScheduler.queue.dequeue();
    !item.isCancelled() && item.invoke();
  }
}

QueueScheduler.prototype.schedule = function (state, action) {
  var si = new ScheduledItem(this, state, action, this.now());

  if (!QueueScheduler.queue) {
    QueueScheduler.queue = new PriorityQueue(4);
    QueueScheduler.queue.enqueue(si);

    try {
      runTrampoline();
    } finally {
      QueueScheduler.queue = null;
    }
  } else {
    QueueScheduler.queue.enqueue(si);
  }
  return si.disposable;
};

QueueScheduler.prototype.scheduleRequired = function () { return !QueueScheduler.queue; };

module.exports = QueueScheduler;
