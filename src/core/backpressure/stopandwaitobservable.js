    var StopAndWaitObservable = (function (_super) {

        function subscribe (observer) {
            var self = this,
                subscription = new SerialDisposable();

            subscription.setDisposable(this.source.subscribe(new StopAndWaitObserver(observer, this, subscription)));

            if (count++ === 0) {
                this.controllerSubscription = this.source.controlledBy(this.controller);
            }

            timeoutScheduler.schedule(function () {
                self.controller.onNext(1);
            });

            return disposableCreate(function () {
                subscription.dispose();
                if (--count === 0) {
                    self.controllerSubscription.dispose();
                }
            })
        }

        function StopAndWaitObservable (source) {
            _super.call(this, subscribe);
            this.source = source;
            this.controller = new Subject();
            this.count = 0;
        }

        return StopAndWaitObservable;
    }(Observable));