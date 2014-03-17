    // Aliases
    var Observable = Rx.Observable,
    	observableProto = Observable.prototype,
      observableFromPromise = Observable.fromPromise,
      observableThrow = Observable.throwException,
      AnonymousObservable = Rx.AnonymousObservable,
      AsyncSubject = Rx.AsyncSubject,
      disposableCreate = Rx.Disposable.create,
      CompositeDisposable= Rx.CompositeDisposable,
      immediateScheduler = Rx.Scheduler.immediate,
      slice = Array.prototype.slice;
