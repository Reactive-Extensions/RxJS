  var ObserveOnObserver = (function (__super__) {
    inherits(ObserveOnObserver, __super__);

    function ObserveOnObserver() {
      __super__.apply(this, arguments);
    }

    ObserveOnObserver.prototype.next = function (value) {
      __super__.prototype.next.call(this, value);
      this.ensureActive();
    };

    ObserveOnObserver.prototype.error = function (e) {
      __super__.prototype.error.call(this, e);
      this.ensureActive();
    };

    ObserveOnObserver.prototype.completed = function () {
      __super__.prototype.completed.call(this);
      this.ensureActive();
    };

    return ObserveOnObserver;
  })(ScheduledObserver);
