    // Abstract Observer
    var AbstractObserver = root.Internals.AbstractObserver = (function () {
        inherits(AbstractObserver, Observer);
        function AbstractObserver() {
            this.isStopped = false;
        }

        AbstractObserver.prototype.onNext = function (value) {
            /// <summary>
            /// Notifies the observer of a new element in the sequence.
            /// </summary>
            /// <param name="value">Next element in the sequence.</param>
            if (!this.isStopped) {
                this.next(value);
            }
        };
        AbstractObserver.prototype.onError = function (error) {
            /// <summary>
            /// Notifies the observer that an exception has occurred.
            /// </summary>
            /// <param name="error">The error that has occurred.</param>
            if (!this.isStopped) {
                this.isStopped = true;
                this.error(error);
            }
        };
        AbstractObserver.prototype.onCompleted = function () {
            /// <summary>
            /// Notifies the observer of the end of the sequence.
            /// </summary>
            if (!this.isStopped) {
                this.isStopped = true;
                this.completed();
            }
        };
        AbstractObserver.prototype.dispose = function () {
            /// <summary>
            /// Disposes the observer, causing it to transition to the stopped state.
            /// </summary>
            this.isStopped = true;
        };
        AbstractObserver.prototype.fail = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this.error(true);
                return true;
            }

            return false;
        };

        return AbstractObserver;
    }());
