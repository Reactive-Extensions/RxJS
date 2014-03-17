  /**
   * Merges an observable sequence of observable sequences into an observable sequence.
   * @returns {Observable} The observable sequence that merges the elements of the inner sequences.   
   */  
  observableProto.mergeObservable = observableProto.mergeAll =function () {
    var sources = this;
    return new AnonymousObservable(function (observer) {
      var group = new CompositeDisposable(),
        isStopped = false,
        m = new SingleAssignmentDisposable();

      group.add(m);
      m.setDisposable(sources.subscribe(function (innerSource) {
        var innerSubscription = new SingleAssignmentDisposable();
        group.add(innerSubscription);

        // Check if Promise or Observable
        if (isPromise(innerSource)) {
            innerSource = observableFromPromise(innerSource);
        }

        innerSubscription.setDisposable(innerSource.subscribe(function (x) {
            observer.onNext(x);
        }, observer.onError.bind(observer), function () {
            group.remove(innerSubscription);
            if (isStopped && group.length === 1) { observer.onCompleted(); }
        }));
      }, observer.onError.bind(observer), function () {
        isStopped = true;
        if (group.length === 1) { observer.onCompleted(); }
      }));
      return group;
    });
  };
