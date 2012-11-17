    var AnonymousObserver = root.AnonymousObserver = (function () {
        inherits(AnonymousObserver, AbstractObserver);
        function AnonymousObserver(onNext, onError, onCompleted) {
            /// <summary>
            /// Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
            /// </summary>
            /// <param name="onNext">Observer's OnNext action implementation.</param>
            /// <param name="onError">Observer's OnError action implementation.</param>
            /// <param name="onCompleted">Observer's OnCompleted action implementation.</param>
            AnonymousObserver.super_.constructor.call(this);
            this._onNext = onNext;
            this._onError = onError;
            this._onCompleted = onCompleted;
        }
        AnonymousObserver.prototype.next = function (value) {
            /// <summary>
            /// Calls the onNext action.
            /// </summary>
            /// <param name="value">Next element in the sequence.</param>
            this._onNext(value);
        };
        AnonymousObserver.prototype.error = function (exception) {
            /// <summary>
            /// Calls the onError action.
            /// </summary>
            /// <param name="error">The error that has occurred.</param>
            this._onError(exception);
        };
        AnonymousObserver.prototype.completed = function () {
            /// <summary>
            /// Calls the onCompleted action.
            /// </summary>
            this._onCompleted();
        };
        return AnonymousObserver;
    }());
