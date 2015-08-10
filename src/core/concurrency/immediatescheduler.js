  /** Gets a scheduler that schedules work immediately on the current thread. */
  var ImmediateScheduler = (function (__super__) {
    inherits(ImmediateScheduler, __super__);
    function ImmediateScheduler() { }

    ImmediateScheduler.prototype.schedule = function (state, action) {
      return Scheduler._fixDisposable(action(this, state));
    };

  }(Scheduler));

  var immediateScheduler = Scheduler.immediate = new ImmediateScheduler();
