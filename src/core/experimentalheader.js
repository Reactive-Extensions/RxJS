    // Aliases
    var Observable = root.Observable,
        observableProto = Observable.prototype,
        observableCreateWithDisposable = Observable.createWithDisposable,
        observableConcat = Observable.concat,
        observableDefer = Observable.defer,
        observableEmpty = Observable.empty,
        disposableEmpty = root.Disposable.empty,
        BinaryObserver = root.Internals.BinaryObserver,
        CompositeDisposable = root.CompositeDisposable,
        SerialDisposable = root.SerialDisposable,
        SingleAssignmentDisposable = root.SingleAssignmentDisposable,
        enumeratorCreate = root.Internals.Enumerator.create,
        Enumerable = root.Internals.Enumerable,
        enumerableForEach = Enumerable.forEach,
        immediateScheduler = root.Scheduler.immediate,
        slice = Array.prototype.slice;

    // Utilities
    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }
