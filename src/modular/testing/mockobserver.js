'use strict';

var Notification = require('../notification');
var Observer = require('../observer');
var Recorded = require('./recorded');
var inherits = require('util').inherits;

function MockObserver(scheduler) {
  Observer.call(this);
  this.scheduler = scheduler;
  this.messages = [];
}

inherits(MockObserver, Observer);

MockObserver.prototype.onNext = function (value) {
  this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnNext(value)));
};

MockObserver.prototype.onError = function (e) {
  this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnError(e)));
};

MockObserver.prototype.onCompleted = function () {
  this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnCompleted()));
};

module.exports = MockObserver;
