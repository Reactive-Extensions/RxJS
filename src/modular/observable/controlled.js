'use strict';

var Observable = require('../observable');
var StopAndWaitObservable = require('./stopandwait');
var WindowedObservable = require('./windowed');
var multicast = require('./multicast');
var Notification = require('../notification');
var Observer = require('../observer');
var Subject = require('../subject');
var Scheduler = require('../scheduler');
var Disposable = require('../disposable');
var Scheduler = require('../scheduler');
var addProperties = require('../internal/addproperties');
var inherits = require('inherits');

function ControlledSubject(enableQueue, scheduler) {
  enableQueue == null && (enableQueue = true);
  this.subject = new Subject();
  this.enableQueue = enableQueue;
  this.queue = enableQueue ? [] : null;
  this.requestedCount = 0;
  this.requestedDisposable = null;
  this.error = null;
  this.hasFailed = false;
  this.hasCompleted = false;
  this.scheduler = scheduler || Scheduler.queue;
  Observable.call(this);
}

inherits(ControlledSubject, Observable);

addProperties(ControlledSubject.prototype, Observer, {
  _subscribe: function (o) {
    return this.subject.subscribe(o);
  },
  onCompleted: function () {
    this.hasCompleted = true;
    if (!this.enableQueue || this.queue.length === 0) {
      this.subject.onCompleted();
      this.disposeCurrentRequest();
    } else {
      this.queue.push(Notification.createOnCompleted());
    }
  },
  onError: function (error) {
    this.hasFailed = true;
    this.error = error;
    if (!this.enableQueue || this.queue.length === 0) {
      this.subject.onError(error);
      this.disposeCurrentRequest();
    } else {
      this.queue.push(Notification.createOnError(error));
    }
  },
  onNext: function (value) {
    if (this.requestedCount <= 0) {
      this.enableQueue && this.queue.push(Notification.createOnNext(value));
    } else {
      (this.requestedCount-- === 0) && this.disposeCurrentRequest();
      this.subject.onNext(value);
    }
  },
  _processRequest: function (numberOfItems) {
    if (this.enableQueue) {
      while (this.queue.length > 0 && (numberOfItems > 0 || this.queue[0].kind !== 'N')) {
        var first = this.queue.shift();
        first.accept(this.subject);
        if (first.kind === 'N') {
          numberOfItems--;
        } else {
          this.disposeCurrentRequest();
          this.queue = [];
        }
      }
    }

    return numberOfItems;
  },
  request: function (number) {
    this.disposeCurrentRequest();
    var self = this;

    this.requestedDisposable = this.scheduler.schedule(number,
    function(s, i) {
      var remaining = self._processRequest(i);
      var stopped = self.hasCompleted || self.hasFailed;
      if (!stopped && remaining > 0) {
        self.requestedCount = remaining;

        return Disposable.create(function () {
          self.requestedCount = 0;
        });
          // Scheduled item is still in progress. Return a new
          // disposable to allow the request to be interrupted
          // via dispose.
      }
    });

    return this.requestedDisposable;
  },
  disposeCurrentRequest: function () {
    if (this.requestedDisposable) {
      this.requestedDisposable.dispose();
      this.requestedDisposable = null;
    }
  }
});

function ControlledObservable (source, enableQueue, scheduler) {
  this.subject = new ControlledSubject(enableQueue, scheduler);
  this.source = multicast(source, this.subject).refCount();
  Observable.call(this);
}

inherits(ControlledObservable, Observable);

ControlledObservable.prototype._subscribe = function (o) {
  return this.source.subscribe(o);
};

ControlledObservable.prototype.request = function (numberOfItems) {
  return this.subject.request(numberOfItems == null ? -1 : numberOfItems);
};

ControlledObservable.prototype.stopAndWait = function (scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = Scheduler.async);
  return new StopAndWaitObservable(this, scheduler);
};

ControlledObservable.prototype.windowed = function (windowSize, scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = Scheduler.async);
  return new WindowedObservable(this, windowSize, scheduler);
};

module.exports = function controlled (source, enableQueue, scheduler) {

  if (enableQueue && Scheduler.isScheduler(enableQueue)) {
    scheduler = enableQueue;
    enableQueue = true;
  }

  if (enableQueue == null) {  enableQueue = true; }
  return new ControlledObservable(source, enableQueue, scheduler);
};
