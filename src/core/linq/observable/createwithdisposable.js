    /**
     *  Creates an observable sequence from a specified subscribe method implementation.
     *  
     * @example
     *  var res = Rx.Observable.create(function (observer) { return Rx.Disposable.empty; } );        
     * @param {Function} subscribe Implementation of the resulting observable sequence's subscribe method.
     * @returns {Observable} The observable sequence with the specified implementation for the Subscribe method.
     */
    Observable.createWithDisposable = function (subscribe) {
        return new AnonymousObservable(subscribe);
    };
