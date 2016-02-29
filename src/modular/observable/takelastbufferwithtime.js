'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var Scheduler = require('../scheduler');
var inherits = require('inherits');

function TakeLastBufferWithTimeObserver(o, d, s) {
  this._o = o;
  this._d = d;
  this._s = s;
  this._q = [];
  AbstractObserver.call(this);
}

inherits(TakeLastBufferWithTimeObserver, AbstractObserver);

TakeLastBufferWithTimeObserver.prototype.next = function (x) {
  var now = this._s.now();
  this._q.push({ interval: now, value: x });
  while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
    this._q.shift();
  }
};

TakeLastBufferWithTimeObserver.prototype.error = function (e) {
  this._o.onError(e);
};

TakeLastBufferWithTimeObserver.prototype.completed = function () {
  var now = this._s.now(), res = [];
  while (this._q.length > 0) {
    var next = this._q.shift();
    now - next.interval <= this._d && res.push(next.value);
  }
  this._o.onNext(res);
  this._o.onCompleted();
};

function TakeLastBufferWithTimeObservable(source, duration, scheduler) {
  this.source = source;
  this._d = duration;
  this._s = scheduler;
  ObservableBase.call(this);
}

inherits(TakeLastBufferWithTimeObservable, ObservableBase);

TakeLastBufferWithTimeObservable.prototype.subscribeCore = function (o) {
  return this.source.subscribe(new TakeLastBufferWithTimeObserver(o, this._d, this._s));
};

module.exports = function takeLastBufferWithTime (source, duration, scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = Scheduler.async);
  return new TakeLastBufferWithTimeObservable(source, duration, scheduler);
};
