'use strict';

var AutoDetachObserver = require('./internal/autodetachobserver');
var Observable = require('./observable');
var Disposable = require('../disposables/disposable');
var Scheduler = require('../concurrency/scheduler');
var inherits = require('inherits');

function ObservableBase() { 
  Observable.call(this);
}

inherits(ObservableBase, Observable);

function scheduledSubscribe(_, state) {
  var self = state.self, ado = state.ado;
  try {
    ado.setDisposable(self._subscribeCore(ado));
  } catch (e) {
    if (!ado.fail(e)) { throw e; }
  }
  return Disposable.empty;
}

ObservableBase.prototype._subscribe = function (o) {
  var ado = new AutoDetachObserver(o);
  
  var state = { self: this, ado: ado };
  
  if (Scheduler.queue.isScheduleRequired()) {
    ado.setDisposable(Scheduler.queue.schedule(state, scheduledSubscribe));
  } else {
    scheduledSubscribe(null, state);
  }
  
  return ado;
};

ObservableBase.prototype._subscribeCore = function (o) { };

module.exports = ObservableBase;