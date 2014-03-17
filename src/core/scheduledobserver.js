  var ScheduledObserver = Rx.internals.ScheduledObserver = (function (_super) {
    inherits(ScheduledObserver, _super);

    function ScheduledObserver(scheduler, observer) {
      _super.call(this);
      this.scheduler = scheduler;
      this.observer = observer;
      this.isAcquired = false;
      this.hasFaulted = false;
      this.queue = [];
      this.disposable = new SerialDisposable();
    }

    ScheduledObserver.prototype.next = function (value) {
      var self = this;
      this.queue.push(function () {
        self.observer.onNext(value);
      });
    };

    ScheduledObserver.prototype.error = function (exception) {
      var self = this;
      this.queue.push(function () {
        self.observer.onError(exception);
      });
    };

    ScheduledObserver.prototype.completed = function () {
      var self = this;
      this.queue.push(function () {
        self.observer.onCompleted();
      });
    };

    ScheduledObserver.prototype.ensureActive = function () {
      var isOwner = false, parent = this;
      if (!this.hasFaulted && this.queue.length > 0) {
        isOwner = !this.isAcquired;
        this.isAcquired = true;
      }
      if (isOwner) {
        this.disposable.setDisposable(this.scheduler.scheduleRecursive(function (self) {
          var work;
          if (parent.queue.length > 0) {
            work = parent.queue.shift();
          } else {
            parent.isAcquired = false;
            return;
          }
          try {
            work();
          } catch (ex) {
            parent.queue = [];
            parent.hasFaulted = true;
            throw ex;
          }
          self();
        }));
      }
    };

    ScheduledObserver.prototype.dispose = function () {
      _super.prototype.dispose.call(this);
      this.disposable.dispose();
    };

    return ScheduledObserver;
  }(AbstractObserver));
