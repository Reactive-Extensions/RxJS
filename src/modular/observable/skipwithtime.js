'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var BinaryDisposable = require('../binarydisposable');
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('inherits');

global.Rx || (global.Rx = {});
if (!global.Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function SkipWithTimeObserver(o, p) {
  this._o = o;
  this._p = p;
  AbstractObserver.call(this);
}

inherits(SkipWithTimeObserver, AbstractObserver);

SkipWithTimeObserver.prototype.next = function (x) { this._p._open && this._o.onNext(x); };
SkipWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
SkipWithTimeObserver.prototype.completed = function () { this._o.onCompleted(); };

function SkipWithTimeObservable(source, d, s) {
  this.source = source;
  this._d = d;
  this._s = s;
  this._open = false;
  ObservableBase.call(this);
}

inherits(SkipWithTimeObservable, ObservableBase);

function scheduleMethod(s, self) {
  self._open = true;
}

SkipWithTimeObservable.prototype.subscribeCore = function (o) {
  return new BinaryDisposable(
    this._s.scheduleFuture(this, this._d, scheduleMethod),
    this.source.subscribe(new SkipWithTimeObserver(o, this))
  );
};

module.exports = function skipWithTime (source, duration, scheduler) {
  isScheduler(scheduler) || (scheduler = global.Rx.defaultScheduler);
  return new SkipWithTimeObservable(source, duration, scheduler);
};
