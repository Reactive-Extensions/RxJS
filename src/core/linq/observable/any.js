    /**
     * Determines whether any element of an observable sequence satisfies a condition if present, else if any items are in the sequence.
     * @example
     * var result = source.any();
     * var result = source.any(function (x) { return x > 3; });
     * @param {Function} [predicate] A function to test each element for a condition.
     * @returns {Observable} An observable sequence containing a single element determining whether any elements in the source sequence pass the test in the specified predicate if given, else if any items are in the sequence.
     */
    observableProto.some = observableProto.any = function (predicate, thisArg) {
        var source = this;
        return predicate ?
            source.where(predicate, thisArg).any() :
            new AnonymousObservable(function (observer) {
                return source.subscribe(function () {
                    observer.onNext(true);
                    observer.onCompleted();
                }, observer.onError.bind(observer), function () {
                    observer.onNext(false);
                    observer.onCompleted();
                });
            });
    };
