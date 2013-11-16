    var AnonymousObservable = Rx.Internals.AnonymousObservable = (function (_super) {
        inherits(AnonymousObservable, _super);

        // Fix subscriber to check for undefined or function returned to decorate as Disposable
        function fixSubscriber(subscriber) {
            if (typeof subscriber === 'undefined') {
                subscriber = disposableEmpty;
            } else if (typeof subscriber === 'function') {
                subscriber = disposableCreate(subscriber);
            }

            return subscriber;
        }

        function AnonymousObservable(subscribe) {
            if (!(this instanceof AnonymousObservable)) {
                return new AnonymousObservable(subscribe);
            }

            function s(observer) {
                var autoDetachObserver = new AutoDetachObserver(observer);
                if (currentThreadScheduler.scheduleRequired()) {
                    currentThreadScheduler.schedule(function () {
                        try {
                            autoDetachObserver.setDisposable(fixSubscriber(subscribe(autoDetachObserver)));
                        } catch (e) {
                            if (!autoDetachObserver.fail(e)) {
                                throw e;
                            } 
                        }
                    });
                } else {
                    try {
                        autoDetachObserver.setDisposable(fixSubscriber(subscribe(autoDetachObserver)));
                    } catch (e) {
                        if (!autoDetachObserver.fail(e)) {
                            throw e;
                        }
                    }
                }

                return autoDetachObserver;
            }

            _super.call(this, s);
        }

        return AnonymousObservable;

    }(Observable));
