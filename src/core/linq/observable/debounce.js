  /*
   * Performs a debounce waiting for the first to finish before subscribing to another observable.
   * Observables that come in between subscriptions will be dropped on the floor.
   * @returns {Observable} A debounced observable with only the results that happen when subscribed.
   */
  observableProto.debounce = function () {
    var sources = this;
    return new AnonymousObservable(function (observer) {
      var hasCurrent = false,
        isStopped = true,
        innerId = 0,
        m = new SingleAssignmentDisposable(),
        g = new CompositeDisposable();

      g.add(m);

      m.setDisposable(sources.subscribe(
        function (innerSource) {

          var currentId = innerId++,
            innerSubscription = new SingleAssignmentDisposable();
          g.add(innerSubscription);

          // Check if Promise or Observable
          if (isPromise(innerSource)) {
              innerSource = observableFromPromise(innerSource);
          }          

          innerSubscription.setDisposable(innerSource.subscribe(
            function (x) {
              if (!hasCurrent) {
                hasCurrent = true;
                observer.onNext(x);
              }
            },
            observer.onError.bind(observer),
            function () {
              g.remove(innerSubscription);
              if (hasCurrent && innerId === currentId) {
                hasCurrent = false;
              }

              if (!hasCurrent && isStopped && g.length === 1) {
                observer.onCompleted();
              }
            }))

        }, 
        observer.onError.bind(observer),
        function () {
          isStopped = true;
          if (g.length === 1 && !hasCurrent) {
            observer.onCompleted();
          }
        }));
      return g;
    });
  };