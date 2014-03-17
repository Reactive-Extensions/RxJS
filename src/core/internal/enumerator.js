    /** 
     * @constructor
     * @private
     */
    var Enumerator = Rx.internals.Enumerator = function (moveNext, getCurrent) {
        this.moveNext = moveNext;
        this.getCurrent = getCurrent;
    };

    /**
     * @static
     * @memberOf Enumerator
     * @private
     */
    var enumeratorCreate = Enumerator.create = function (moveNext, getCurrent) {
        var done = false;
        return new Enumerator(function () {
            if (done) {
                return false;
            }
            var result = moveNext();
            if (!result) {
                done = true;
            }
            return result;
        }, function () { return getCurrent(); });
    };
    