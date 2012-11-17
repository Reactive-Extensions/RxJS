    // Replay Subject
    var ReplaySubject = root.ReplaySubject = (function (base) {
        var RemovableDisposable = function (subject, observer) {
            this.subject = subject;
            this.observer = observer;
        };

        RemovableDisposable.prototype.dispose = function () {
            this.observer.dispose();
            if (!this.subject.isDisposed) {
                var idx = this.subject.observers.indexOf(this.observer);
                this.subject.observers.splice(idx, 1);
            }
        };

        function subscribe(observer) {
            var so = new ScheduledObserver(this.scheduler, observer),
                subscription = new RemovableDisposable(this, so);
            checkDisposed.call(this);
            this._trim(this.scheduler.now());
            this.observers.push(so);

            var n = this.q.length;

            for (var i = 0, len = this.q.length; i < len; i++) {
                so.onNext(this.q[i].value);
            }

            if (this.hasError) {
                n++;
                so.onError(this.error);
            } else if (this.isStopped) {
                n++;
                so.onCompleted();
            }

            so.ensureActive(n);
            return subscription;
        }

        inherits(ReplaySubject, Observable);

        function ReplaySubject(bufferSize, window, scheduler) {
            /// <summary>
            /// Initializes a new instance of the ReplaySubject class with the specified buffer size, window and scheduler.
            /// </summary>
            /// <param name="bufferSize">[Optional] Maximum element count of the replay buffer. If not specified, defaults to Number.MAX_VALUE.</param>
            /// <param name="window">[Optional] Maximum time length of the replay buffer. If not specified, defaults to Number.MAX_VALUE.</param>
            /// <param name="scheduler">[Optional] Scheduler the observers are invoked on. If not specified, defaults to Scheduler.currentThread.</param>
            this.bufferSize = bufferSize == null ? Number.MAX_VALUE : bufferSize;
            this.window = window == null ? Number.MAX_VALUE : window;
            this.scheduler = scheduler || currentThreadScheduler;
            this.q = [];
            this.observers = [];
            this.isStopped = false;
            this.isDisposed = false;
            this.hasError = false;
            this.error = null;
            ReplaySubject.super_.constructor.call(this, subscribe);
        }

        addProperties(ReplaySubject.prototype, Observer, {
            _trim: function (now) {
                while (this.q.length > this.bufferSize) {
                    this.q.shift();
                }
                while (this.q.length > 0 && (now - this.q[0].interval) > this.window) {
                    this.q.shift();
                }
            },
            onNext: function (value) {
                /// <summary>
                /// Notifies all subscribed and future observers about the arrival of the specified element in the sequence.
                /// </summary>
                /// <param name="value">The value to send to all observers.</param>
                var observer;
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var now = this.scheduler.now();
                    this.q.push({ interval: now, value: value });
                    this._trim(now);

                    var o = this.observers.slice(0);
                    for (var i = 0, len = o.length; i < len; i++) {
                        observer = o[i];
                        observer.onNext(value);
                        observer.ensureActive();
                    }
                }
            },
            onError: function (error) {
                /// <summary>
                /// Notifies all subscribed and future observers about the specified exception.
                /// </summary>
                /// <param name="error">The exception to send to all observers.</param>
                var observer;
                checkDisposed.call(this);
                if (!this.isStopped) {
                    this.isStopped = true;
                    this.error = error;
                    this.hasError = true;
                    var now = this.scheduler.now();
                    this._trim(now);
                    var o = this.observers.slice(0);
                    for (var i = 0, len = o.length; i < len; i++) {
                        observer = o[i];
                        observer.onError(error);
                        observer.ensureActive();
                    }
                    this.observers = [];
                }
            },
            onCompleted: function () {
                /// <summary>
                /// Notifies all subscribed and future observers about the end of the sequence.
                /// </summary>
                var observer;
                checkDisposed.call(this);
                if (!this.isStopped) {
                    this.isStopped = true;
                    var now = this.scheduler.now();
                    this._trim(now);
                    var o = this.observers.slice(0);
                    for (var i = 0, len = o.length; i < len; i++) {
                        observer = o[i];
                        observer.onCompleted();
                        observer.ensureActive();
                    }
                    this.observers = [];
                }
            },
            dispose: function () {
                /// <summary>
                /// Releases all resources used by the current instance of the ReplaySubject class and unsubscribe all observers.
                /// </summary>
                this.isDisposed = true;
                this.observers = null;
            }
        });

        return ReplaySubject;
    }());
