'use strict';

var ObservableBase = require('./observablebase');
var Disposable = require('../disposable');
var Scheduler = require('../scheduler');
var inherits = require('util').inherits;

global.Rx || (global.Rx = {});
if (!global.Rx.immediateScheduler) {
  require('../scheduler/immediatescheduler');
}

function scheduleItem(s, state) {
  var value = state[0], observer = state[1];
  observer.onNext(value);
  observer.onCompleted();
  return Disposable.empty;
}

function JustObservable(value, scheduler) {
  this._value = value;
  this._scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(JustObservable, ObservableBase);

JustObservable.prototype.subscribeCore = function (o) {
  var state = [this._value, o];
  return this._scheduler === global.Rx.immediateScheduler ?
    scheduleItem(null, state) :
    this._scheduler.schedule(state, scheduleItem);
};

module.exports = function just(value, scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = global.Rx.immediateScheduler);
  return new JustObservable(value, scheduler);
};
