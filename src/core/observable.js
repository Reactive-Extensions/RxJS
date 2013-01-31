    var observableProto;

    /**
     * Represents a push-style collection.
     */
    var Observable = root.Observable = (function () {

        /**
         * @constructor
         */
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

        /**
         *  Subscribes an observer to the observable sequence.
         *  
         *  1 - source.subscribe();
         *  2 - source.subscribe(observer);
         *  3 - source.subscribe(function (x) { console.log(x); });
         *  4 - source.subscribe(function (x) { console.log(x); }, function (err) { console.log(err); });
         *  5 - source.subscribe(function (x) { console.log(x); }, function (err) { console.log(err); }, function () { console.log('done'); });
         *  
         *  @param {Mixed} [observerOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
         *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
         *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
         *  @return The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler. 
         */
        observableProto.subscribe = function (observerOrOnNext, onError, onCompleted) {
            var subscriber;
            if (arguments.length === 0 || arguments.length > 1 || typeof observerOrOnNext === 'function') {
                subscriber = observerCreate(observerOrOnNext, onError, onCompleted);
            } else {
                subscriber = observerOrOnNext;
            }
            return this._subscribe(subscriber);
        };

        /**
         *  Creates a list from an observable sequence.
         *  
         *  @return An observable sequence containing a single element with a list containing all the elements of the source sequence.  
         */
        observableProto.toArray = function () {
            function accumulator(list, i) {
                list.push(i);
                return list.slice(0);
            }
            return this.scan([], accumulator).startWith([]).finalValue();
        }

        return Observable;
    })();
