    /**
     *  Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
     *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
     *  
     * @example
     *  var res = observable.doAction(observer);
     *  var res = observable.doAction(onNext);
     *  var res = observable.doAction(onNext, onError);
     *  var res = observable.doAction(onNext, onError, onCompleted);
     * @param {Mixed} observerOrOnNext Action to invoke for each element in the observable sequence or an observer.
     * @param {Function} [onError]  Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
     * @param {Function} [onCompleted]  Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
     * @returns {Observable} The source sequence with the side-effecting behavior applied.   
     */
    observableProto['do'] = observableProto.doAction = function (observerOrOnNext, onError, onCompleted) {
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
            }, function (exception) {
                if (!onError) {
                    observer.onError(exception);
                } else {
                    try {
                        onError(exception);
                    } catch (e) {
                        observer.onError(e);
                    }
                    observer.onError(exception);
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
