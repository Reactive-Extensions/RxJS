'use strict';

var BinaryDisposable = require('../disposables/binarydisposable');
var Disposable = require('../disposables/disposable');
var SingleAssignmentDisposable = require('../disposables/singleassignmentdisposable');
var SafeObserver = require('./safeobserver');
var Scheduler = require('../concurrency/scheduler');

function Producer () {
  
}

Producer.prototype.subscribe = function (o) {
  this._subscribeRaw(o);
};

Producer.prototype._subscribeRaw = function (o, enableSafeguard) {
  var state = {
    observer: o,
    sink: new SingleAssignmentDisposable(),
    subscription: new SingleAssignmentDisposable(),
    assign: function (s) { this.sink.setDisposable(s); }
  };
  
  var d = new BinaryDisposable(state.sink, state.subscription);
  
  if (enableSafeguard) {
    state.observer = SafeObserver.create(state.observer, d);
  }
  
  if (Scheduler.queue.isScheduleRequired) {
    Scheduler.queue.schedule(state, this.run.bind(this));
  } else {
    state.subscription.setDisposable(this._run(state.observer, state.subscription, state.assign.bind(state)));
  }
};

Producer.prototype.run = function (s, x) {
  x.subscription.setDisposable(this._run(x.observer, x.subscription, x.assign.bind(x)));
  return Disposable.empty;
};

Producer.prototype._run = function (o, cancel, setSink) { };

module.exports = Producer;