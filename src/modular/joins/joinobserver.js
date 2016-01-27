'use strict';

var AbstractObserver = require('../observer/abstractobserver');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var materialize = require('../observable/materialize');
var noop = require('../helpers/noop');
var inherits = require('inherits');

function JoinObserver(source, onError) {
  AbstractObserver.call(this);
  this._source = source;
  this._onError = onError;
  this._queue = [];
  this._activePlans = [];
  this._subscription = new SingleAssignmentDisposable();
  this.isDisposed = false;
}

inherits(JoinObserver, AbstractObserver);

JoinObserver.prototype.next = function (notification) {
  if (!this.isDisposed) {
    if (notification.kind === 'E') {
      return this._onError(notification.error);
    }
    this._queue.push(notification);
    var activePlans = this._activePlans.slice(0);
    for (var i = 0, len = activePlans.length; i < len; i++) {
      activePlans[i].match();
    }
  }
};

JoinObserver.prototype.error = noop;
JoinObserver.prototype.completed = noop;

JoinObserver.prototype.addActivePlan = function (activePlan) {
  this._activePlans.push(activePlan);
};

JoinObserver.prototype.subscribe = function () {
  this._subscription.setDisposable(materialize(this._source).subscribe(this));
};

JoinObserver.prototype.removeActivePlan = function (activePlan) {
  this._activePlans.splice(this._activePlans.indexOf(activePlan), 1);
  this._activePlans.length === 0 && this.dispose();
};

JoinObserver.prototype.dispose = function () {
  AbstractObserver.prototype.dispose.call(this);
  if (!this.isDisposed) {
    this.isDisposed = true;
    this._subscription.dispose();
  }
};

module.exports = JoinObserver;
