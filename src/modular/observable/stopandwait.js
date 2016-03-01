'use strict';

var Observable = require('../observable');
var AbstractObserver = require('../observer/abstractobserver');
var BinaryDisposable = require('../binarydisposable');
var inherits = require('inherits');

function StopAndWaitObserver(observer, observable, scheduler, cancel) {
  this.observer = observer;
  this.observable = observable;
  this.scheduler = scheduler;
  this.cancel = cancel;
  this.scheduleDisposable = null;
  AbstractObserver.call(this);
}

inherits(StopAndWaitObserver, AbstractObserver);

StopAndWaitObserver.prototype.completed = function () {
  this.observer.onCompleted();
  this.dispose();
};

StopAndWaitObserver.prototype.error = function (error) {
  this.observer.onError(error);
  this.dispose();
};

function innerScheduleMethod(s, self) {
  return self.observable.source.request(1);
}

StopAndWaitObserver.prototype.next = function (value) {
  this.observer.onNext(value);
  this.scheduleDisposable = this.scheduler.schedule(this, innerScheduleMethod);
};

StopAndWaitObserver.prototype.dispose = function () {
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

function StopAndWaitObservable(source, scheduler) {
  this.source = source;
  this.scheduler = scheduler;
  Observable.call(this);
}

inherits(StopAndWaitObservable, Observable);

function scheduleMethod(s, self) {
  return self.source.request(1);
}

StopAndWaitObservable.prototype._subscribe = function (o) {
  this.subscription = this.source.subscribe(new StopAndWaitObserver(o, this, this.scheduler, this.subscription));
  return new BinaryDisposable(
    this.subscription,
    this.scheduler.schedule(this, scheduleMethod)
  );
};

module.exports = StopAndWaitObservable;
