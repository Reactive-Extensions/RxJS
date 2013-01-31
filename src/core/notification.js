    /**
     *  Represents a notification to an observer.
     */
    var Notification = root.Notification = (function () {
        function Notification() { }

        addProperties(Notification.prototype, {
            accept: function (observerOrOnNext, onError, onCompleted) {
                if (arguments.length > 1 || typeof observerOrOnNext === 'function') {
                    return this._accept(observerOrOnNext, onError, onCompleted);
                } else {
                    return this._acceptObservable(observerOrOnNext);
                }
            },
            toObservable: function (scheduler) {
                var notification = this;
                scheduler = scheduler || immediateScheduler;
                return new AnonymousObservable(function (observer) {
                    return scheduler.schedule(function () {
                        notification._acceptObservable(observer);
                        if (notification.kind === 'N') {
                            observer.onCompleted();
                        }
                    });
                });
            },
            hasValue: false,
            equals: function (other) {
                var otherString = other == null ? '' : other.toString();
                return this.toString() === otherString;
            }
        });

        return Notification;
    })();

    /**
     *  Creates an object that represents an OnNext notification to an observer.
     *  
     *  @param value The value contained in the notification.
     *  @return The OnNext notification containing the value.
     */
    var notificationCreateOnNext = Notification.createOnNext = (function () {
        inherits(ON, Notification);
        function ON(value) {
            this.value = value;
            this.hasValue = true;
            this.kind = 'N';
        }

        addProperties(ON.prototype, {
            _accept: function (onNext) {
                return onNext(this.value);
            },
            _acceptObservable: function (observer) {
                return observer.onNext(this.value);
            },
            toString: function () {
                return 'OnNext(' + this.value + ')';
            }
        });

        return function (next) {
            return new ON(next);
        };
    }());

    /**
     *  Creates an object that represents an OnError notification to an observer.
     *  
     *  @param error The exception contained in the notification.
     *  @return The OnError notification containing the exception.
     */
    var notificationCreateOnError = Notification.createOnError = (function () {
        inherits(OE, Notification);
        function OE(exception) {
            this.exception = exception;
            this.kind = 'E';
        }

        addProperties(OE.prototype, {
            _accept: function (onNext, onError) {
                return onError(this.exception);
            },
            _acceptObservable: function (observer) {
                return observer.onError(this.exception);
            },
            toString: function () {
                return 'OnError(' + this.exception + ')';
            }
        });

        return function (error) {
            return new OE(error);
        };
    }());

    /**
     *  Creates an object that represents an OnCompleted notification to an observer.
     *  @return The OnCompleted notification.
     */
    var notificationCreateOnCompleted = Notification.createOnCompleted = (function () {
        inherits(OC, Notification);
        function OC() {
            this.kind = 'C';
        }

        addProperties(OC.prototype, {
            _accept: function (onNext, onError, onCompleted) {
                return onCompleted();
            },
            _acceptObservable: function (observer) {
                return observer.onCompleted();
            },
            toString: function () {
                return 'OnCompleted()';
            }
        });

        return function () {
            return new OC();
        };
    }());
