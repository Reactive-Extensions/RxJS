    var Subject = root.Subject = (function () {
        function subscribe(observer) {
            checkDisposed.call(this);
            if (!this.isStopped) {
                this.observers.push(observer);
                return new InnerSubscription(this, observer);
            }
            if (this.exception) {
                observer.onError(this.exception);
                return disposableEmpty;
            }
            observer.onCompleted();
            return disposableEmpty;
        }

        inherits(Subject, Observable);
        function Subject() {
            /// <summary>
            /// Creates a subject.
            /// </summary>
            Subject.super_.constructor.call(this, subscribe);
            this.isDisposed = false,
            this.isStopped = false,
            this.observers = [];
        }

        addProperties(Subject.prototype, Observer, {
            onCompleted: function () {
                /// <summary>
                /// Notifies all subscribed observers of the end of the sequence.
                /// </summary>
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onCompleted();
                    }

                    this.observers = [];
                }
            },
            onError: function (exception) {
                /// <summary>
                /// Notifies all subscribed observers with the exception.
                /// </summary>
                /// <param name="error">The exception to send to all subscribed observers.</param>
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    this.exception = exception;
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onError(exception);
                    }

                    this.observers = [];
                }
            },
            onNext: function (value) {
                /// <summary>
                /// Notifies all subscribed observers with the value.
                /// </summary>
                /// <param name="value">The value to send to all subscribed observers.</param>
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onNext(value);
                    }
                }
            },
            dispose: function () {
                /// <summary>
                /// Unsubscribe all observers and release resources.
                /// </summary>
                this.isDisposed = true;
                this.observers = null;
            }
        });

        Subject.create = function (observer, observable) {
            /// <summary>
            /// Creates a subject from the specified observer and observable.
            /// </summary>
            /// <param name="observer">The observer used to publish messages to the subject.</param>
            /// <param name="observable">The observable used to subscribe to messages sent from the subject.</param>
            /// <returns>Subject implemented using the given observer and observable.</returns>
            return new AnonymousSubject(observer, observable);
        };

        return Subject;
    }());
