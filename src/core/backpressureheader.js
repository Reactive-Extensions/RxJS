  // References
  var Observable = Rx.Observable,
    observableProto = Observable.prototype,
    AnonymousObservable = Rx.Internals.AnonymousObservable,
    Subject = Rx.Subject,
    Observer = Rx.Observer,
    disposableEmpty = Rx.Disposable.empty,
    disposableCreate = Rx.Disposable.create,
    inherits = Rx.Internals.inherits,
    addProperties = Rx.Internals.addProperties,  
    timeoutScheduler = Rx.Scheduler.timeout;

  var objectDisposed = 'Object has been disposed';
  function checkDisposed() {
    if (this.isDisposed) { throw new Error(objectDisposed); }
  }
