'use strict';

var AsyncSubject = require('../asyncsubject');
var asObservable = require('./asobservable');
var Scheduler = require('../scheduler');
var tryCatchUtils = require('../internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, errorObj = tryCatchUtils.errorObj;

function scheduleMethod(s, state) {
  var result = tryCatch(state.func).apply(state.context, state.args);
  if (result === errorObj) { return state.subject.onError(result.e); }
  state.subject.onNext(result);
  state.subject.onCompleted();
}

module.exports = function toAsync(func, context, scheduler) {
  Scheduler.isScheduler(scheduler) || (scheduler = Scheduler.async);
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
