'use strict';

var ObservableBase = require('./observablebase');
var Scheduler = require('../scheduler');
var inherits = require('inherits');

function scheduleRecursive(state, recurse) {
  if (state.i < state.len) {
    state.o.onNext(state.args[state.i++]);
    recurse(state);
  } else {
    state.o.onCompleted();
  }
}

function FromArrayObservable(args, scheduler) {
  this._args = args;
  this._scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(FromArrayObservable, ObservableBase);

FromArrayObservable.prototype.subscribeCore = function (o) {
  var state = {
    i: 0,
    args: this._args,
    len: this._args.length,
    o: o
  };
  return this._scheduler.scheduleRecursive(state, scheduleRecursive);
};

module.exports = function fromArray(array, scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = Scheduler.queue);
  return new FromArrayObservable(array, scheduler);
};
