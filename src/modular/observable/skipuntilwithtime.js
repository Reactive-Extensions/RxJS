'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var BinaryDisposable = require('../binarydisposable');
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('util').inherits;

global.Rx || (global.Rx = {});
if (!global.Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function SkipUntilWithTimeObserver(o, p) {
  this._o = o;
  this._p = p;
  AbstractObserver.call(this);
}

inherits(SkipUntilWithTimeObserver, AbstractObserver);

SkipUntilWithTimeObserver.prototype.next = function (x) { this._p._open && this._o.onNext(x); };
SkipUntilWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
SkipUntilWithTimeObserver.prototype.completed = function () { this._o.onCompleted(); };

function SkipUntilWithTimeObservable(source, startTime, scheduler) {
  this.source = source;
  this._st = startTime;
  this._s = scheduler;
  ObservableBase.call(this);
}

inherits(SkipUntilWithTimeObservable, ObservableBase);

function scheduleMethod(s, state) {
  state._open = true;
}

SkipUntilWithTimeObservable.prototype.subscribeCore = function (o) {
  this._open = false;
  return new BinaryDisposable(
    this._s.scheduleFuture(this, this._st, scheduleMethod),
    this.source.subscribe(new SkipUntilWithTimeObserver(o, this))
  );
};

module.exports = function skipUntilWithTime (source, startTime, scheduler) {
  isScheduler(scheduler) || (scheduler = global.Rx.defaultScheduler);
  return new SkipUntilWithTimeObservable(source, startTime, scheduler);
};
