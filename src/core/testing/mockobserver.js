    var MockObserver = (function () {
        inherits(MockObserver, Observer);
        function MockObserver(scheduler) {
            this.scheduler = scheduler;
            this.messages = [];
        }
        MockObserver.prototype.onNext = function (value) {
            this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnNext(value)));
        };
        MockObserver.prototype.onError = function (exception) {
            this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnError(exception)));
        };
        MockObserver.prototype.onCompleted = function () {
            this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnCompleted()));
        };
        return MockObserver;
    })();
