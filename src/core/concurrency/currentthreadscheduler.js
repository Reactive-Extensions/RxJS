  var CurrentThreadScheduler = (function (__super__) {
    inherits(CurrentThreadScheduler, __super__);
    function CurrentThreadScheduler() {
      __super__.call(this);
    }

    var queue;

    function runTrampoline () {
      while (queue.length > 0) {
        var item = queue.shift();
        !item.isCancelled() && item.invoke();
      }
    }

    CurrentThreadScheduler.prototype.schedule = function(state, action) {
      var si = new ScheduledItem(this, state, action, this.now());

      if (!queue) {
        queue = [si];

        var result = tryCatch(runTrampoline)();
        queue = null;
        if (result === errorObj) { return thrower(result.e); }
      } else {
        queue.push(si);
      }
      return si.disposable;
    };

    CurrentThreadScheduler.prototype.scheduleRequired = function () { return !queue; };

    return CurrentThreadScheduler;
  }(Scheduler));

  /**
   * Gets a scheduler that schedules work as soon as possible on the current thread.
   */
  var currentThreadScheduler = Scheduler.currentThread = new CurrentThreadScheduler();
