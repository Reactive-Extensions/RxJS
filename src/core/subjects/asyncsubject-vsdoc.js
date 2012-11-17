    var AsyncSubject = root.AsyncSubject = (function () {

        function subscribe(observer) {
            checkDisposed.call(this);
            if (!this.isStopped) {
                this.observers.push(observer);
                return new InnerSubscription(this, observer);
            }
            var ex = this.exception;
            var hv = this.hasValue;
            var v = this.value;
            if (ex) {
                observer.onError(ex);
            } else if (hv) {
                observer.onNext(v);
                observer.onCompleted();
            } else {
                observer.onCompleted();
            }
            return disposableEmpty;
        }

        inherits(AsyncSubject, Observable);
        function AsyncSubject() {
            /// <summary>
            /// Creates a subject that can only receive one value and that value is cached for all future observations.
            /// </summary>
            AsyncSubject.super_.constructor.call(this, subscribe);

            this.isDisposed = false,
            this.isStopped = false,
            this.value = null,
            this.hasValue = false,
            this.observers = [],
            this.exception = null;
        }

        addProperties(AsyncSubject.prototype, Observer, {
            onCompleted: function () {
                /// <summary>
                /// Notifies all subscribed observers of the end of the sequence, also causing the last received value to be sent out (if any).
                /// </summary>
                var o, i, len;
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    var v = this.value;
                    var hv = this.hasValue;

                    if (hv) {
                        for (i = 0, len = os.length; i < len; i++) {
                            o = os[i];
                            o.onNext(v);
                            o.onCompleted();
                        }
                    } else {
                        for (i = 0, len = os.length; i < len; i++) {
                            os[i].onCompleted();
                        }
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
                /// Sends a value to the subject. The last value received before successful termination will be sent to all subscribed observers.
                /// </summary>
                /// <param name="value">The value to store in the subject.</param>
                checkDisposed.call(this);
                if (!this.isStopped) {
                    this.value = value;
                    this.hasValue = true;
                }
            },
            dispose: function () {
                /// <summary>
                /// Unsubscribe all observers and release resources.
                /// </summary>
                this.isDisposed = true;
                this.observers = null;
                this.exception = null;
                this.value = null;
            }
        });

        return AsyncSubject;
    }());
