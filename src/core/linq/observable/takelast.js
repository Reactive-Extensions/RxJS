    /**
     *  Returns a specified number of contiguous elements from the end of an observable sequence, using an optional scheduler to drain the queue.
     *  
     * @example
     *  var res = source.takeLast(5);
     *  var res = source.takeLast(5, Rx.Scheduler.timeout);
     *  
     * @description
     *  This operator accumulates a buffer with a length enough to store elements count elements. Upon completion of
     *  the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.
     * @param {Number} count Number of elements to take from the end of the source sequence.
     * @param {Scheduler} [scheduler] Scheduler used to drain the queue upon completion of the source sequence.
     * @returns {Observable} An observable sequence containing the specified number of elements from the end of the source sequence.
     */   
    observableProto.takeLast = function (count, scheduler) {
        return this.takeLastBuffer(count).selectMany(function (xs) { return observableFromArray(xs, scheduler); });
    };
