    /**
     * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
     * @param {Function} addHandler The function to add a handler to the emitter.
     * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
     * @returns {Observable} An observable sequence which wraps an event from an event emitter
     */
    Observable.fromEventPattern = function (addHandler, removeHandler) {
        return new AnonymousObservable(function (observer) {
            function innerHandler (e) {
                observer.onNext(e);
            }

            var returnValue = addHandler(innerHandler);
            return disposableCreate(function () {
                if (removeHandler) {
                    removeHandler(innerHandler, returnValue);
                }
            });
        }).publish().refCount();
    };
