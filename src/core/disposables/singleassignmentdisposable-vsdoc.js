    // Single assignment
    var SingleAssignmentDisposable = root.SingleAssignmentDisposable = function () {
        /// <summary>
        /// Initializes a new instance of the SingleAssignmentDisposable class.
        /// </summary>
        this.isDisposed = false;
        this.current = null;
    };
    SingleAssignmentDisposable.prototype.disposable = function (value) {
        /// <summary>
        /// Gets or sets the underlying disposable. After disposal, the result of getting this method is undefined.
        /// </summary>
        /// <param name="value">[Optional] The new underlying disposable.</param>
        /// <returns>The underlying disposable.</returns>
        return !value ? this.getDisposable() : this.setDisposable(value);
    };
    SingleAssignmentDisposable.prototype.getDisposable = function () {
        /// <summary>
        /// Gets  the underlying disposable. After disposal, the result of getting this method is undefined.
        /// </summary>
        /// <returns>The underlying disposable.</returns>
        return this.current;
    };
    SingleAssignmentDisposable.prototype.setDisposable = function (value) {
        /// <summary>
        /// Sets the underlying disposable. 
        /// </summary>
        /// <param name="value">The new underlying disposable.</param>
        if (this.current) {
            throw new Error('Disposable has already been assigned');
        }
        var shouldDispose = this.isDisposed;
        if (!shouldDispose) {
            this.current = value;
        }
        if (shouldDispose && value) {
            value.dispose();
        }
    };
    SingleAssignmentDisposable.prototype.dispose = function () {
        /// <summary>
        /// Disposes the underlying disposable.
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
