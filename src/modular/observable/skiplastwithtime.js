'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('util').inherits;

global.Rx || (global.Rx = {});
if (!global.Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function SkipLastWithTimeObserver(o, p) {
  this._o = o;
  this._s = p._s;
  this._d = p._d;
  this._q = [];
  AbstractObserver.call(this);
}

inherits(SkipLastWithTimeObserver, AbstractObserver);

SkipLastWithTimeObserver.prototype.next = function (x) {
  var now = this._s.now();
  this._q.push({ interval: now, value: x });
  while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
    this._o.onNext(this._q.shift().value);
  }
};
SkipLastWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
SkipLastWithTimeObserver.prototype.completed = function () {
  var now = this._s.now();
  while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
    this._o.onNext(this._q.shift().value);
  }
  this._o.onCompleted();
};

function SkipLastWithTimeObservable(source, d, s) {
  this.source = source;
  this._d = d;
  this._s = s;
  ObservableBase.call(this);
}

inherits(SkipLastWithTimeObservable, ObservableBase);

SkipLastWithTimeObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new SkipLastWithTimeObserver(o, this));
};

module.exports = function skipLastWithTime (source, duration, scheduler) {
  isScheduler(scheduler) || (scheduler = global.Rx.defaultScheduler);
  return new SkipLastWithTimeObservable(source, duration, scheduler);
};
