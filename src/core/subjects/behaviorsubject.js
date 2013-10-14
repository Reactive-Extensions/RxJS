    /**
     *  Represents a value that changes over time.
     *  Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications.
     */
    var BehaviorSubject = Rx.BehaviorSubject = (function (_super) {
        function subscribe(observer) {
            checkDisposed.call(this);
            if (!this.isStopped) {
                this.observers.push(observer);
                observer.onNext(this.value);
                return new InnerSubscription(this, observer);
            }
            var ex = this.exception;
            if (ex) {
                observer.onError(ex);
            } else {
                observer.onCompleted();
            }
            return disposableEmpty;
        }

        inherits(BehaviorSubject, _super);

        /**
         * @constructor
         *  Initializes a new instance of the BehaviorSubject class which creates a subject that caches its last value and starts with the specified value.
         *  @param {Mixed} value Initial value sent to observers when no other value has been received by the subject yet.
         */       
        function BehaviorSubject(value) {
            _super.call(this, subscribe);

            this.value = value,
            this.observers = [],
            this.isDisposed = false,
            this.isStopped = false,
            this.exception = null;
        }

        addProperties(BehaviorSubject.prototype, Observer, {
            /**
             * Indicates whether the subject has observers subscribed to it.
             * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
             */         
            hasObservers: function () {
                return this.observers.length > 0;
            },
            /**
             * Notifies all subscribed observers about the end of the sequence.
             */ 
            onCompleted: function () {
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
            /**
             * Notifies all subscribed observers about the exception.
             * @param {Mixed} error The exception to send to all observers.
             */             
            onError: function (error) {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    this.exception = error;

                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onError(error);
                    }

                    this.observers = [];
                }
            },
            /**
             * Notifies all subscribed observers about the arrival of the specified element in the sequence.
             * @param {Mixed} value The value to send to all observers.
             */              
            onNext: function (value) {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    this.value = value;
                    var os = this.observers.slice(0);
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onNext(value);
                    }
                }
            },
            /**
             * Unsubscribe all observers and release resources.
             */            
            dispose: function () {
                this.isDisposed = true;
                this.observers = null;
                this.value = null;
                this.exception = null;
            }
        });

        return BehaviorSubject;
    }(Observable));
