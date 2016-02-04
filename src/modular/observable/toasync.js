'use strict';

var AsyncSubject = require('../asyncsubject');
var asObservable = require('./asobservable');
var isScheduler = require('../scheduler').isScheduler;
var tryCatch = require('../internal/trycatchutils').tryCatch;

global._Rx || (global._Rx = {});
if (!global._Rx.defaultScheduler) {
  require('../scheduler/defaultscheduler');
}

function scheduleMethod(s, state) {
  var result = tryCatch(state.func).apply(state.context, state.args);
  if (result === global._Rx.errorObj) { return state.subject.onError(result.e); }
  state.subject.onNext(result);
  state.subject.onCompleted();
}

module.exports = function toAsync(func, context, scheduler) {
  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
  return function asyncFn () {
    var subject = new AsyncSubject(), len = arguments.length, args = new Array(len);
    for (var i = 0; i < len; i++) { args[i] = arguments[i]; }
    var state = {
      subject: subject,
      args: args,
      func: func,
      context: context
    };

    scheduler.schedule(state, scheduleMethod);
    return asObservable(subject);
  };
};
