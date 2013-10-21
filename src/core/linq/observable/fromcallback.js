    /**
     * Converts a callback function to an observable sequence. 
     * 
     * @param {Function} function Function with a callback as the last parameter to convert to an Observable sequence.
     * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
     * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
     * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
     */
    Observable.fromCallback = function (func, scheduler, context) {
        scheduler || (scheduler = timeoutScheduler);
        return function () {
            var args = slice.call(arguments, 0), 
                subject = new AsyncSubject();

            scheduler.schedule(function () {
                function handler() {
                    subject.onNext(arguments);
                    subject.onCompleted();
                }

                args.push(handler);
                func.apply(context, args);
            });

            return subject.asObservable();
        };
    };
