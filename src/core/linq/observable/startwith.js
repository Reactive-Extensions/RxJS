    /**
     *  Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.
     *  
     *  var res = source.startWith(1, 2, 3);
     *  var res = source.startWith(Rx.Scheduler.timeout, 1, 2, 3);
     *  
     * @memberOf Observable#
     * @returns {Observable} The source sequence prepended with the specified values.  
     */
    observableProto.startWith = function () {
        var values, scheduler, start = 0;
        if (!!arguments.length && 'now' in Object(arguments[0])) {
            scheduler = arguments[0];
            start = 1;
        } else {
            scheduler = immediateScheduler;
        }
        values = slice.call(arguments, start);
        return enumerableFor([observableFromArray(values, scheduler), this]).concat();
    };
