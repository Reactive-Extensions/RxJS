'use strict';

var ScheduledObserver = require('./scheduledobserver');
var inherits = require('inherits');

function ObserveOnObserver(scheduler, observer, cancel) {
  ScheduledObserver.call(this, scheduler, observer);
  this._cancel = cancel;
}

inherits(ObserveOnObserver, ScheduledObserver);

ObserveOnObserver.prototype.next = function (value) {
  ScheduledObserver.prototype.next.call(this, value);
  this.ensureActive();
};

ObserveOnObserver.prototype.error = function (e) {
  ScheduledObserver.prototype.error.call(this, e);
  this.ensureActive();
};

ObserveOnObserver.prototype.completed = function () {
  ScheduledObserver.prototype.completed.call(this);
  this.ensureActive();
};

ObserveOnObserver.prototype.dispose = function () {
  ScheduledObserver.prototype.dispose.call(this);
  this._cancel && this._cancel.dispose();
  this._cancel = null;
};

module.exports = ObserveOnObserver;
