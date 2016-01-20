'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('inherits');

global._Rx || (global._Rx = {});
if (!global._Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function ThrottleObserver(s) {
  this._s = s;
  AbstractObserver.call(this);
}

inherits(ThrottleObserver, AbstractObserver);

ThrottleObserver.prototype.next = function (x) {
  var now = this._s.scheduler.now();
  if (this._s.lastOnNext === 0 || now - this._s.lastOnNext >= this._s.duration) {
    this._s.lastOnNext = now;
    this._s.o.onNext(x);
  }
};
ThrottleObserver.prototype.error = function (e) { this._s.o.onError(e); };
ThrottleObserver.prototype.completed = function () { this._s.o.onCompleted(); };

function ThrottleObservable(source, duration, scheduler) {
  this.source = source;
  this._duration = duration;
  this._scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(ThrottleObservable, ObservableBase);

ThrottleObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new ThrottleObserver({
    o: o,
    duration: this._duration,
    scheduler: this._scheduler,
    lastOnNext: 0
  }));
};

module.exports = function throttle(source, windowDuration, scheduler) {
  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
  var duration = +windowDuration || 0;
  if (duration <= 0) { throw new RangeError('windowDuration cannot be less or equal zero.'); }
  return new ThrottleObservable(source, duration, scheduler);
};
