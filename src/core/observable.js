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
     *  @param {Mixed} [observerOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
     *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
     *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
     *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
     */
    observableProto.subscribe = observableProto.forEach = function (observerOrOnNext, onError, onCompleted, thisArg) {
      var subscriber = typeof observerOrOnNext === 'object' ?
        observerOrOnNext :
        arguments.length === 4 ?
          observerCreate(observerOrOnNext, onError, onCompleted, thisArg) :
          observerCreate(observerOrOnNext, onError, onCompleted);

      return this._subscribe(subscriber);
    };

    /**
     * Subscribes to the next value in the sequence with an optional "this" argument.
     * @param {Function} onNext The function to invoke on each element in the observable sequence.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
     */
    observableProto.subscribeNext = function (onNext, thisArg) {
      var observer = arguments.length === 2 ?
        observerCreate(onNext, null, null, thisArg) :
        observerCreate(onNext, null, null);
      return this._subscribe(observer);
    };

    /**
     * Subscribes to an exceptional condition in the sequence with an optional "this" argument.
     * @param {Function} onError The function to invoke upon exceptional termination of the observable sequence.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
     */
    observableProto.subscribeError = function (onError, thisArg) {
      var observer = arguments.length === 2 ?
        observerCreate(null, onError, null, thisArg) :
        observerCreate(null, onError, null);      
      return this._subscribe(observer);
    };

    /**
     * Subscribes to the next value in the sequence with an optional "this" argument.
     * @param {Function} onCompleted The function to invoke upon graceful termination of the observable sequence.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
     */
    observableProto.subscribeCompleted = function (onCompleted, thisArg) {
      var observer = arguments.length === 2 ?
        observerCreate(null, null, onCompleted, thisArg) :
        observerCreate(null, null, onCompleted);        
      return this._subscribe(observer);
    };

    return Observable;
  })();
