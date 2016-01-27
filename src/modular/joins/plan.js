'use strict';

var ActivePlan = require('./activeplan');
var JoinObserver = require('./joinobserver');
var tryCatch = require('../internal/trycatchutils').tryCatch;

function planCreateObserver(externalSubscriptions, observable, onError) {
  var entry = externalSubscriptions.get(observable);
  if (!entry) {
    var observer = new JoinObserver(observable, onError);
    externalSubscriptions.set(observable, observer);
    return observer;
  }
  return entry;
}

function Plan(expression, selector) {
  this.expression = expression;
  this.selector = selector;
}

function handleOnError(o) { return function (e) { o.onError(e); }; }
function handleOnNext(self, observer) {
  return function onNext () {
    var result = tryCatch(self.selector).apply(self, arguments);
    if (result === global._Rx.errorObj) { return observer.onError(result.e); }
    observer.onNext(result);
  };
}

Plan.prototype.activate = function (externalSubscriptions, observer, deactivate) {
  var joinObservers = [], errHandler = handleOnError(observer);
  for (var i = 0, len = this.expression.patterns.length; i < len; i++) {
    joinObservers.push(planCreateObserver(externalSubscriptions, this.expression.patterns[i], errHandler));
  }
  var activePlan = new ActivePlan(joinObservers, handleOnNext(this, observer), function () {
    for (var j = 0, jlen = joinObservers.length; j < jlen; j++) {
      joinObservers[j].removeActivePlan(activePlan);
    }
    deactivate(activePlan);
  });
  for (i = 0, len = joinObservers.length; i < len; i++) {
    joinObservers[i].addActivePlan(activePlan);
  }
  return activePlan;
};

module.exports = Plan;
