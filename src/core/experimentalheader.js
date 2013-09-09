    // Aliases
    var Observable = Rx.Observable,
        observableProto = Observable.prototype,
        observableCreateWithDisposable = Observable.createWithDisposable,
        observableConcat = Observable.concat,
        observableDefer = Observable.defer,
        observableEmpty = Observable.empty,
        disposableEmpty = Rx.Disposable.empty,
        BinaryObserver = Rx.Internals.BinaryObserver,
        CompositeDisposable = Rx.CompositeDisposable,
        SerialDisposable = Rx.SerialDisposable,
        SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
        enumeratorCreate = Rx.Internals.Enumerator.create,
        Enumerable = Rx.Internals.Enumerable,
        enumerableForEach = Enumerable.forEach,
        immediateScheduler = Rx.Scheduler.immediate,
        currentThreadScheduler = Rx.Scheduler.currentThread,
        slice = Array.prototype.slice,
        AsyncSubject = Rx.AsyncSubject,
        Observer = Rx.Observer,
        inherits = Rx.Internals.inherits,
        addProperties = Rx.Internals.addProperties;

    // Utilities
    function nothing () { }
    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }
