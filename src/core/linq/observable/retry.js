    /**
     *  Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
     *  
     * @example
     *  var res = retried = retry.repeat();
     *  var res = retried = retry.repeat(42);
     * @param {Number} [retryCount]  Number of times to retry the sequence. If not provided, retry the sequence indefinitely.
     * @returns {Observable} An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully. 
     */
    observableProto.retry = function (retryCount) {
        return enumerableRepeat(this, retryCount).catchException();
    };
