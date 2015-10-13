  // Aliases
  var Observable = Rx.Observable,
    observableProto = Observable.prototype,
    AnonymousObservable = Rx.AnonymousObservable,
    observableThrow = Observable.throwError,
    observerCreate = Rx.Observer.create,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
    CompositeDisposable = Rx.CompositeDisposable,
    AbstractObserver = Rx.internals.AbstractObserver,
    noop = Rx.helpers.noop,
    inherits = Rx.internals.inherits,
    isFunction = Rx.helpers.isFunction;
