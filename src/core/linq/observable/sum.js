    /**
     * Computes the sum of a sequence of values that are obtained by invoking an optional transform function on each element of the input sequence, else if not specified computes the sum on each item in the sequence.
     * @example
     * var res = source.sum();
     * var res = source.sum(function (x) { return x.value; });
     * @param {Function} [selector] A transform function to apply to each element.
     * @param {Any} [thisArg] Object to use as this when executing callback.        
     * @returns {Observable} An observable sequence containing a single element with the sum of the values in the source sequence.
     */    
    observableProto.sum = function (keySelector, thisArg) {
        return keySelector ? 
            this.select(keySelector, thisArg).sum() :
            this.aggregate(0, function (prev, curr) {
                return prev + curr;
            });
    };
