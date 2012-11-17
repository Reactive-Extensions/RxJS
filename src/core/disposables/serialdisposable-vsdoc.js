    // Multiple assignment disposable
    var SerialDisposable = root.SerialDisposable = function () {
        /// <summary>
        /// Initializes a new instance of the SerialDisposable class.
        /// </summary>
        this.isDisposed = false;
        this.current = null;
    };
    SerialDisposable.prototype.getDisposable = function () {
        /// <summary>
        /// Gets the underlying disposable.
        /// </summary>
        /// <returns>The underlying disposable</returns>
        return this.current;
    };
    SerialDisposable.prototype.setDisposable = function (value) {
        /// <summary>
        /// Sets the underlying disposable.
        /// </summary>
        /// <param name="value">The new underlying disposable.</param>
        var shouldDispose = this.isDisposed, old;
        if (!shouldDispose) {
            old = this.current;
            this.current = value;
        }
        if (old) {
            old.dispose();
        }
        if (shouldDispose && value) {
            value.dispose();
        }
    };
    SerialDisposable.prototype.disposable = function (value) {
        /// <summary>
        /// Gets or sets the underlying disposable.
        /// </summary>
        /// <remarks>If the SerialDisposable has already been disposed, assignment to this property causes immediate disposal of the given disposable object. Assigning this property disposes the previous disposable object.</remarks>
        if (!value) {
            return this.getDisposable();
        } else {
            this.setDisposable(value);
        }
    };
    SerialDisposable.prototype.dispose = function () {
        /// <summary>
        /// Disposes the underlying disposable as well as all future replacements.
        /// </summary>
        var old;
        if (!this.isDisposed) {
            this.isDisposed = true;
            old = this.current;
            this.current = null;
        }
        if (old) {
            old.dispose();
        }
    };
