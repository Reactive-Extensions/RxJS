    /**
     * Supports push-style iteration over an observable sequence.
     */
    var Observer = root.Observer = function () { };

    /**
     *  Creates a notification callback from an observer.
     *  
     *  @param observer Observer object.
     *  @return The action that forwards its input notification to the underlying observer.
     */
    Observer.prototype.toNotifier = function () {
        var observer = this;
        return function (n) {
            return n.accept(observer);
        };
    };

    /**
     *  Hides the identity of an observer.
     *  
     *  @param observer An observer whose identity to hide.
     *  @return An observer that hides the identity of the specified observer. 
     */   
    Observer.prototype.asObserver = function () {
        return new AnonymousObserver(this.onNext.bind(this), this.onError.bind(this), this.onCompleted.bind(this));
    };

    /**
     *  Checks access to the observer for grammar violations. This includes checking for multiple OnError or OnCompleted calls, as well as reentrancy in any of the observer methods.
     *  If a violation is detected, an Error is thrown from the offending observer method call.
     *  
     *  @param observer The observer whose callback invocations should be checked for grammar violations.
     *  @return An observer that checks callbacks invocations against the observer grammar and, if the checks pass, forwards those to the specified observer.
     */    
    Observer.prototype.checked = function () { return new CheckedObserver(this); };

    /**
     *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
     *  
     *  @param {Function} [onNext] Observer's OnNext action implementation.
     *  @param {Function} [onError] Observer's OnError action implementation.
     *  @param {Function} [onCompleted] Observer's OnCompleted action implementation.
     *  @return The observer object implemented using the given actions.
     */
    var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
        onNext || (onNext = noop);
        onError || (onError = defaultError);
        onCompleted || (onCompleted = noop);
        return new AnonymousObserver(onNext, onError, onCompleted);
    };

    /**
     *  Creates an observer from a notification callback.
     *  
     *  @param handler Action that handles a notification.
     *  @return The observer object that invokes the specified handler using a notification corresponding to each message it receives.
     */
    Observer.fromNotifier = function (handler) {
        return new AnonymousObserver(function (x) {
            return handler(notificationCreateOnNext(x));
        }, function (exception) {
            return handler(notificationCreateOnError(exception));
        }, function () {
            return handler(notificationCreateOnCompleted());
        });
    };
    