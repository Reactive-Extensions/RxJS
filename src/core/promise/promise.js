    // https://github.com/jakearchibald/ES6-Promises/blob/master/lib/promise/promise.js
    var Promise = Rx.Promise = (function () {

        var PENDING = undefined,
            SEALED = 0,
            FULFILLED = 1,
            REJECTED = 2;

        function Promise(resolver, scheduler) {
            if (!(this instanceof Promise)) {
                return new Promise(resolver);
            }

            if (!isFunction (resolver)) {
                throw new TypeError('Resolver must be a function.')
            }

            this._subscribers = [];
            this._state = PENDING;
            this._detail = undefined;

            invokeResolver(resolver, this);
        }

        // Swappable concurrency
        var schedule = Promise.schedule = runCallback;

        Promise.prototype.constructor = Promise;

        /*
         *
         */
        Promise.prototype['catch'] = function (onRejection) {
            return this.then(null, onRejection);
        };

        /**
         *
         */
        Promise.prototype.then = function (fulfilled, rejected) {
            var promise = this,
                thenPromise = new this.constructor(noop);

            if (this._state) {
                var callbacks = arguments;
                schedule(function invokePromiseCallback() {
                    invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
                });
            } else {
                subscribe(this, thenPromise, onFulfillment, onRejection);
            }

            return thenPromise;
        };

        /*
         *
         */
        Promise.all = function (promises) {
            if (!Array.isArray(promises)) {
                throw new Error('Promise.all expects an array of promises');
            }

            return new Promise(function (resolve, reject) {
                var results = [],
                    remaining = promises.length,

                // Short circuit
                if (remaining === 0) {
                    resolve([]);
                }

                function resolver (idx) {
                    return function (value) {
                        resolveAll(idx, value);
                    };
                }

                function resolveAll (idx, value) {
                    results[idx] = value;
                    if (--remaining === 0) {
                        resolve(results);
                    }
                }

                for (var i = 0, len = promises.length; i < len; i++) {
                    var promise = promises[i];
                    if (promise && isFunction(promise.then)) {
                        promise.then(resolver(i), reject);
                    } else {
                        resolveAll(i, promise);
                    }
                }

            });
        }; 

        /**
         *
         */
        Promise.cast = function (value) {
            if (value && typeof value === 'object' && value.constructor === this) {
                return value;
            }

            return new Promise(function (resolve) {
                resolve(value);
            });
        };

        /**
         * Watches a series of Promises and act as soon as the first promise given to the `promises` argument fulfills or rejects.
         */
        Promise.race = function (promises) {
            if (!Array.isArray(promises)) {
                throw new Error('Promise.race expects an array of promises');
            }

            return new Promise (function (resolve, reject) {
                var results = [];
                for (var i = 0, len = promises.length; i < len; i++) {
                    var promise = promises[i];

                    if (promise && typeof promise === 'function') {
                        promise.then(resolve, reject);
                    } else {
                        resolve(promise);
                    }
                }
            });
        };

        /**
         * Returns a Promise which is rejected with the specified reason.
         * @param {Any} reason Reason for the rejection of the Promise.
         * @returns {Promise} A Promise in the rejected state with the specified reason.
         */
        Promise.reject = function (reason) {
            return new Promise(function(resolve, reject) {
                reject(reason);
            });               
        };

        /**
         * Returns a Promise which is fulfilled with the specified value.
         * @param {Any} value Value for the fulfillment of the Promise.
         * @returns {Promise} A promise in the fulfilled state with the specified value.
         */
        Promise.resolve = function (value) {
            return new Promise(function(resolve, reject) {
                resolve(value);
            });            
        };        


        function invokeResolver(resolver, promise) {
            function resolvePromise(value) {
                resolve(promise, value);
            }

            function rejectPromise(reason) {
                reject(promise, reason);
            }

            try {
                resolver(resolvePromise, rejectPromise);
            } catch(e) {
                rejectPromise(e);
            }
        }

        function invokeCallback(settled, promise, callback, detail) {
            var hasCallback = isFunction(callback),
                value, 
                error, 
                succeeded, 
                failed;

            if (hasCallback) {
                try {
                    value = callback(detail);
                    succeeded = true;
                } catch(e) {
                    failed = true;
                    error = e;
                }
            } else {
                value = detail;
                succeeded = true;
            }

            if (handleThenable(promise, value)) {
                return;
            } else if (hasCallback && succeeded) {
                resolve(promise, value);
            } else if (failed) {
                reject(promise, error);
            } else if (settled === FULFILLED) {
                resolve(promise, value);
            } else if (settled === REJECTED) {
                reject(promise, value);
            }
        }

        function subscribe(parent, child, onFulfillment, onRejection) {
            var subscribers = parent._subscribers,
                length = subscribers.length;

            subscribers[length] = child;
            subscribers[length + FULFILLED] = onFulfillment;
            subscribers[length + REJECTED] = onRejection;
        }

        function publish(promise, settled) {
            var subscribers = promise._subscribers, 
                detail = promise._detail;

            for (var i = 0; i < subscribers.length; i += 3) {
                var child = subscribers[i],
                    callback = subscribers[i + settled];

                invokeCallback(settled, child, callback, detail);
            }

            promise._subscribers = null;
        }

        return Promise;
    }());
