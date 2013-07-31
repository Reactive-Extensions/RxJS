    // Aliases
    var Observable = Rx.Observable,
        observableProto = Observable.prototype,
        AnonymousObservable = Rx.Internals.AnonymousObservable,
        observableThrow = Observable.throwException,
        observerCreate = Rx.Observer.create,
        SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
        CompositeDisposable = Rx.CompositeDisposable,
        AbstractObserver = Rx.Internals.AbstractObserver,
        isEqual = Rx.Internals.isEqual;

    // Defaults
    function defaultComparer(x, y) { return isEqual(x, y); }
    function noop() { }

    // Utilities
    var inherits = Rx.Internals.inherits;
    var slice = Array.prototype.slice;
    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }
