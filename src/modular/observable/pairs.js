'use strict';

var ObservableBase = require('./observablebase');
var Scheduler = require('../scheduler');
var inherits = require('util').inherits;

function scheduleMethod(o, obj, keys) {
  return function loopRecursive(i, recurse) {
    if (i < keys.length) {
      var key = keys[i];
      o.onNext([key, obj[key]]);
      recurse(i + 1);
    } else {
      o.onCompleted();
    }
  };
}

function PairsObservable(o, scheduler) {
  this._o = o;
  this._keys = Object.keys(o);
  this._scheduler = scheduler;
  ObservableBase.call(this);
}

inherits(PairsObservable, ObservableBase);

PairsObservable.prototype.subscribeCore = function (o) {
  return this._scheduler.scheduleRecursive(0, scheduleMethod(o, this._o, this._keys));
};

module.exports = function pairs(obj, scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = global.Rx.currentThreadScheduler);
  return new PairsObservable(obj, scheduler);
};
