    /** @private */
    var ConnectableObservable = Rx.ConnectableObservable = (function (_super) {
        inherits(ConnectableObservable, _super);

        /**
         * @constructor
         * @private
         */
        function ConnectableObservable(source, subject) {
            var state = {
                subject: subject,
                source: source.asObservable(),
                hasSubscription: false,
                subscription: null
            };

            this.connect = function () {
                if (!state.hasSubscription) {
                    state.hasSubscription = true;
                    state.subscription = new CompositeDisposable(state.source.subscribe(state.subject), disposableCreate(function () {
                        state.hasSubscription = false;
                    }));
                }
                return state.subscription;
            };

            function subscribe(observer) {
                return state.subject.subscribe(observer);
            }

            _super.call(this, subscribe);
        }

        /**
         * @private
         * @memberOf ConnectableObservable
         */
        ConnectableObservable.prototype.connect = function () { return this.connect(); };

        /**
         * @private
         * @memberOf ConnectableObservable
         */        
        ConnectableObservable.prototype.refCount = function () {
            var connectableSubscription = null, count = 0, source = this;
            return new AnonymousObservable(function (observer) {
                var shouldConnect, subscription;
                count++;
                shouldConnect = count === 1;
                subscription = source.subscribe(observer);
                if (shouldConnect) {
                    connectableSubscription = source.connect();
                }
                return disposableCreate(function () {
                    subscription.dispose();
                    count--;
                    if (count === 0) {
                        connectableSubscription.dispose();
                    }
                });
            });
        };

        return ConnectableObservable;
    }(Observable));
