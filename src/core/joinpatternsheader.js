    // Aliases
    var Observable = root.Observable,
        observableProto = Observable.prototype,
        AnonymousObservable = root.Internals.AnonymousObservable,
        observableThrow = Observable.throwException,
        observerCreate = root.Observer.create,
        SingleAssignmentDisposable = root.SingleAssignmentDisposable,
        CompositeDisposable = root.CompositeDisposable,
        AbstractObserver = root.Internals.AbstractObserver;

    // Defaults
    function defaultComparer(x, y) { return x === y; }
    function noop() { }

    // Utilities
    var inherits = root.Internals.inherits;
    var slice = Array.prototype.slice;
    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }
