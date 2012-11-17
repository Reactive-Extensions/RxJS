    var ObserveOnObserver = (function () {
        inherits(ObserveOnObserver, ScheduledObserver);
        function ObserveOnObserver() {
            ObserveOnObserver.super_.constructor.apply(this, arguments);
        }
        ObserveOnObserver.prototype.next = function (value) {
            ObserveOnObserver.super_.next.call(this, value);
            this.ensureActive();
        };
        ObserveOnObserver.prototype.error = function (e) {
            ObserveOnObserver.super_.error.call(this, e);
            this.ensureActive();
        };
        ObserveOnObserver.prototype.completed = function () {
            ObserveOnObserver.super_.completed.call(this);
            this.ensureActive();
        };

        return ObserveOnObserver;
    })();
