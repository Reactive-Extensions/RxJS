    // Join Observer
    var JoinObserver = (function () {

        inherits(JoinObserver, AbstractObserver);

        function JoinObserver(source, onError) {
            JoinObserver.super_.constructor.call(this);
            this.source = source;
            this.onError = onError;
            this.queue = [];
            this.activePlans = [];
            this.subscription = new SingleAssignmentDisposable();
            this.isDisposed = false;
        }

        JoinObserver.prototype.next = function (notification) {
            if (!this.isDisposed) {
                if (notification.kind === 'E') {
                    this.onError(notification.exception);
                    return;
                }
                this.queue.push(notification);
                var activePlans = this.activePlans.slice(0);
                for (var i = 0, len = activePlans.length; i < len; i++) {
                    activePlans[i].match();
                }
            }
        };
        JoinObserver.prototype.error = noop;
        JoinObserver.prototype.completed = noop;

        JoinObserver.prototype.addActivePlan = function (activePlan) {
            this.activePlans.push(activePlan);
        };
        JoinObserver.prototype.subscribe = function () {
            this.subscription.disposable(this.source.materialize().subscribe(this));
        };
        JoinObserver.prototype.removeActivePlan = function (activePlan) {
            var idx = this.activePlans.indexOf(activePlan);
            this.activePlans.splice(idx, 1);
            if (this.activePlans.length === 0) {
                this.dispose();
            }
        };
        JoinObserver.prototype.dispose = function () {
            JoinObserver.super_.dispose.call(this);
            if (!this.isDisposed) {
                this.isDisposed = true;
                this.subscription.dispose();
            }
        };
        return JoinObserver;
    } ());
