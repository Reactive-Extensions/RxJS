  // References
  var Observable = Rx.Observable,
    observableProto = Observable.prototype,
    AnonymousObservable = Rx.AnonymousObservable,
    AbstractObserver = Rx.internals.AbstractObserver,
    CompositeDisposable = Rx.CompositeDisposable,
    Subject = Rx.Subject,
    Observer = Rx.Observer,
    disposableEmpty = Rx.Disposable.empty,
    disposableCreate = Rx.Disposable.create,
    inherits = Rx.internals.inherits,
    addProperties = Rx.internals.addProperties,
    timeoutScheduler = Rx.Scheduler.timeout,
    currentThreadScheduler = Rx.Scheduler.currentThread,
    identity = Rx.helpers.identity,
    //TODO Get some consistency about where this is declared
    isScheduler = Rx.helpers.isScheduler || Rx.Scheduler.isScheduler,
    checkDisposed = Rx.Disposable.checkDisposed;
