    // Main disposable class
    var Disposable = root.Disposable = function (action) {
        this.isDisposed = false;
        this.action = action;
    };
    Disposable.prototype.dispose = function () {
        if (!this.isDisposed) {
            this.action();
            this.isDisposed = true;
        }
    };

    var disposableCreate = Disposable.create = function (action) { return new Disposable(action); },
        disposableEmpty = Disposable.empty = { dispose: noop };
