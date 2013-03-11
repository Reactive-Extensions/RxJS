    /**
     * Represents a disposable resource whose underlying disposable resource can be replaced by another disposable resource, causing automatic disposal of the previous underlying disposable resource.
     *
     * @constructor 
     */
    var SerialDisposable = Rx.SerialDisposable = function () {
        this.isDisposed = false;
        this.current = null;
    };

    /**
     * Gets the underlying disposable.
     * @return The underlying disposable</returns>
     */
    SerialDisposable.prototype.getDisposable = function () {
        return this.current;
    };

    /**
     * Sets the underlying disposable.
     *
     * @memberOf SerialDisposable#
     * @param {Disposable} value The new underlying disposable.
     */  
    SerialDisposable.prototype.setDisposable = function (value) {
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

    /**
     * Gets or sets the underlying disposable.
     * If the SerialDisposable has already been disposed, assignment to this property causes immediate disposal of the given disposable object. Assigning this property disposes the previous disposable object.
     * 
     * @memberOf SerialDisposable#
     * @param {Disposable} [value] The new underlying disposable.
     * @returns {Disposable} The underlying disposable.
     */    
    SerialDisposable.prototype.disposable = function (value) {
        if (!value) {
            return this.getDisposable();
        } else {
            this.setDisposable(value);
        }
    };

    /** 
     * Disposes the underlying disposable as well as all future replacements.
     * 
     * @memberOf SerialDisposable#
     */
    SerialDisposable.prototype.dispose = function () {
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
