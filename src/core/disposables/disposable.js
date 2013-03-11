    /**
     * Provides a set of static methods for creating Disposables.
     *
     * @constructor 
     * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
     */
    var Disposable = Rx.Disposable = function (action) {
        this.isDisposed = false;
        this.action = action;
    };

    /** 
     * Performs the task of cleaning up resources.
     *
     * @memberOf Disposable#
     */     
    Disposable.prototype.dispose = function () {
        if (!this.isDisposed) {
            this.action();
            this.isDisposed = true;
        }
    };

    /**
     *  Creates a disposable object that invokes the specified action when disposed.
     *  
     * @static
     * @memberOf Disposable
     * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
     * @return {Disposable} The disposable object that runs the given action upon disposal.
     */
    var disposableCreate = Disposable.create = function (action) { return new Disposable(action); };

    /** 
     * Gets the disposable that does nothing when disposed. 
     * 
     * @static
     * @memberOf Disposable
     */
    var disposableEmpty = Disposable.empty = { dispose: noop };
