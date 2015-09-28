' use strict';

var inherits = require('util').inherits;
var isFunction = require('../helpers/isfunction');
var Disposable = require('../disposable');
var tryCatchUtils = require('../helpers/trycatch');
var Observable = require('../observable');
var AutoDetachObserver = require('../observer/autodetachobserver');

if (!globals.Rx.Scheduler.currentThread) {
  require('../scheduler/currentthread');
}

inherits(AnonymousObservable, Observable);

// Fix subscriber to check for undefined or function returned to decorate as Disposable
function fixSubscriber(subscriber) {
  return subscriber && isFunction(subscriber.dispose) ? subscriber :
    isFunction(subscriber) ? Disposable.create(subscriber) : Disposable.empty;
}

function setDisposable(s, state) {
  var ado = state[0], self = state[1];
  var sub = tryCatchUtils.tryCatch(self.__subscribe).call(self, ado);
  if (sub === tryCatchUtils.errorObj && !ado.fail(sub.e)) { tryCatchUtils.thrower(sub.e); }
  ado.setDisposable(fixSubscriber(sub));
}

function AnonymousObservable(subscribe, parent) {
  this.source = parent;
  this.__subscribe = subscribe;
  Observable.call(this);
}

AnonymousObservable.prototype._subscribe = function (o) {
  var ado = new AutoDetachObserver(o), state = [ado, this];

  if (Rx.Scheduler.currentThread.scheduleRequired()) {
    Rx.Scheduler.currentThread.schedule(state, setDisposable);
  } else {
    setDisposable(null, state);
  }
  return ado;
};

module.exports = AnonymousObservable;
