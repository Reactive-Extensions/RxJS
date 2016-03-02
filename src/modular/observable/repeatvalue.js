'use strict';

var ObservableBase = require('./observablebase');
var Scheduler = require('../scheduler');
var inherits = require('inherits');

function RepeatValueObservable(value, count, scheduler) {
  this._value = value;
  this._count = count;
  this._scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(RepeatValueObservable, ObservableBase);

function scheduleRecursive(state, recurse) {
  if (state.n === 0) { return state.o.onCompleted(); }
  if (state.n > 0) { state.n--; }
  state.o.onNext(state.value);
  recurse(state);
}

RepeatValueObservable.prototype.subscribeCore = function (o) {
  var state = {
    value: this._value,
    n: this._count,
    o: o
  };
  return this._scheduler.scheduleRecursive(state, scheduleRecursive);
};

module.exports = function repeatValue (value, repeatCount, scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = Scheduler.queue);
  return new RepeatValueObservable(value, repeatCount, scheduler);
};
