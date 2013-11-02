    /**
     *  Ignores values from an observable sequence which are followed by another value before dueTime.
     *  
     * @example
     *  1 - res = source.throttle(5000); // 5 seconds
     *  2 - res = source.throttle(5000, scheduler);        
     * 
     * @param {Number} dueTime Duration of the throttle period for each value (specified as an integer denoting milliseconds).
     * @param {Scheduler} [scheduler]  Scheduler to run the throttle timers on. If not specified, the timeout scheduler is used.
     * @returns {Observable} The throttled sequence.
     */
    observableProto.throttle = function (dueTime, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        var source = this;
        return new AnonymousObservable(function (observer) {
            var cancelable = new SerialDisposable(), hasvalue = false, id = 0, subscription, value = null;
            subscription = source.subscribe(function (x) {
                var currentId, d;
                hasvalue = true;
                value = x;
                id++;
                currentId = id;
                d = new SingleAssignmentDisposable();
                cancelable.setDisposable(d);
                d.setDisposable(scheduler.scheduleWithRelative(dueTime, function () {
                    if (hasvalue && id === currentId) {
                        observer.onNext(value);
                    }
                    hasvalue = false;
                }));
            }, function (exception) {
                cancelable.dispose();
                observer.onError(exception);
                hasvalue = false;
                id++;
            }, function () {
                cancelable.dispose();
                if (hasvalue) {
                    observer.onNext(value);
                }
                observer.onCompleted();
                hasvalue = false;
                id++;
            });
            return new CompositeDisposable(subscription, cancelable);
        });
    };
