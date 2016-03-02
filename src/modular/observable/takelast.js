'use strict';

var ObservableBase = require('./observablebase');
var AbstractObserver = require('../observer/abstractobserver');
var Scheduler = require('../scheduler');
var BinaryDisposable = require('../binarydisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var ArgumentOutOfRangeError = require('../internal/errors').ArgumentOutOfRangeError;
var inherits = require('inherits');

function TakeLastObserver(o, c, s, ss, ls) {
  this._o = o;
  this._c = c;
  this._s = s;
  this._ls = ls;
  this._ss = ss;
  this._q = [];
  AbstractObserver.call(this);
}

inherits(TakeLastObserver, AbstractObserver);

TakeLastObserver.prototype.next = function (x) {
  this._q.push(x);
  this._q.length > this._c && this._q.shift();
};

TakeLastObserver.prototype.error = function (e) {
  this._o.onError(e);
};

function loopRecursive(state, recurse) {
  if (state[1].length > 0) {
    state[0].onNext(state[1].shift());
    recurse(state);
  } else {
    state[0].onCompleted();
  }
}

TakeLastObserver.prototype.completed = function () {
  this._ss.dispose();
  this._ls.setDisposable(this._s.scheduleRecursive([this._o, this._q], loopRecursive));
};

function TakeLastObservable(source, count, scheduler) {
  this.source = source;
  this.count = count;
  this.scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(TakeLastObservable, ObservableBase);

TakeLastObservable.prototype.subscribeCore = function (o) {
  var subscription = new SingleAssignmentDisposable();
  var loopSubscription = new SingleAssignmentDisposable();
  subscription.setDisposable(this.source.subscribe(new TakeLastObserver(o, this.count, this.scheduler, subscription, loopSubscription)));

  return new BinaryDisposable(subscription, loopSubscription);
};

module.exports = function takeLast (source, count, scheduler) {
  if (count < 0) { throw new ArgumentOutOfRangeError(); }
  Scheduler.isScheduler(scheduler) || (scheduler = Scheduler.queue);
  return new TakeLastObservable(source, count, scheduler);
};
