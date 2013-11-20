    var Enumerable = Rx.Internals.Enumerable = function (getEnumerator) {
        this.getEnumerator = getEnumerator;
    };

    Enumerable.prototype.concat = function () {
        var sources = this;
        return new AnonymousObservable(function (observer) {
            var e = sources.getEnumerator(), isDisposed, subscription = new SerialDisposable();
            var cancelable = immediateScheduler.scheduleRecursive(function (self) {
                var current, hasNext;
                if (isDisposed) { return; }

                try {
                    hasNext = e.moveNext();
                    if (hasNext) {
                        current = e.getCurrent();
                    } 
                } catch (ex) {
                    observer.onError(ex);
                    return;
                }

                if (!hasNext) {
                    observer.onCompleted();
                    return;
                }

                var d = new SingleAssignmentDisposable();
                subscription.setDisposable(d);
                d.setDisposable(current.subscribe(
                    observer.onNext.bind(observer),
                    observer.onError.bind(observer),
                    function () { self(); })
                );
            });
            return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
                isDisposed = true;
            }));
        });
    };

    Enumerable.prototype.catchException = function () {
        var sources = this;
        return new AnonymousObservable(function (observer) {
            var e = sources.getEnumerator(), isDisposed, lastException;
            var subscription = new SerialDisposable();
            var cancelable = immediateScheduler.scheduleRecursive(function (self) {
                var current, hasNext;
                if (isDisposed) { return; }

                try {
                    hasNext = e.moveNext();
                    if (hasNext) {
                        current = e.getCurrent();
                    } 
                } catch (ex) {
                    observer.onError(ex);
                    return;
                }

                if (!hasNext) {
                    if (lastException) {
                        observer.onError(lastException);
                    } else {
                        observer.onCompleted();
                    }
                    return;
                }

                var d = new SingleAssignmentDisposable();
                subscription.setDisposable(d);
                d.setDisposable(current.subscribe(
                    observer.onNext.bind(observer),
                    function (exn) {
                        lastException = exn;
                        self();
                    },
                    observer.onCompleted.bind(observer)));
            });
            return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
                isDisposed = true;
            }));
        });
    };


    var enumerableRepeat = Enumerable.repeat = function (value, repeatCount) {
        if (arguments.length === 1) {
            repeatCount = -1;
        }
        return new Enumerable(function () {
            var current, left = repeatCount;
            return enumeratorCreate(function () {
                if (left === 0) {
                    return false;
                }
                if (left > 0) {
                    left--;
                }
                current = value;
                return true;
            }, function () { return current; });
        });
    };

    var enumerableFor = Enumerable.forEach = function (source, selector, thisArg) {
        selector || (selector = identity);
        return new Enumerable(function () {
            var current, index = -1;
            return enumeratorCreate(
                function () {
                    if (++index < source.length) {
                        current = selector.call(thisArg, source[index], index, source);
                        return true;
                    }
                    return false;
                },
                function () { return current; }
            );
        });
    };
