'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('util').inherits;

global.Rx || (global.Rx = {});
if (!global.Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function TakeLastWithTimeObserver(o, d, s) {
  this._o = o;
  this._d = d;
  this._s = s;
  this._q = [];
  AbstractObserver.call(this);
}

inherits(TakeLastWithTimeObserver, AbstractObserver);

TakeLastWithTimeObserver.prototype.next = function (x) {
  var now = this._s.now();
  this._q.push({ interval: now, value: x });
  while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
    this._q.shift();
  }
};
TakeLastWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
TakeLastWithTimeObserver.prototype.completed = function () {
  var now = this._s.now();
  while (this._q.length > 0) {
    var next = this._q.shift();
    if (now - next.interval <= this._d) { this._o.onNext(next.value); }
  }
  this._o.onCompleted();
};

function TakeLastWithTimeObservable(source, d, s) {
  this.source = source;
  this._d = d;
  this._s = s;
  ObservableBase.call(this);
}

inherits(TakeLastWithTimeObservable, ObservableBase);

TakeLastWithTimeObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new TakeLastWithTimeObserver(o, this._d, this._s));
};

module.exports = function takeLastWithTime (source, duration, scheduler) {
  isScheduler(scheduler) || (scheduler = global.Rx.defaultScheduler);
  return new TakeLastWithTimeObservable(source, duration, scheduler);
};
