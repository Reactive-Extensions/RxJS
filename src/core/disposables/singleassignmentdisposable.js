    /**
     * Represents a disposable resource which only allows a single assignment of its underlying disposable resource.
     * If an underlying disposable resource has already been set, future attempts to set the underlying disposable resource will throw an Error.
     * 
     * @constructor
     */
    var SingleAssignmentDisposable = Rx.SingleAssignmentDisposable = function () {
        this.isDisposed = false;
        this.current = null;
    };

    var SingleAssignmentDisposablePrototype = SingleAssignmentDisposable.prototype;

    /**
     *  Gets the underlying disposable. After disposal, the result of getting this method is undefined. 
     * @returns {Disposable} The underlying disposable.
     */  
    SingleAssignmentDisposablePrototype.getDisposable = function () {
        return this.current;
    };

    /* @private */
    SingleAssignmentDisposable.disposable = function (value) {
        return arguments.length ? this.getDisposable() : this.setDisposable(value);
    };

    /**
     *  Sets the underlying disposable. 
     * @param {Disposable} value The new underlying disposable.
     */
    SingleAssignmentDisposablePrototype.setDisposable = function (value) {
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

    /** 
     * Disposes the underlying disposable.
     */
    SingleAssignmentDisposablePrototype.dispose = function () {
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
