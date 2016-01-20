'use strict';

var ObservableBase = require('./observablebase');
var interval = require('./interval');
var AbstractObserver = require('../observer/abstractobserver');
var BinaryDisposable = require('../binarydisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var isScheduler = require('../scheduler').isScheduler;
var inherits = require('inherits');

global._Rx || (global._Rx = {});
if (!global._Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function SamplerObserver(s) {
  this._s = s;
  AbstractObserver.call(this);
}

inherits(SamplerObserver, AbstractObserver);

SamplerObserver.prototype._handleMessage = function () {
  if (this._s.hasValue) {
    this._s.hasValue = false;
    this._s.o.onNext(this._s.value);
  }
  this._s.atEnd && this._s.o.onCompleted();
};

SamplerObserver.prototype.next = function () { this._handleMessage(); };
SamplerObserver.prototype.error = function (e) { this._s.onError(e); };
SamplerObserver.prototype.completed = function () { this._handleMessage(); };

function SampleSourceObserver(s) {
  this._s = s;
  AbstractObserver.call(this);
}

inherits(SampleSourceObserver, AbstractObserver);

SampleSourceObserver.prototype.next = function (x) {
  this._s.hasValue = true;
  this._s.value = x;
};
SampleSourceObserver.prototype.error = function (e) { this._s.o.onError(e); };
SampleSourceObserver.prototype.completed = function () {
  this._s.atEnd = true;
  this._s.sourceSubscription.dispose();
};

function SampleObservable(source, sampler) {
  this.source = source;
  this._sampler = sampler;
  ObservableBase.call(this);
}

inherits(SampleObservable, ObservableBase);

SampleObservable.prototype.subscribeCore = function (o) {
  var state = {
    o: o,
    atEnd: false,
    value: null,
    hasValue: false,
    sourceSubscription: new SingleAssignmentDisposable()
  };

  state.sourceSubscription.setDisposable(this.source.subscribe(new SampleSourceObserver(state)));
  return new BinaryDisposable(
    state.sourceSubscription,
    this._sampler.subscribe(new SamplerObserver(state))
  );
};

module.exports = function sample(source, intervalOrSampler, scheduler) {
  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
  return typeof intervalOrSampler === 'number' ?
    new SampleObservable(source, interval(intervalOrSampler, scheduler)) :
    new SampleObservable(source, intervalOrSampler);
};
