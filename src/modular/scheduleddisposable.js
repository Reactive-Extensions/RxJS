'use strict';

function ScheduledDisposable(scheduler, disposable) {
  this._scheduler = scheduler;
  this._disposable = disposable;
  this.isDisposed = false;
}

function scheduleItem(s, self) {
  if (!self.isDisposed) {
    self.isDisposed = true;
    self._disposable.dispose();
  }
}

ScheduledDisposable.prototype.dispose = function () {
  this._scheduler.schedule(this, scheduleItem);
};

module.exports = ScheduledDisposable;
