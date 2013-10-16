    /**
     * Converts a Promise to an Observable sequence
     * @param {Promise} A Promises A+ implementation instance.
     * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
     */
    Observable.fromPromise = function (promise) {
        var subject = new AsyncSubject();
        
        promise.then(
            function (value) {
                subject.onNext(value);
                subject.onCompleted();
            }, 
            function (reason) {
               subject.onError(reason);
            });
            
        return subject.asObservable();
    };