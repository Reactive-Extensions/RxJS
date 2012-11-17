    var Observable = root.Observable,
        CompositeDisposable = root.CompositeDisposable,
        RefCountDisposable = root.RefCountDisposable,
        SingleAssignmentDisposable = root.SingleAssignmentDisposable,
        SerialDisposable = root.SerialDisposable,
        Subject = root.Subject,
        observableProto = Observable.prototype,
        observableEmpty = Observable.empty,
        AnonymousObservable = root.Internals.AnonymousObservable,
        observerCreate = root.Observer.create,
        addRef = root.Internals.addRef;

    // defaults
    function noop() { }
    function defaultComparer(x, y) { return x === y; }
    