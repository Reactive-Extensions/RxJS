    /**
     * Converts a callback function to an observable sequence. 
     * 
     * @param {Function} function Function to convert to an asynchronous function.
     * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
     * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
     * @returns {Function} Asynchronous function.
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
