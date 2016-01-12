'use strict';

var Disposable = require('../disposable');
var Observable = require('../observable');
var Subscription = require('./subscription');
var inherits = require('inherits');

function HotObservable(scheduler, messages) {
  Observable.call(this);
  var message, notification, observable = this;
  this.scheduler = scheduler;
  this.messages = messages;
  this.subscriptions = [];
  this.observers = [];
  for (var i = 0, len = this.messages.length; i < len; i++) {
    message = this.messages[i];
    notification = message.value;
    (function (innerNotification) {
      scheduler.scheduleAbsolute(null, message.time, function () {
        var obs = observable.observers.slice(0);

        for (var j = 0, jLen = obs.length; j < jLen; j++) {
          innerNotification.accept(obs[j]);
        }
        return Disposable.empty;
      });
    })(notification);
  }
}

inherits(HotObservable, Observable);

HotObservable.prototype._subscribe = function (o) {
  var observable = this;
  this.observers.push(o);
  this.subscriptions.push(new Subscription(this.scheduler.clock));
  var index = this.subscriptions.length - 1;
  return Disposable.create(function () {
    var idx = observable.observers.indexOf(o);
    observable.observers.splice(idx, 1);
    observable.subscriptions[index] = new Subscription(observable.subscriptions[index].subscribe, observable.scheduler.clock);
  });
};

module.exports = HotObservable;
