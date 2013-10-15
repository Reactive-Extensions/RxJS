    /** @private */
    var JoinObserver = (function (_super) {

        inherits(JoinObserver, _super);

        /**
         * @constructor
         * @private
         */
        function JoinObserver(source, onError) {
            _super.call(this);
            this.source = source;
            this.onError = onError;
            this.queue = [];
            this.activePlans = [];
            this.subscription = new SingleAssignmentDisposable();
            this.isDisposed = false;
        }

        var JoinObserverPrototype = JoinObserver.prototype;

        /**
         * @memberOf JoinObserver#
         * @private
         */
        JoinObserverPrototype.next = function (notification) {
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

        /**
         * @memberOf JoinObserver#
         * @private
         */        
        JoinObserverPrototype.error = noop;

        /**
         * @memberOf JoinObserver#
         * @private
         */        
        JoinObserverPrototype.completed = noop;

        /**
         * @memberOf JoinObserver#
         * @private
         */
        JoinObserverPrototype.addActivePlan = function (activePlan) {
            this.activePlans.push(activePlan);
        };

        /**
         * @memberOf JoinObserver#
         * @private
         */        
        JoinObserverPrototype.subscribe = function () {
            this.subscription.setDisposable(this.source.materialize().subscribe(this));
        };

        /**
         * @memberOf JoinObserver#
         * @private
         */        
        JoinObserverPrototype.removeActivePlan = function (activePlan) {
            var idx = this.activePlans.indexOf(activePlan);
            this.activePlans.splice(idx, 1);
            if (this.activePlans.length === 0) {
                this.dispose();
            }
        };

        /**
         * @memberOf JoinObserver#
         * @private
         */        
        JoinObserverPrototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (!this.isDisposed) {
                this.isDisposed = true;
                this.subscription.dispose();
            }
        };
        
        return JoinObserver;
    } (AbstractObserver));
