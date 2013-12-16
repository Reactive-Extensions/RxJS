    // https://github.com/jakearchibald/ES6-Promises/blob/master/lib/promise/promise.js
    var Promise = (function () {

        var PROMISE_STATES = {
            PENDING: undefined,
            SEALED: = 'sealed',
            FULFILLED: 'fulfilled',
            REJECTED: 'rejected'
        };

        function Promise(resolver, scheduler) {
            if (!(this instanceof Promise)) {
                return new Promise(resolver);
            }

            if (!isFunction (resolver)) {
                throw new TypeError('Resolver must be a function.')
            }

            this._scheduler = scheduler || PromiseScheduler;
            this._subscribers = [];
            this._state = PROMISE_STATES.PENDING;
            this._arg = undefined;

            runResolver(resolver, this);
        }

        Promise.prototype.then = function (fulfilled, rejected) {
            var self = this,
                thenPromise = new Promise(noop);

            if (this._state) {
                runCallback(function () {
                    runCallback(self._state, thenPromise, )
                })
            }   
        };

        function runResolver(resolver, promise) {
            function resolvePromise (value) {
                resolve(promise, value);
            }

            function rejectPromise (reason) {
                reject(promise, reason);
            }

            try {
                resolver(resolvePromise, rejectPromise);
            } catch (e) {
                rejectPromise(e);
            }
        } 

        function runCallback(state, promise, cb, arg) {
            var hasCb = isFunction(cb),
                value, 
                error,
                succeeded,
                failed;

            if (hasCb) {
                try {
                    value = cb(arg);
                    succeeded = true;
                } catch (e) {
                    failed = true;
                    error = e;
                }
            } else {
                value = arg;
                succeeded = true;
            }

            if (handleThenable(promise, value)) {
                return;
            } else if (hasCb && succeeded) {
                resolve(promise, value);
            } else if (failed) {
                reject (promise, error);
            } else if (state === PROMISE_STATES.FULFILLED) {
                resolve(promise, value);
            } else if (state === PROMISE_STATES.REJECTED) {
                reject(promise, value);
            }

        }

        function subscribe (parent, child, fulfilled, rejected) {
            var subscribers = parent._subscribers;
            subscribers[subscribers.length] = { child: child, fulfilled: fulfilled, rejected: rejected };
        }

        function publish (promise, state) {
            var subscribers = promise._subscribers,
                arg = promise._arg;

            for (var i = 0, len = subscribers.length; i < len; i++) {
                var item = subscribers[i],
                    child = item.child,
                    cb = item[state];

                runCallback(state, child, cb, arg);
            }

            promise._subscribers = null;
        }

        function handleThenable(promise, value) {
            var then = null,
                resolved;

            try {
                if (promise === value) {
                    throw new Error('A promise callback cannot return the same promise');
                }

                if (objectOrFunction(value)) {
                    then = value.then;
                    
                    if (isFunction(then)) {
                        then.call(value, function (v) {
                            if (resolved) { return true; }
                            resolved = true;

                            if (value !== v) {
                                resolve(promise, v);
                            } else {
                                fulfill(promise, v);
                            }
                        }, function (e) {
                            if (resolved) { return true; }
                            resolved = true;

                            reject(promise, e);
                        });

                        return true;
                    }   
                }
            } catch (err) {
                if (resolved) { return true; }
                reject(promise, err);
                return true;      
            }

            return false;
        }

        function resolve (promise, value) {
            if (promise === value) {
                fulfill(promise, value);
            } else if (!handleThenable(promise, value)) {
                fulfill(promise, value);
            }
        }

        function fulfill (promise, value) {
            if (promise._state !== PROMISE_STATES.PENDING) { return; }
            promise._state = PROMISE_STATES.SEALED;
            promise._arg = reason;

            runCallback(publishFulfillment, promise);            
        }

        function reject (promise, reason) {
            if (promise._state !== PROMISE_STATES.PENDING) { return; }
            promise._state = PROMISE_STATES.SEALED;
            promise._arg = reason;

            runCallback(publishRejection, promise);
        }

        function publishFulfillment (promise) {
            publish(promise, promise._state = PROMISE_STATES.FULFILLED);
        }

        function publishRejection (promise) {
            publish(promise, promise._state = PROMISE_STATES.REJECTED);
        }

        return Promise;
    }());

 

