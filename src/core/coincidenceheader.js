    var Observable = Rx.Observable,
        CompositeDisposable = Rx.CompositeDisposable,
        RefCountDisposable = Rx.RefCountDisposable,
        SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
        SerialDisposable = Rx.SerialDisposable,
        Subject = Rx.Subject,
        observableProto = Observable.prototype,
        observableEmpty = Observable.empty,
        AnonymousObservable = Rx.Internals.AnonymousObservable,
        observerCreate = Rx.Observer.create,
        addRef = Rx.Internals.addRef;

    // defaults
    function noop() { }
    function defaultComparer(x, y) { return x === y; }
    