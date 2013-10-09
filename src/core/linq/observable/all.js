    /**
     * Determines whether all elements of an observable sequence satisfy a condition.
     * 
     * 1 - res = source.all(function (value) { return value.length > 3; });
     * @memberOf Observable#
     * @param {Function} [predicate] A function to test each element for a condition.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Observable} An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.
     */
    observableProto.every = observableProto.all = function (predicate, thisArg) {
        return this.where(function (v) {
            return !predicate(v);
        }, thisArg).any().select(function (b) {
            return !b;
        });
    };
