    /**
     *  Converts a generator function to an observable sequence, using an optional scheduler to enumerate the generator.
     *  
     * @example
     *  var res = Rx.Observable.fromGenerator(function* () { yield 42; });
     *  var res = Rx.Observable.fromArray(function* () { yield 42; }, Rx.Scheduler.timeout);
     * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
     * @returns {Observable} The observable sequence whose elements are pulled from the given generator sequence.
     */
    observableProto.fromGenerator = function (genFn, scheduler) {
        scheduler || (scheduler = currentThreadScheduler);
        return new AnonymousObservable(function (observer) {
            var gen;
            try {
                gen = genFn();
            } catch (e) {
                observer.onError(e);
                return;
            }

            return scheduler.scheduleRecursive(function (self) {
                var next = gen.next();
                if (next.done) {
                    observer.onCompleted();
                } else {
                    observer.onNext(next.value);
                    self();
                }
            });
        });
    };
