    // Aliases
    var Observable = Rx.Observable,
        observableProto = Observable.prototype,
        AnonymousObservable = Rx.AnonymousObservable,
        observableThrow = Observable.throwException,
        observerCreate = Rx.Observer.create,
        SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
        CompositeDisposable = Rx.CompositeDisposable,
        AbstractObserver = Rx.internals.AbstractObserver,
        isEqual = Rx.internals.isEqual;

    // Defaults
    function defaultComparer(x, y) { return isEqual(x, y); }
    function noop() { }

    // Utilities
    var inherits = Rx.internals.inherits;
    var slice = Array.prototype.slice;
    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }
