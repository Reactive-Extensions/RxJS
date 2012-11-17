    var observableProto;
    var Observable = root.Observable = (function () {

        function Observable(subscribe) {
            this._subscribe = subscribe;
        }

        observableProto = Observable.prototype;

        observableProto.finalValue = function () {
            var source = this;
            return new AnonymousObservable(function (observer) {
                var hasValue = false, value;
                return source.subscribe(function (x) {
                    hasValue = true;
                    value = x;
                }, observer.onError.bind(observer), function () {
                    if (!hasValue) {
                        observer.onError(new Error(sequenceContainsNoElements));
                    } else {
                        observer.onNext(value);
                        observer.onCompleted();
                    }
                });
            });
        };

        observableProto.subscribe = function (observerOrOnNext, onError, onCompleted) {
            /// <summary>
            /// Subscribes an observer to the observable sequence.
            /// &#10;
            /// &#10;1 - source.subscribe();
            /// &#10;2 - source.subscribe(observer);
            /// &#10;3 - source.subscribe(function (x) { console.log(x); });
            /// &#10;4 - source.subscribe(function (x) { console.log(x); }, function (err) { console.log(err); });
            /// &#10;5 - source.subscribe(function (x) { console.log(x); }, function (err) { console.log(err); }, function () { console.log('done'); });
            /// </summary>
            /// <param name="observerOrOnNext">[Optional] The object that is to receive notifications or an action to invoke for each element in the observable sequence.</param>
            /// <param name="onError">[Optional] Action to invoke upon exceptional termination of the observable sequence.</param>
            /// <param name="onCompleted">[Optional] Action to invoke upon graceful termination of the observable sequence.</param>
            /// <returns>The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.</returns>            
            var subscriber;
            if (arguments.length === 0 || arguments.length > 1 || typeof observerOrOnNext === 'function') {
                subscriber = observerCreate(observerOrOnNext, onError, onCompleted);
            } else {
                subscriber = observerOrOnNext;
            }
            return this._subscribe(subscriber);
        };

        observableProto.toArray = function () {
            /// <summary>
            /// Creates a list from an observable sequence.
            /// </summary>
            /// <returns>An observable sequence containing a single element with a list containing all the elements of the source sequence.</returns>         
            function accumulator(list, i) {
                list.push(i);
                return list.slice(0);
            }
            return this.scan([], accumulator).startWith([]).finalValue();
        }

        return Observable;
    })();
