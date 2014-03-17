    // Aliases
    var Observable = Rx.Observable,
        observableProto = Observable.prototype,
        AnonymousObservable = Rx.AnonymousObservable,
        observableConcat = Observable.concat,
        observableDefer = Observable.defer,
        observableEmpty = Observable.empty,
        disposableEmpty = Rx.Disposable.empty,
        CompositeDisposable = Rx.CompositeDisposable,
        SerialDisposable = Rx.SerialDisposable,
        SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
        enumeratorCreate = Rx.internals.Enumerator.create,
        Enumerable = Rx.internals.Enumerable,
        enumerableForEach = Enumerable.forEach,
        immediateScheduler = Rx.Scheduler.immediate,
        currentThreadScheduler = Rx.Scheduler.currentThread,
        slice = Array.prototype.slice,
        AsyncSubject = Rx.AsyncSubject,
        Observer = Rx.Observer,
        inherits = Rx.internals.inherits,
        addProperties = Rx.internals.addProperties;

    // Utilities
    function nothing () { }
    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }
