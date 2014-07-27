  /**
   *  Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
   *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
   *  
   * @example
   *  var res = observable.do(observer);
   *  var res = observable.do(onNext);
   *  var res = observable.do(onNext, onError);
   *  var res = observable.do(onNext, onError, onCompleted);
   * @param {Function | Observer} observerOrOnNext Action to invoke for each element in the observable sequence or an observer.
   * @param {Function} [onError]  Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
   * @param {Function} [onCompleted]  Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
   * @returns {Observable} The source sequence with the side-effecting behavior applied.   
   */
  observableProto['do'] = observableProto.doAction = observableProto.tap = function (observerOrOnNext, onError, onCompleted) {
    var source = this, onNextFunc;
    if (typeof observerOrOnNext === 'function') {
      onNextFunc = observerOrOnNext;
    } else {
      onNextFunc = observerOrOnNext.onNext.bind(observerOrOnNext);
      onError = observerOrOnNext.onError.bind(observerOrOnNext);
      onCompleted = observerOrOnNext.onCompleted.bind(observerOrOnNext);
    }
    return new AnonymousObservable(function (observer) {
      return source.subscribe(function (x) {
        try {
          onNextFunc(x);
        } catch (e) {
          observer.onError(e);
        }
        observer.onNext(x);
      }, function (err) {
        if (!onError) {
          observer.onError(err);
        } else {
          try {
            onError(err);
          } catch (e) {
            observer.onError(e);
          }
          observer.onError(err);
        }
      }, function () {
        if (!onCompleted) {
          observer.onCompleted();
        } else {
          try {
            onCompleted();
          } catch (e) {
            observer.onError(e);
          }
          observer.onCompleted();
        }
      });
    });
  };
