  var observableProto;

  /**
   * Represents a push-style collection.
   */
  var Observable = Rx.Observable = (function () {

    function Observable(subscribe) {
      this._subscribe = subscribe;
    }

    observableProto = Observable.prototype;

    /**
     *  Subscribes an observer to the observable sequence.
     *  
     * @example
     *  1 - source.subscribe();
     *  2 - source.subscribe(observer);
     *  3 - source.subscribe(function (x) { console.log(x); });
     *  4 - source.subscribe(function (x) { console.log(x); }, function (err) { console.log(err); });
     *  5 - source.subscribe(function (x) { console.log(x); }, function (err) { console.log(err); }, function () { console.log('done'); });
     *  @param {Mixed} [observerOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
     *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
     *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
     *  @returns {Diposable} The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler. 
     */
    observableProto.subscribe = observableProto.forEach = function (observerOrOnNext, onError, onCompleted) {
      var subscriber = typeof observerOrOnNext === 'object' ?
        observerOrOnNext :
        observerCreate(observerOrOnNext, onError, onCompleted);

      return this._subscribe(subscriber);
    };

    return Observable;
  })();
