'use strict';

var ObservableBase = require('./observablebase');
var BinaryDisposable = require('../binarydisposable');
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('inherits');

global._Rx || (global._Rx = {});
if (!global._Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function TakeUntilWithTimeObservable(source, end, scheduler) {
  this.source = source;
  this._e = end;
  this._s = scheduler;
  ObservableBase.call(this);
}

inherits(TakeUntilWithTimeObservable, ObservableBase);

function scheduleMethod(s, o) {
  o.onCompleted();
}

TakeUntilWithTimeObservable.prototype.subscribeCore = function (o) {
  return new BinaryDisposable(
    this._s.scheduleFuture(o, this._e, scheduleMethod),
    this.source.subscribe(o));
};

module.exports = function takeUntilWithTime (source, endTime, scheduler) {
  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
  return new TakeUntilWithTimeObservable(source, endTime, scheduler);
};
