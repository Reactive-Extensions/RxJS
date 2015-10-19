'use strict';

var inherits = require('util').inherits;
var isFunction = require('../helpers/isfunction');
var Observable  = require('../observable');
var Disposable = require('../disposable');
var AutoDetachObserver = require('../observer/autodetachobserver');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, thrower = tryCatchUtils.thrower;

global.Rx || (global.Rx = {});
if (!global.Rx.currentThreadScheduler) {
  require('../scheduler/currentthreadscheduler');
}

// Fix subscriber to check for undefined or function returned to decorate as Disposable
function fixSubscriber(subscriber) {
  return subscriber && isFunction(subscriber.dispose) ? subscriber :
    isFunction(subscriber) ? Disposable.create(subscriber) : Disposable.empty;
}

function setDisposable(s, state) {
  var ado = state[0], self = state[1];
  var sub = tryCatch(self.__subscribe).call(self, ado);
  if (sub === global.Rx.errorObj && !ado.fail(sub.e)) { thrower(sub.e); }
  ado.setDisposable(fixSubscriber(sub));
}

function AnonymousObservable(subscribe, parent) {
  this.source = parent;
  this.__subscribe = subscribe;
  Observable.call(this);
}

inherits(AnonymousObservable, Observable);

AnonymousObservable.prototype._subscribe = function (o) {
  var ado = new AutoDetachObserver(o), state = [ado, this];

  if (global.Rx.currentThreadScheduler.scheduleRequired()) {
    global.Rx.currentThreadScheduler.schedule(state, setDisposable);
  } else {
    setDisposable(null, state);
  }
  return ado;
};

module.exports = AnonymousObservable;
