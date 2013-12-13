    var StopAndWaitObserver = (function (_super) {

        function StopAndWaitObserver (observer, observable, cancel) {
            _super.call(this);
            this.observer = observer;
            this.observable = observable;
            this.cancel = cancel;
        }

        var stopAndWaitObserverProto = StopAndWaitObserver.prototype;

        stopAndWaitObserverProto.onCompleted = function () {
            this.observer.onCompleted();
            this.dispose();
        };

        stopAndWaitObserverProto.onError = function (error) {
            this.observer.onError(error);
            this.dispose();
        }

        stopAndWaitObserverProto.onNext = function (value) {
            this.observer.onNext(value);

            var self = this;
            timeoutScheduler.schedule(function () {
                self.observable.onNext(1);
            });
        };

        stopAndWaitObserverProto.dispose = function () {
            this.observer = { onNext: noop, onError: noop, onCompleted: noop };
            if (this.cancel) {
                this.cancel.dispose();
                this.cancel = null;
            }
        };

        return StopAndWaitObserver;
    }(Observer));