    /**
     *  Projects each element of an observable sequence into a new form by incorporating the element's index.
     * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source. 
     */
    observableProto.select = observableProto.map = function (selector, thisArg) {
        var parent = this;
        return new AnonymousObservable(function (observer) {
            var count = 0;
            return parent.subscribe(function (value) {
                var result;
                try {
                    result = selector.call(thisArg, value, count++, parent);
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                observer.onNext(result);
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };
