    /**
     * Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
     * For aggregation behavior with incremental intermediate results, see Observable.scan.
     * @example
     * 1 - res = source.aggregate(function (acc, x) { return acc + x; });
     * 2 - res = source.aggregate(0, function (acc, x) { return acc + x; });
     * @param {Mixed} [seed] The initial accumulator value.
     * @param {Function} accumulator An accumulator function to be invoked on each element.
     * @returns {Observable} An observable sequence containing a single element with the final accumulator value.
     */
    observableProto.aggregate = function () {
        var seed, hasSeed, accumulator;
        if (arguments.length === 2) {
            seed = arguments[0];
            hasSeed = true;
            accumulator = arguments[1];
        } else {
            accumulator = arguments[0];
        }
        return hasSeed ? this.scan(seed, accumulator).startWith(seed).finalValue() : this.scan(accumulator).finalValue();
    };
