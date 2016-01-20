'use strict';

var inherits = require('inherits');
var isFunction = require('../helpers/isfunction');
var errors = require('../internal/errors');
var Observable  = require('../observable');
var Disposable = require('../disposable');
var AutoDetachObserver = require('../observer/autodetachobserver');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, thrower = tryCatchUtils.thrower;

global._Rx || (global._Rx = {});
if (!global._Rx.currentThreadScheduler) {
  require('../scheduler/currentthreadscheduler');
}

function fixSubscriber(subscriber) {
  return subscriber && isFunction(subscriber.dispose) ? subscriber :
    isFunction(subscriber) ? Disposable.create(subscriber) : Disposable.empty;
}

function setDisposable(s, state) {
  var ado = state[0], self = state[1];
  var sub = tryCatch(self.subscribeCore).call(self, ado);
  if (sub === global._Rx.errorObj && !ado.fail(sub.e)) { thrower(sub.e); }
  ado.setDisposable(fixSubscriber(sub));
}

function ObservableBase () {
  Observable.call(this);
}

inherits(ObservableBase, Observable);

ObservableBase.prototype._subscribe = function (o) {
  var ado = new AutoDetachObserver(o), state = [ado, this];

  if (global._Rx.currentThreadScheduler.scheduleRequired()) {
    global._Rx.currentThreadScheduler.schedule(state, setDisposable);
  } else {
    setDisposable(null, state);
  }
  return ado;
};

ObservableBase.prototype.subscribeCore = function () {
  throw new errors.NotImplementedError();
};

module.exports = ObservableBase;
