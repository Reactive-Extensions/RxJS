'use strict';

var Scheduler = require('../scheduler');
var Disposable = require('../disposable');
var inherits = require('inherits');

function ImmediateScheduler() {
  Scheduler.call(this);
}

inherits(ImmediateScheduler, Scheduler);

ImmediateScheduler.prototype.schedule = function (state, action) {
  return Disposable._fixup(action(this, state));
};

global._Rx || (global._Rx = {});
global._Rx.immediateScheduler = new ImmediateScheduler();

Scheduler.immediate = global._Rx.immediateScheduler;
