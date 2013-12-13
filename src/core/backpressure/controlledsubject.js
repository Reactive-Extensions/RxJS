    var ControlledSubject = (function (_super) {

        function subscribe (observer) {
            return this.subject.subscribe(observer);
        }

        inherits(ControlledSubject, _super);

        function ControlledSubject(enableQueue) {
            _super.call(this, subscribe);
            this.subject = new Subject();
            this.queue = enableQueue ? [] : null;
            this.requested = emptyRequest;
            this.requestedDisposable = disposableEmpty;
            this.error = null;
            this.hasCompleted = false;
            this.controlledDisposable = disposableEmpty;
        }

        addProperties(ControlledSubject.prototype, Observer, {
            onCompleted: function () {
                checkDisposed.call(this);
                this.hasCompleted = true;

                if (!!this.queue || this.queue.length === 0) {
                    this.onCompleted();
                }
            },
            onError: function (error) {
                checkDisposed.call(this);
                this.error = error;

                if (!!this.queue || this.queue.length === 0) {
                    this.onError(error);
                }   
            },
            onNext: function (value) {
                checkDisposed.call(this);
                var hasRequested = true,
                    req = this.requested;

                if (req === emptyRequest) {
                    if (!!this.queue) {
                        this.queue.push(value);
                    }
                } else {
                    if (req !== unboundedRequest) {
                        if (req.count-- === 0) {
                            this.disposeCurrentRequest();
                        }
                    }
                    hasRequested = false;
                }

                if (hasRequested) {
                    this.subject.onNext(value);
                }
            },
            _processRequest: function (numberOfItems) {
                this.disposeCurrentRequest();

                if (!!this.queue) {
                    while (this.queue.length > numberOfItems && numberOfItems > 0) {
                        this.subject.onNext(this.queue.shift());
                        numberOfItems--;
                    }

                    if (this.queue.length !== 0) {
                        return { numberOfItems: numberOfItems, returnValue: true };
                    } else {
                        return { numberOfItems: numberOfItems, returnValue: false };
                    }
                }

                if (!!this.error) {
                    this.subject.onError(this.error);
                    this.controlledDisposable.dispose();
                    this.controlledDisposable = disposableEmpty;
                } else if (this.hasCompleted) {
                    this.subject.onCompleted();
                    this.controlledDisposable.dispose();
                    this.controlledDisposable = disposableEmpty;                   
                }

                return { numberOfItems: numberOfItems, returnValue: false };
            },
            request: function (number) {
                checkDisposed.call(this);
                this.disposeCurrentRequest();
                var self = this,
                    r = this._processRequest(number);

                number = r.number;
                if (r.returnValue) {
                    this.requested = new Requested(number);
                    this.requestedDisposable = disposableCreate(function () {
                        self.requested = emptyRequest;
                    });

                    return this.requestedDisposable
                } else {
                    return disposableEmpty;
                }
            },
            disposeCurrentRequest: function () {
                this.requestedDisposable.dispose();
                this.requestedDisposable = disposableEmpty;
            },

            dispose: function () {
                this.isDisposed = true;
                this.error = null;
                this.subject.dispose();
                this.requestedDisposable.dispose();
            }
        });

        function Requested(count) {
            this.count = count;
        }
        var emptyRequest = new Requested(0);
        var unboundedRequest = new Requested(-1);

        return ControlledSubject;
    }(Observable));