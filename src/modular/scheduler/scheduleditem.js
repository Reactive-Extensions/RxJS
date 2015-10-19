'use strict';

var Disposable = require('../disposable');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var cmp = require('../helpers/comparer');

function ScheduledItem(scheduler, state, action, dueTime, comparer) {
  this.scheduler = scheduler;
  this.state = state;
  this.action = action;
  this.dueTime = dueTime;
  this.comparer = comparer || cmp;
  this.disposable = new SingleAssignmentDisposable();
}

ScheduledItem.prototype.invoke = function () {
  this.disposable.setDisposable(this.invokeCore());
};

ScheduledItem.prototype.compareTo = function (other) {
  return this.comparer(this.dueTime, other.dueTime);
};

ScheduledItem.prototype.isCancelled = function () {
  return this.disposable.isDisposed;
};

ScheduledItem.prototype.invokeCore = function () {
  return Disposable._fixup(this.action(this.scheduler, this.state));
};

module.exports = ScheduledItem;
