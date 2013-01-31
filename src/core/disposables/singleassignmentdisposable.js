    /**
     * @constructor
     *  Represents a disposable resource which only allows a single assignment of its underlying disposable resource.
     *  If an underlying disposable resource has already been set, future attempts to set the underlying disposable resource will throw an Error.
     */
    var SingleAssignmentDisposable = root.SingleAssignmentDisposable = function () {
        this.isDisposed = false;
        this.current = null;
    };

    /**
     *  Gets or sets the underlying disposable. After disposal, the result of getting this method is undefined.
     *  
     *  @param [value] The new underlying disposable.
     *  @return The underlying disposable.
     */
    SingleAssignmentDisposable.prototype.disposable = function (value) {
        return !value ? this.getDisposable() : this.setDisposable(value);
    };

    /**
     *  Gets the underlying disposable. After disposal, the result of getting this method is undefined.
     *  @return The underlying disposable.
     */  
    SingleAssignmentDisposable.prototype.getDisposable = function () {
        return this.current;
    };

    /**
     *  Sets the underlying disposable. 
     *  @param value The new underlying disposable.
     */
    SingleAssignmentDisposable.prototype.setDisposable = function (value) {
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

    /** Disposes the underlying disposable. */   
    SingleAssignmentDisposable.prototype.dispose = function () {
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
