    var RefCountDisposable = root.RefCountDisposable = (function () {

        function InnerDisposable(disposable) {
            this.disposable = disposable;
            this.disposable.count++;
            this.isInnerDisposed = false;
        }

        InnerDisposable.prototype.dispose = function () {
            if (!this.disposable.isDisposed) {
                if (!this.isInnerDisposed) {
                    this.isInnerDisposed = true;
                    this.disposable.count--;
                    if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
                        this.disposable.isDisposed = true;
                        this.disposable.underlyingDisposable.dispose();
                    }
                }
            }
        };

        function RefCountDisposable(disposable) {
            /// <summary>
            /// Initializes a new instance of the RefCountDisposable class with the specified disposable.
            /// </summary>
            /// <param name="disposable">Underlying disposable.</param>
            this.underlyingDisposable = disposable;
            this.isDisposed = false;
            this.isPrimaryDisposed = false;
            this.count = 0;
        }

        RefCountDisposable.prototype.dispose = function () {
            /// <summary>
            /// Disposes the underlying disposable only when all dependent disposables have been disposed.
            /// </summary>
            if (!this.isDisposed) {
                if (!this.isPrimaryDisposed) {
                    this.isPrimaryDisposed = true;
                    if (this.count === 0) {
                        this.isDisposed = true;
                        this.underlyingDisposable.dispose();
                    }
                }
            }
        };
        RefCountDisposable.prototype.getDisposable = function () {
            /// <summary>
            /// Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.
            /// </summary>
            /// <returns>A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.</returns>
            return this.isDisposed ? disposableEmpty : new InnerDisposable(this);
        };

        return RefCountDisposable;
    })();
