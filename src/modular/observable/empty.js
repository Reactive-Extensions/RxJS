'use strict';

var ObservableBase = require('./observablebase');
var Disposable = require('../disposable');
var Scheduler = require('../scheduler');
var inherits = require('inherits');

global._Rx || (global._Rx = {});
if (!global._Rx.immediateScheduler) {
  require('../scheduler/immediatescheduler');
}

function scheduleItem(s, state) {
  state.onCompleted();
  return Disposable.empty;
}

function EmptyObservable(scheduler) {
  this._scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(EmptyObservable, ObservableBase);

EmptyObservable.prototype.subscribeCore = function (o) {
  return this.scheduler === global._Rx.immediateScheduler ?
    scheduleItem(null, o) :
    this._scheduler.schedule(o, scheduleItem);
};

var EMPTY_OBSERVABLE = new EmptyObservable(global._Rx.immediateScheduler);

/**
 *  Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.
 *
 * @example
 *  var res = Rx.Observable.empty();
 *  var res = Rx.Observable.empty(Rx.Scheduler.timeout);
 * @param {Scheduler} [scheduler] Scheduler to send the termination call on.
 * @returns {Observable} An observable sequence with no elements.
 */
module.exports = function empty (scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = global._Rx.immediateScheduler);
  return scheduler === global._Rx.immediateScheduler ? EMPTY_OBSERVABLE : new EmptyObservable(scheduler);
};
