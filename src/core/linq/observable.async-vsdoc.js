    Observable.start = function (func, scheduler, context) {
        /// <summary>
        /// Invokes the specified function asynchronously on the specified scheduler, surfacing the result through an observable sequence.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.start(function () { console.log('hello'); });
        /// &#10;2 - res = Rx.Observable.start(function () { console.log('hello'); }, Rx.Scheduler.timeout);
        /// &#10;2 - res = Rx.Observable.start(function () { this.log('hello'); }, Rx.Scheduler.timeout, console);
        /// </summary>
        /// <param name="func">Function to run asynchronously.</param>
        /// <param name="scheduler">[Optional] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.</param>
        /// <param name="context">[Optional] The context for the func parameter to be executed.  If not specified, defaults to undefined.</param>
        /// <returns>An observable sequence exposing the function's result value, or an exception.</returns>
        /// <remarks>
        /// <list type="bullet">
        /// <item><description>The function is called immediately, not during the subscription of the resulting sequence.</description></item>
        /// <item><description>Multiple subscriptions to the resulting sequence can observe the function's result.</description></item>
        /// </list>
        /// </remarks>
        return observableToAsync(func, scheduler, context)();
    };

    var observableToAsync = Observable.toAsync = function (func, scheduler, context) {
        /// <summary>
        /// Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.toAsync(function (x, y) { return x + y; })(4, 3);
        /// &#10;2 - res = Rx.Observable.toAsync(function (x, y) { return x + y; }, Rx.Scheduler.timeout)(4, 3);
        /// &#10;2 - res = Rx.Observable.toAsync(function (x) { this.log(x); }, Rx.Scheduler.timeout, console)('hello');
        /// </summary>
        /// <param name="function">Function to convert to an asynchronous function.</param>
        /// <param name="scheduler">[Optional] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.</param>
        /// <param name="context">[Optional] The context for the func parameter to be executed.  If not specified, defaults to undefined.</param>
        /// <returns>Asynchronous function.</returns>
        scheduler || (scheduler = timeoutScheduler);
        return function () {
            var args = slice.call(arguments, 0), subject = new AsyncSubject();
            scheduler.schedule(function () {
                var result;
                try {
                    result = func.apply(context, args);
                } catch (e) {
                    subject.onError(e);
                    return;
                }
                subject.onNext(result);
                subject.onCompleted();
            });
            return subject.asObservable();
        };
    };
