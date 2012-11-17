    // Main disposable class
    var Disposable = root.Disposable = function (action) {
        this.isDisposed = false;
        this.action = action;
    };
    Disposable.prototype.dispose = function () {
        /// <summary>
        /// Performs the task of cleaning up resources.
        /// </summary>
        if (!this.isDisposed) {
            this.action();
            this.isDisposed = true;
        }
    };

    var disposableCreate = Disposable.create = function (action) {
        /// <summary>
        /// Creates a disposable object that invokes the specified action when disposed.
        /// </summary>
        /// <param name="dispose">Action to run during the first call to <see cref="IDisposable.Dispose"/>. The action is guaranteed to be run at most once.</param>
        /// <returns>The disposable object that runs the given action upon disposal.</returns>
        return new Disposable(action);
    };
    var disposableEmpty = Disposable.empty = { dispose: noop };
    