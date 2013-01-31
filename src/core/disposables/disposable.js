    /**
     * @constructor
     * Provides a set of static methods for creating Disposables.
     * @param dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
     */
    var Disposable = root.Disposable = function (action) {
        this.isDisposed = false;
        this.action = action;
    };

    /** Performs the task of cleaning up resources. */     
    Disposable.prototype.dispose = function () {
        if (!this.isDisposed) {
            this.action();
            this.isDisposed = true;
        }
    };

    /**
     *  Creates a disposable object that invokes the specified action when disposed.
     *  
     *  @param dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
     *  @return The disposable object that runs the given action upon disposal.
     */
    var disposableCreate = Disposable.create = function (action) { return new Disposable(action); };

    /** Gets the disposable that does nothing when disposed. */
    var disposableEmpty = Disposable.empty = { dispose: noop };
