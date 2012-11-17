    Observable.create = function (subscribe) {
        /// <summary>
        /// Creates an observable sequence from a specified subscribe method implementation.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.create(function (observer) { return function () { } );
        /// </summary>
        /// <param name="subscribe">Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.</param>
        /// <returns>The observable sequence with the specified implementation for the Subscribe method.</returns>
        return new AnonymousObservable(function (o) {
            return disposableCreate(subscribe(o));
        });
    };

    Observable.createWithDisposable = function (subscribe) {
        /// <summary>
        /// Creates an observable sequence from a specified subscribe method implementation.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.create(function (observer) { return Rx.Disposable.empty; } );        
        /// </summary>
        /// <param name="subscribe">Implementation of the resulting observable sequence's subscribe method.</param>
        /// <returns>The observable sequence with the specified implementation for the Subscribe method.</returns>
        return new AnonymousObservable(subscribe);
    };

    var observableDefer = Observable.defer = function (observableFactory) {
        /// <summary>
        /// Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.defer(function () { return Rx.Observable.fromArray([1,2,3]); });    
        /// </summary>
        /// <param name="observableFactory">Observable factory function to invoke for each observer that subscribes to the resulting sequence.</param>
        /// <returns>An observable sequence whose observers trigger an invocation of the given observable factory function.</returns>
        return new AnonymousObservable(function (observer) {
            var result;
            try {
                result = observableFactory();
            } catch (e) {
                return observableThrow(e).subscribe(observer);
            }
            return result.subscribe(observer);
        });
    };

    var observableEmpty = Observable.empty = function (scheduler) {
        /// <summary>
        /// Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.empty();  
        /// &#10;2 - res = Rx.Observable.empty(Rx.Scheduler.timeout);  
        /// </summary>
        /// <param name="scheduler">Scheduler to send the termination call on.</param>
        /// <returns>An observable sequence with no elements.</returns>
        scheduler || (scheduler = immediateScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
                observer.onCompleted();
            });
        });
    };

    var observableFromArray = Observable.fromArray = function (array, scheduler) {
        /// <summary>
        /// Converts an array to an observable sequence, using an optional scheduler to enumerate the array.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.fromArray([1,2,3]);
        /// &#10;2 - res = Rx.Observable.fromArray([1,2,3], Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="scheduler">[Optional] Scheduler to run the enumeration of the input sequence on.</param>
        /// <returns>The observable sequence whose elements are pulled from the given enumerable sequence.</returns>
        scheduler || (scheduler = currentThreadScheduler);
        return new AnonymousObservable(function (observer) {
            var count = 0;
            return scheduler.scheduleRecursive(function (self) {
                if (count < array.length) {
                    observer.onNext(array[count++]);
                    self();
                } else {
                    observer.onCompleted();
                }
            });
        });
    };    

    Observable.generate = function (initialState, condition, iterate, resultSelector, scheduler) {
        /// <summary>
        /// Generates an observable sequence by running a state-driven loop producing the sequence's elements, using the specified scheduler to send out observer messages.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; });
        /// &#10;2 - res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; }, Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="initialState">Initial state.</param>
        /// <param name="condition">Condition to terminate generation (upon returning false).</param>
        /// <param name="iterate">Iteration step function.</param>
        /// <param name="resultSelector">Selector function for results produced in the sequence.</param>
        /// <param name="scheduler">[Optional] Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.currentThread.</param>
        /// <returns>The generated sequence.</returns>
        scheduler || (scheduler = currentThreadScheduler);
        return new AnonymousObservable(function (observer) {
            var first = true, state = initialState;
            return scheduler.scheduleRecursive(function (self) {
                var hasResult, result;
                try {
                    if (first) {
                        first = false;
                    } else {
                        state = iterate(state);
                    }
                    hasResult = condition(state);
                    if (hasResult) {
                        result = resultSelector(state);
                    }
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                if (hasResult) {
                    observer.onNext(result);
                    self();
                } else {
                    observer.onCompleted();
                }
            });
        });
    };    

    var observableNever = Observable.never = function () {
        /// <summary>
        /// Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins).
        /// </summary>
        /// <returns>An observable sequence whose observers will never get called.</returns>
        return new AnonymousObservable(function () {
            return disposableEmpty;
        });
    };

    Observable.range = function (start, count, scheduler) {
        /// <summary>
        /// Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.range(0, 10);
        /// &#10;2 - res = Rx.Observable.range(0, 10, Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="start">The value of the first integer in the sequence.</param>
        /// <param name="count">The number of sequential integers to generate.</param>
        /// <param name="scheduler">[Optional] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.</param>
        /// <returns>An observable sequence that contains a range of sequential integral numbers.</returns>
        scheduler || (scheduler = currentThreadScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.scheduleRecursiveWithState(0, function (i, self) {
                if (i < count) {
                    observer.onNext(start + i);
                    self(i + 1);
                } else {
                    observer.onCompleted();
                }
            });
        });
    };

    Observable.repeat = function (value, repeatCount, scheduler) {
        /// <summary>
        /// Generates an observable sequence that repeats the given element the specified number of times, using the specified scheduler to send out observer messages.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.repeat(42);
        /// &#10;2 - res = Rx.Observable.repeat(42, 4);
        /// &#10;3 - res = Rx.Observable.repeat(42, 4, Rx.Scheduler.timeout);
        /// &#10;4 - res = Rx.Observable.repeat(42, null, Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="value">Element to repeat.</param>
        /// <param name="repeatCount">[Optiona] Number of times to repeat the element. If not specified, repeats indefinitely.</param>
        /// <param name="scheduler">Scheduler to run the producer loop on. If not specified, defaults to Scheduler.immediate.</param>
        /// <returns>An observable sequence that repeats the given element the specified number of times.</returns>
        scheduler || (scheduler = currentThreadScheduler);
        if (repeatCount == undefined) {
            repeatCount = -1;
        }
        return observableReturn(value, scheduler).repeat(repeatCount);
    };

    var observableReturn = Observable.returnValue = function (value, scheduler) {
        /// <summary>
        /// Returns an observable sequence that contains a single element, using the specified scheduler to send out observer messages.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.returnValue(42);
        /// &#10;2 - res = Rx.Observable.returnValue(42, Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="value">Single element in the resulting observable sequence.</param>
        /// <param name="scheduler">Scheduler to send the single element on. If not specified, defaults to Scheduler.immediate.</param>
        /// <returns>An observable sequence containing the single specified element.</returns>
        scheduler || (scheduler = immediateScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
                observer.onNext(value);
                observer.onCompleted();
            });
        });
    };

    var observableThrow = Observable.throwException = function (exception, scheduler) {
        /// <summary>
        /// Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single OnError message.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.throwException(new Error('Error'));
        /// &#10;2 - res = Rx.Observable.throwException(new Error('Error'), Rx.Scheduler.timeout);
        /// </summary>
        /// <param name="exception">An object used for the sequence's termination.</param>
        /// <param name="scheduler">Scheduler to send the exceptional termination call on. If not specified, defaults to Scheduler.immediate.</param>
        /// <returns>The observable sequence that terminates exceptionally with the specified exception object.</returns>
        scheduler || (scheduler = immediateScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
                observer.onError(exception);
            });
        });
    };

    Observable.using = function (resourceFactory, observableFactory) {
        /// <summary>
        /// Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
        /// &#10;
        /// &#10;1 - res = Rx.Observable.using(function () { return new AsyncSubject(); }, function (s) { return s; });
        /// </summary>
        /// <param name="resourceFactory">Factory function to obtain a resource object.</param>
        /// <param name="observableFactory">Factory function to obtain an observable sequence that depends on the obtained resource.</param>
        /// <returns>An observable sequence whose lifetime controls the lifetime of the dependent resource object.</returns>
        return new AnonymousObservable(function (observer) {
            var disposable = disposableEmpty, resource, source;
            try {
                resource = resourceFactory();
                if (resource) {
                    disposable = resource;
                }
                source = observableFactory(resource);
            } catch (exception) {
                return new CompositeDisposable(observableThrow(exception).subscribe(observer), disposable);
            }
            return new CompositeDisposable(source.subscribe(observer), disposable);
        });
    };