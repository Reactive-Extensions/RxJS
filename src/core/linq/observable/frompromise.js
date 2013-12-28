    /**
     * Converts a Promise to an Observable sequence
     * @param {Promise} A Promises A+ implementation instance.
     * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
     */
    Observable.fromPromise = function (promise) {
        return new AnonymousObservable(function (observer) {
            promise.then(
                function (value) {
                    observer.onNext(value);
                    observer.onCompleted();
                }, 
                function (reason) {
                   observer.onError(reason);
                });
        });
    };