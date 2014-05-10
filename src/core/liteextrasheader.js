  // References
  var Observable = Rx.Observable,
    observableProto = Observable.prototype,
    observableNever = Observable.never,
    observableThrow = Observable.throwException,
    AnonymousObservable = Rx.AnonymousObservable,
    Observer = Rx.Observer,
    Subject = Rx.Subject,
    internals = Rx.internals,
    helpers = Rx.helpers,
    ScheduledObserver = internals.ScheduledObserver,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
    CompositeDisposable = Rx.CompositeDisposable,
    RefCountDisposable = Rx.RefCountDisposable,
    disposableEmpty = Rx.Disposable.empty,
    immediateScheduler = Rx.Scheduler.immediate,
    defaultKeySerializer = helpers.defaultKeySerializer,
    addRef = Rx.internals.addRef,
    identity = helpers.identity,
    isPromise = helpers.isPromise,
    inherits = internals.inherits,
    noop = helpers.noop,
    observableFromPromise = Observable.fromPromise,   
    slice = Array.prototype.slice;

  function argsOrArray(args, idx) {
    return args.length === 1 && Array.isArray(args[idx]) ?
      args[idx] :
      slice.call(args);
  }

  var argumentOutOfRange = 'Argument out of range';
