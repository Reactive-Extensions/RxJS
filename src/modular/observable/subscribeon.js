'use strict';

var ObservableBase = require('./observablebase');
var ScheduledDisposable = require('../scheduleddisposable');
var SerialDisposable = require('../serialdisposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var inherits = require('util').inherits;

function SubscribeOnObservable(source, s) {
  this.source = source;
  this._s = s;
  ObservableBase.call(this);
}

inherits(SubscribeOnObservable, ObservableBase);

function scheduleMethod(scheduler, state) {
  var source = state[0], d = state[1], o = state[2];
  d.setDisposable(new ScheduledDisposable(scheduler, source.subscribe(o)));
}

SubscribeOnObservable.prototype.subscribeCore = function (o) {
  var m = new SingleAssignmentDisposable(), d = new SerialDisposable();
  d.setDisposable(m);
  m.setDisposable(this._s.schedule([this.source, d, o], scheduleMethod));
  return d;
};

module.exports = function subscribeOn (source, scheduler) {
  return new SubscribeOnObservable(source, scheduler);
};
