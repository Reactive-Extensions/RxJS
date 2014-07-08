  /*
   * Performs a debounce waiting for the first to finish before subscribing to another observable.
   * Observables that come in between subscriptions will be dropped on the floor.
   * @returns {Observable} A debounced observable with only the results that happen when subscribed.
   */
  observableProto.exclusive = function () {
    var sources = this;
    return new AnonymousObservable(function (observer) {
      var hasCurrent = false,
        isStopped = true,
        m = new SingleAssignmentDisposable(),
        g = new CompositeDisposable();

      if (!hasCurrent) {
        hasCurrent = true;

        m.setDisposable(sources.subscribe(
          function (innerSource) {

            // Check if Promise or Observable
            isPromise(innerSource) && (innerSource = observableFromPromise(innerSource))

            var innerSubscription = new SingleAssignmentDisposable();

          },
          observer.onError.bind(observer),
          function () {
            hasCurrent = false;
          }));        
      }

      return m;
    });
  };