'use strict';

var ObservableBase = require('./observablebase');
var SerialDisposable = require('../serialdisposable');
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('inherits');

global._Rx || (global._Rx = {});
if (!global._Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function DelaySubscription(source, dt, s) {
  this.source = source;
  this._dt = dt;
  this._s = s;
  ObservableBase.call(this);
}

inherits(DelaySubscription, ObservableBase);

function scheduleMethod(s, state) {
  var source = state[0], o = state[1], d = state[2];
  d.setDisposable(source.subscribe(o));
}

DelaySubscription.prototype.subscribeCore = function (o) {
  var d = new SerialDisposable();
  d.setDisposable(this._s.scheduleFuture([this.source, o, d], this._dt, scheduleMethod));
  return d;
};

/**
 *  Time shifts the observable sequence by delaying the subscription with the specified relative time duration, using the specified scheduler to run timers.
 * @param {Number} dueTime Relative or absolute time shift of the subscription.
 * @param {Scheduler} [scheduler]  Scheduler to run the subscription delay timer on. If not specified, the timeout scheduler is used.
 * @returns {Observable} Time-shifted sequence.
 */
module.exports = function delaySubscription (source, dueTime, scheduler) {
  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
  return new DelaySubscription(source, dueTime, scheduler);
};
