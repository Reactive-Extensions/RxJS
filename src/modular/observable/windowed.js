'use strict';

var Observable = require('../observable');
var AbstractObserver = require('../observer/abstractobserver');
var BinaryDisposable = require('../binarydisposable');
var inherits = require('inherits');

function WindowedObserver(observer, observable, scheduler, cancel) {
  this.observer = observer;
  this.observable = observable;
  this.scheduler = scheduler;
  this.cancel = cancel;
  this.received = 0;
  this.scheduleDisposable = null;
  AbstractObserver.call(this);
}

inherits(WindowedObserver, AbstractObserver);

WindowedObserver.prototype.completed = function () {
  this.observer.onCompleted();
  this.dispose();
};

WindowedObserver.prototype.error = function (error) {
  this.observer.onError(error);
  this.dispose();
};

function innerScheduleMethod(s, self) {
  return self.observable.source.request(self.observable.windowSize);
}

WindowedObserver.prototype.next = function (value) {
  this.observer.onNext(value);
  this.received = ++this.received % this.observable.windowSize;
  this.received === 0 && (this.scheduleDisposable = this.scheduler.schedule(this, innerScheduleMethod));
};

WindowedObserver.prototype.dispose = function () {
  this.observer = null;
  if (this.cancel) {
    this.cancel.dispose();
    this.cancel = null;
  }
  if (this.scheduleDisposable) {
    this.scheduleDisposable.dispose();
    this.scheduleDisposable = null;
  }
  AbstractObserver.prototype.dispose.call(this);
};

function WindowedObservable(source, windowSize, scheduler) {
  this.source = source;
  this.windowSize = windowSize;
  this.scheduler = scheduler;
  Observable.call(this);
}

inherits(WindowedObservable, Observable);

function scheduleMethod(s, self) {
  return self.source.request(self.windowSize);
}

WindowedObservable.prototype._subscribe = function (o) {
  this.subscription = this.source.subscribe(new WindowedObserver(o, this, this.scheduler, this.subscription));
  return new BinaryDisposable(
    this.subscription,
    this.scheduler.schedule(this, scheduleMethod)
  );
};

module.exports = WindowedObservable;
