    /**
     * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
     * @param {Function} func The function to call
     * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
     * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
     * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
     */
    Observable.fromNodeCallback = function (func, scheduler, context) {
        scheduler || (scheduler = timeoutScheduler);
        return function () {
            var args = slice.call(arguments, 0), 
                subject = new AsyncSubject();

            scheduler.schedule(function () {
                function handler(err) {
                    var handlerArgs = slice.call(arguments, 1);

                    if (err) {
                        subject.onError(err);
                        return;
                    }

                    subject.onNext(handlerArgs);
                    subject.onCompleted();
                }

                args.push(handler);
                func.apply(context, args);
            });

            return subject.asObservable();
        };
    };
