    // Defaults
    var Observer = root.Observer,
        Observable = root.Observable,
        Notification = root.Notification,
        VirtualTimeScheduler = root.VirtualTimeScheduler,
        Disposable = root.Disposable,
        disposableEmpty = Disposable.empty,
        disposableCreate = Disposable.create,
        CompositeDisposable = root.CompositeDisposable,
        SingleAssignmentDisposable = root.SingleAssignmentDisposable,
        slice = Array.prototype.slice,
        inherits = root.Internals.inherits;

    // Utilities
    function defaultComparer(x, y) {
        if (!y.equals) {
            return x === y;
        }
        return y.equals(x);
    }

    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }
