    /**
     *  Creates an observable sequence from a specified subscribe method implementation.
     *  
     * @example
     *  var res = Rx.Observable.create(function (observer) { return function () { } );
     *  
     * @param {Function} subscribe Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.
     * @returns {Observable} The observable sequence with the specified implementation for the Subscribe method.
     */
    Observable.create = function (subscribe) {
        return new AnonymousObservable(function (o) {
            return disposableCreate(subscribe(o));
        });
    };
