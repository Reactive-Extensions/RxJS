    /**
     * Computes the average of an observable sequence of values that are in the sequence or obtained by invoking a transform function on each element of the input sequence if present.
     * @example
     * var res = res = source.average();
     * var res = res = source.average(function (x) { return x.value; });
     * @param {Function} [selector] A transform function to apply to each element.
     * @param {Any} [thisArg] Object to use as this when executing callback.        
     * @returns {Observable} An observable sequence containing a single element with the average of the sequence of values.
     */
    observableProto.average = function (keySelector, thisArg) {
        return keySelector ?
            this.select(keySelector, thisArg).average() :
            this.scan({
                sum: 0,
                count: 0
            }, function (prev, cur) {
                return {
                    sum: prev.sum + cur,
                    count: prev.count + 1
                };
            }).finalValue().select(function (s) {
                if (s.count === 0) {
                    throw new Error('The input sequence was empty');
                }
                return s.sum / s.count;
            });
    };
