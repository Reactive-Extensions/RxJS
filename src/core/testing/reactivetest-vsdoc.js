    // New predicate tests
    function OnNextPredicate(predicate) {
        this.predicate = predicate;
    };
    OnNextPredicate.prototype.equals = function (other) {
        if (other === this) { return true; }
        if (other == null) { return false; }
        if (other.kind !== 'N') { return false; }
        return this.predicate(other.value);
    };

    function OnErrorPredicate(predicate) {
        this.predicate = predicate;
    };
    OnErrorPredicate.prototype.equals = function (other) {
        if (other === this) { return true; }
        if (other == null) { return false; }
        if (other.kind !== 'E') { return false; }
        return this.predicate(other.exception);
    };

    var ReactiveTest = root.ReactiveTest = {
        created: 100,
        subscribed: 200,
        disposed: 1000,
        onNext: function (ticks, value) {
            /// <summary>
            /// Factory method for an OnNext notification record at a given time with a given value or a predicate function.
            /// &#10;
            /// &#10;1 - ReactiveTest.onNext(200, 42);
            /// &#10;2 - ReactiveTest.onNext(200, function (x) { return x.length == 2; });
            /// </summary>
            /// <param name="ticks">Recorded virtual time the OnNext notification occurs.</param>
            /// <param name="value">Recorded value stored in the OnNext notification or a predicate.</param>
            /// <returns>Recorded OnNext notification.</returns>
            if (typeof value === 'function') {
                return new Recorded(ticks, new OnNextPredicate(value));
            }
            return new Recorded(ticks, Notification.createOnNext(value));
        },
        onError: function (ticks, exception) {
            /// <summary>
            /// Factory method for an OnError notification record at a given time with a given error.
            /// &#10;
            /// &#10;1 - ReactiveTest.onNext(200, new Error('error'));
            /// &#10;2 - ReactiveTest.onNext(200, function (e) { return e.message === 'error'; });
            /// </summary>
            /// <param name="ticks">Recorded virtual time the OnError notification occurs.</param>
            /// <param name="exception">Recorded exception stored in the OnError notification.</param>
            /// <returns>Recorded OnError notification.</returns>
            if (typeof exception === 'function') {
                return new Recorded(ticks, new OnErrorPredicate(exception));
            }
            return new Recorded(ticks, Notification.createOnError(exception));
        },
        onCompleted: function (ticks) {
            /// <summary>
            /// Factory method for an OnCompleted notification record at a given time.
            /// </summary>
            /// <param name="ticks">Recorded virtual time the OnCompleted notification occurs.</param>
            /// <returns>Recorded OnCompleted notification.</returns>
            return new Recorded(ticks, Notification.createOnCompleted());
        },
        subscribe: function (start, end) {
            /// <summary>
            /// Factory method for a subscription record based on a given subscription and disposal time.
            /// </summary>
            /// <param name="start">Virtual time indicating when the subscription was created.</param>
            /// <param name="end">Virtual time indicating when the subscription was disposed.</param>
            /// <returns>Subscription object.</returns>
            return new Subscription(start, end);
        }
    };
