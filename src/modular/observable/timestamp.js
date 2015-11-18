'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('util').inherits;

global.Rx || (global.Rx = {});
if (!global.Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function TimestampObserver(o, s) {
  this._o = o;
  this._s = s;
  AbstractObserver.call(this);
}

inherits(TimestampObserver, AbstractObserver);

TimestampObserver.prototype.next = function (x) { this._o.onNext({ value: x, timestamp: this._s.now() }); };
TimestampObserver.prototype.error = function (e) { this._o.onError(e); };
TimestampObserver.prototype.completed = function () { this._o.onCompleted(); };


function TimestampObservable(source, s) {
  this.source = source;
  this._s = s;
  ObservableBase.call(this);
}

inherits(TimestampObservable, ObservableBase);

TimestampObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new TimestampObserver(o, this._s));
};

module.exports = function timestamp (source, scheduler) {
  isScheduler(scheduler) || (scheduler = global.Rx.defaultScheduler);
  return new TimestampObservable(this, scheduler);
};
