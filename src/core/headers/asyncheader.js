  // Aliases
  var Observable = Rx.Observable,
    observableFromPromise = Observable.fromPromise,
    observableThrow = Observable.throwError,
    AnonymousObservable = Rx.AnonymousObservable,
    AsyncSubject = Rx.AsyncSubject,
    disposableCreate = Rx.Disposable.create,
    CompositeDisposable = Rx.CompositeDisposable,
    immediateScheduler = Rx.Scheduler.immediate,
    defaultScheduler = Rx.Scheduler['default'],
    isScheduler = Rx.Scheduler.isScheduler,
    isPromise = Rx.helpers.isPromise,
    isFunction = Rx.helpers.isFunction;
