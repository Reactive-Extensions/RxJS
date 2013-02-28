    /**
     *  Represents a notification to an observer.
     */
    var Notification = root.Notification = (function () {
        function Notification(kind, hasValue) { 
            this.hasValue = hasValue == null ? false : hasValue;
            this.kind = kind;
        }

        var NotificationPrototype = Notification.prototype;

        NotificationPrototype.accept = function (observerOrOnNext, onError, onCompleted) {
            if (arguments.length > 1 || typeof observerOrOnNext === 'function') {
                return this._accept(observerOrOnNext, onError, onCompleted);
            } else {
                return this._acceptObservable(observerOrOnNext);
            }
        };

        NotificationPrototype.toObservable = function (scheduler) {
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
        };

        NotificationPrototype.equals = function (other) {
            var otherString = other == null ? '' : other.toString();
            return this.toString() === otherString;
        };

        return Notification;
    })();

    /**
     *  Creates an object that represents an OnNext notification to an observer.
     *  
     *  @param value The value contained in the notification.
     *  @return The OnNext notification containing the value.
     */
    var notificationCreateOnNext = Notification.createOnNext = (function () {

        function _accept (onNext) {
            return onNext(this.value);
        }

        function _acceptObservable(observer) {
            return observer.onNext(this.value);
        }

        function toString () {
            return 'OnNext(' + this.value + ')';
        }

        return function (value) {
            var notification = new Notification('N', true);
            notification.value = value;
            notification._accept = _accept.bind(notification);
            notification._acceptObservable = _acceptObservable.bind(notification);
            notification.toString = toString.bind(notification);
            return notification;
        };
    }());

    /**
     *  Creates an object that represents an OnError notification to an observer.
     *  
     *  @param error The exception contained in the notification.
     *  @return The OnError notification containing the exception.
     */
    var notificationCreateOnError = Notification.createOnError = (function () {

        function _accept (onNext, onError) {
            return onError(this.exception);
        }

        function _acceptObservable(observer) {
            return observer.onError(this.exception);
        }

        function toString () {
            return 'OnError(' + this.exception + ')';
        }

        return function (exception) {
            var notification = new Notification('E');
            notification.exception = exception;
            notification._accept = _accept.bind(notification);
            notification._acceptObservable = _acceptObservable.bind(notification);
            notification.toString = toString.bind(notification);
            return notification;
        };
    }());

    /**
     *  Creates an object that represents an OnCompleted notification to an observer.
     *  @return The OnCompleted notification.
     */
    var notificationCreateOnCompleted = Notification.createOnCompleted = (function () {

        function _accept (onNext, onError, onCompleted) {
            return onCompleted();
        }

        function _acceptObservable(observer) {
            return observer.onCompleted();
        }

        function toString () {
            return 'OnCompleted()';
        }

        return function () {
            var notification = new Notification('C');
            notification._accept = _accept.bind(notification);
            notification._acceptObservable = _acceptObservable.bind(notification);
            notification.toString = toString.bind(notification);
            return notification;
        };
    }());
