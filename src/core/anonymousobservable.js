    var AnonymousObservable = root.Internals.AnonymousObservable = (function () {
        inherits(AnonymousObservable, Observable);
        function AnonymousObservable(subscribe) {

            var s = function (observer) {
                var autoDetachObserver = new AutoDetachObserver(observer);
                if (currentThreadScheduler.scheduleRequired()) {
                    currentThreadScheduler.schedule(function () {
                        try {
                            autoDetachObserver.disposable(subscribe(autoDetachObserver));
                        } catch (e) {
                            if (!autoDetachObserver.fail(e)) {
                                throw e;
                            } 
                        }
                    });
                } else {
                    try {
                        autoDetachObserver.disposable(subscribe(autoDetachObserver));
                    } catch (e) {
                        if (!autoDetachObserver.fail(e)) {
                            throw e;
                        }
                    }
                }

                return autoDetachObserver;
            };
            AnonymousObservable.super_.constructor.call(this, s);
        }

        return AnonymousObservable;
    }());
