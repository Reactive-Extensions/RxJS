    /**
     * Represents a disposable resource whose underlying disposable resource can be replaced by another disposable resource, causing automatic disposal of the previous underlying disposable resource.
     * @constructor 
     */
    var BooleanDisposable = Rx.BooleanDisposable = function () {
        this.isDisposed = false;
        this.current = null;
    };

    // Set up aliases
    Rx.SingleAssignmentDisposable = Rx.SerialDisposable = BooleanDisposable;
    var booleanDisposablePrototype = BooleanDisposable.prototype;

    var SingleAssignmentDisposable = BooleanDisposable,
        SerialDisposable = BooleanDisposable;

    /**
     * Gets the underlying disposable.
     * @return The underlying disposable.
     */
    booleanDisposablePrototype.getDisposable = function () {
        return this.current;
    };

    /**
     * Sets the underlying disposable.
     * @param {Disposable} value The new underlying disposable.
     */  
    booleanDisposablePrototype.setDisposable = function (value) {
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

    /* @private */
    booleanDisposablePrototype.disposable = function (value) {
        if (!value) {
            return this.getDisposable();
        } else {
            this.setDisposable(value);
        }
    };

    /** 
     * Disposes the underlying disposable as well as all future replacements.
     */
    booleanDisposablePrototype.dispose = function () {
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
