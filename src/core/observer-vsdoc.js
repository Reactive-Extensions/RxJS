    // Observer
    var Observer = root.Observer = function () { };
    Observer.prototype.toNotifier = function () {
        /// <summary>
        /// Creates a notification callback from an observer.
        /// </summary>
        /// <typeparam name="T">The type of the elements received by the observer.</typeparam>
        /// <param name="observer">Observer object.</param>
        /// <returns>The action that forwards its input notification to the underlying observer.</returns>
        var observer = this;
        return function (n) {
            return n.accept(observer);
        };
    };
    Observer.prototype.asObserver = function () {
        /// <summary>
        /// Hides the identity of an observer.
        /// </summary>
        /// <typeparam name="T">The type of the elements received by the source observer.</typeparam>
        /// <param name="observer">An observer whose identity to hide.</param>
        /// <returns>An observer that hides the identity of the specified observer.</returns>
        return new AnonymousObserver(this.onNext.bind(this), this.onError.bind(this), this.onCompleted.bind(this));
    };
    Observer.prototype.checked = function () {
        /// <summary>
        /// Checks access to the observer for grammar violations. This includes checking for multiple OnError or OnCompleted calls, as well as reentrancy in any of the observer methods.
        /// If a violation is detected, an Error is thrown from the offending observer method call.
        /// </summary>
        /// <param name="observer">The observer whose callback invocations should be checked for grammar violations.</param>
        /// <returns>An observer that checks callbacks invocations against the observer grammar and, if the checks pass, forwards those to the specified observer.</returns>
        return new CheckedObserver(this);
    };

    var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
        /// <summary>
        /// Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
        /// </summary>
        /// <param name="onNext">Observer's OnNext action implementation.</param>
        /// <param name="onError">[Optional] Observer's OnError action implementation.</param>
        /// <param name="onCompleted">[Optional] Observer's OnCompleted action implementation.</param>
        /// <returns>The observer object implemented using the given actions.</returns>
        onNext || (onNext = noop);
        onError || (onError = defaultError);
        onCompleted || (onCompleted = noop);
        return new AnonymousObserver(onNext, onError, onCompleted);
    };

    Observer.fromNotifier = function (handler) {
        /// <summary>
        /// Creates an observer from a notification callback.
        /// </summary>
        /// <param name="handler">Action that handles a notification.</param>
        /// <returns>The observer object that invokes the specified handler using a notification corresponding to each message it receives.</returns>
        return new AnonymousObserver(function (x) {
            return handler(notificationCreateOnNext(x));
        }, function (exception) {
            return handler(notificationCreateOnError(exception));
        }, function () {
            return handler(notificationCreateOnCompleted());
        });
    };
