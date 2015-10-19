'use strict';

var Scheduler = require('../scheduler');
var Disposable = require('../disposable');
var inherits = require('util').inherits;

function ImmediateScheduler() {
  Scheduler.call(this);
}

inherits(ImmediateScheduler, Scheduler);

ImmediateScheduler.prototype.schedule = function (state, action) {
  return Disposable._fixup(action(this, state));
};

global.Rx || (global.Rx = {});
global.Rx.immediateScheduler = new ImmediateScheduler();
