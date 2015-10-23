'use strict';

var CompositeDisposable = require('../compositedisposable');
var Disposable = require('../disposable');
var Observable = require('../observable');
var Subscription = require('./subscription');
var inherits = require('util').inherits;

function ColdObservable(scheduler, messages) {
  Observable.call(this);
  this.scheduler = scheduler;
  this.messages = messages;
  this.subscriptions = [];
}

inherits(ColdObservable, Observable);

ColdObservable.prototype._subscribe = function (o) {
  var message, notification, observable = this;
  this.subscriptions.push(new Subscription(this.scheduler.clock));
  var index = this.subscriptions.length - 1;
  var d = new CompositeDisposable();
  for (var i = 0, len = this.messages.length; i < len; i++) {
    message = this.messages[i];
    notification = message.value;
    (function (innerNotification) {
      d.add(observable.scheduler.scheduleRelative(null, message.time, function () {
        innerNotification.accept(o);
        return Disposable.empty;
      }));
    })(notification);
  }
  return Disposable.create(function () {
    observable.subscriptions[index] = new Subscription(observable.subscriptions[index].subscribe, observable.scheduler.clock);
    d.dispose();
  });
};

module.exports = ColdObservable;
