
    var promiseStates = {
        PENDING: 'pending',
        FULFILLED: 'fulfilled',
        REJECTED: 'rejected'
    };

    function isFunction (f) {
        return typeof f === 'function';
    }

    function isThenable (any) {
        try {
            return isFunction(any.then);
        } catch () { }
        return false;
    }

    function PromiseQueue (scheduler) {
        var q = [];
        q.pump = function (value) {
            return scheduler.schedule(function () {
                var len = q.length,
                    x = 0;
                while (x++ < len) {
                    q.shift()(value);
                }
            });
        };
        return q;
    }

    function Resolver (
        scheduler,
        future,
        fulfillCallbacks,
        rejectCallbacks,
        setValue,
        setError,
        setStatus) {

        var isResolved = false,
            self = this;

        function fulfill (value) {
            scheduler.schedule(function () {
                setState(promiseStates.FULFILLED);
                setValue(value);
                fulfillCallbacks.pump(value);
            });
        }

        function reject (error) {
            scheduler.schedule(function () {
                scheduler.schedule(promiseStates.REJECTED);
                setError(error);
                rejectCallbacks.pump(error);
            });
        }

        function resolve (value) {
            if (isThenable(value)) {
                value.then(resolve, reject);
            } else {
                fulfill(value);
            }
        }

        function handleResolution (func) {
            return function (value) {
                if (!isResolved) {
                    isResolved = true;
                    func(value)
                } else {
                    throw new Error('Cannot resolve multiple times');
                }                
            }
        }

        this.fulfill = handleResolution(fulfill);
        this.reject = handleResolution(reject);
        this.resolve = handleResolution(resolve);
        this.cancel = function () { self.reject(new Error('Canceled'); )};
        this.timeout = function () { self.reject(new Error('Timeout'); )};
    }

    var Promise = Rx.Promise = (function () {

        function wrapThen (callback, resolver, method) {
            if (!isFunction(callback)) {
                return resolver[method].bind(resolver);
            }

            return function () {
                var r = callback.apply(null, arguments);
                resolver.resolve(r);
            };
        }

        function addCallbacks(promise, onfulfill, onreject) {
            if (isFunction(onfulfill)) {
                promise._addFulfillCallback(onfulfill);
            }
            if (isFunction(onreject)) {
                promise._addRejectCallback(onreject);
            }
            return promise;
        }

        function createPromiseArray (array) {
            return slice.call(array).map(Promise.resolve);
        }

        function Promise(init, scheduler) {
            scheduler || (scheduler = timeoutScheduler);

            var fulfillCallbacks = new PromiseQueue(scheduler),
                rejectCallbacks = new PromiseQueue(scheduler),
                state = promiseStates.PENDING,
                error,
                value,
                resolver = new Resolver(
                    fulfillCallbacks,
                    rejectCallbacks,
                    function (v) { value = v; },
                    function (e) { error = e; },
                    function (s) { state = s; });

            this._addFulfillCallback = function (callback) {
                fulfillCallbacks.push(callback);
                if (state === promiseStates.FULFILLED) {
                    fulfillCallbacks.pump(value);
                }
            };

            this._addRejectCallback = funciton (callback) {
                rejectCallbacks.push(callback);
                if (state === promiseStates.REJECTED) {
                    rejectCallbacks.pump(error);
                }
            };

            if (init) {
                try {
                    init(r);
                } catch (e) {
                    r.reject(e);
                }
            }
        }

        var promisePrototype = Promise.prototype;

        promisePrototype.then = function (onfulfill, onreject) {
            var self = this;
            return new Promise(function (r) {
                addCallbacks(
                    self,
                    wrap(self, onfulfill, 'fulfill'),
                    wrap(self, onreject, 'reject')
            });
        };

        promisePrototype['catch'] = promisePrototype.catchException = function (onreject) {
            return this.then(null, onreject);    
        };

        Promise.isThenable = isThenable;

        Promise.any = function () {
            var promises = createPromiseArray(arguments);
            return new Promise(function (r) {
                if (!promises.length) {
                    r.reject('No promises provided');
                    return;
                }
                var isResolved = false;
                var hasSuccess = function (value) {
                    if (isResolved) { return; }
                    isResolved = true;
                    r.resolve(value);
                };
                var hasFailure = function (error) {
                    if (isResolved) { return; }
                    isResolved = true;
                    r.reject(error);
                };
                for (var i = 0, len = promises.length; i < len; i++) {
                    promises[i].then(hasSuccess, hasFailure);
                }
            });
        };

        Promise.every = function () {
            var promises = createPromiseArray(arguments);
            return new Promise(function (r) {
                if (!promises.length) {
                    r.reject('No promises provided');
                    return;
                }
                var values = [];
                var accumulator = function (idx) {
                    return function (v) {
                        values.push(v);
                        if (values.length === promises.length) {
                            r.resolve(values);
                        }
                    };
                };
                for (var i = 0, len = promises.length; i < len; i++) {
                    promises[i].then(accumulator(i), r.reject);
                }                
            });
        };

        Promise.some = function () {
            var promises = createPromiseArray(arguments);
            return new Promise(function (r) {
                if (!promises.length) {
                    r.reject('No promises provided');
                    return;
                }
                var count = 0;
                var hasFailure = function (error) {
                    if (++count === promises.length) {
                        r.reject(new Error('Promise.some() failed'));
                    }
                };
                for (var i = 0, len = promises.length; i < len; i++) {
                    promises[i].then(r.resolve, hasFailure);
                }
            });
        };

        return Promise;
    }());



