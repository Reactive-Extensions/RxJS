'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('util').inherits;

global.Rx || (global.Rx = {});
if (!global.Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function TimeIntervalObserver(o, s) {
  this._o = o;
  this._s = s;
  this._l = s.now();
  AbstractObserver.call(this);
}

inherits(TimeIntervalObserver, AbstractObserver);

TimeIntervalObserver.prototype.next = function (x) {
  var now = this._s.now(), span = now - this._l;
  this._l = now;
  this._o.onNext({ value: x, interval: span });
};
TimeIntervalObserver.prototype.error = function (e) { this._o.onError(e); };
TimeIntervalObserver.prototype.completed = function () { this._o.onCompleted(); };

function TimeIntervalObservable(source, s) {
  this.source = source;
  this._s = s;
  ObservableBase.call(this);
}

inherits(TimeIntervalObservable, ObservableBase);

TimeIntervalObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new TimeIntervalObserver(o, this._s));
};

module.exports = function timeInterval (source, scheduler) {
  isScheduler(scheduler) || (scheduler = global.Rx.defaultScheduler);
  return new TimeIntervalObservable(source, scheduler);
};
