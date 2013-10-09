    /**
     * Returns the last element of an observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.
     * @example
     * var res = source.lastOrDefault();
     * var res = source.lastOrDefault(function (x) { return x > 3; });
     * var res = source.lastOrDefault(function (x) { return x > 3; }, 0);
     * var res = source.lastOrDefault(null, 0);
     * @param {Function} [predicate] A predicate function to evaluate for elements in the source sequence.
     * @param [defaultValue] The default value if no such element exists.  If not specified, defaults to null.
     * @param {Any} [thisArg] Object to use as `this` when executing the predicate.     
     * @returns {Observable} Sequence containing the last element in the observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.
     */
    observableProto.lastOrDefault = function (predicate, defaultValue, thisArg) {
        return predicate ? 
            this.where(predicate, thisArg).lastOrDefault(null, defaultValue) :
            lastOrDefaultAsync(this, true, defaultValue);
    };
