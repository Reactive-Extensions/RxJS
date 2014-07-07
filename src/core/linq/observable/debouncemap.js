  /*
   * Performs a debounce waiting for the first to finish before subscribing to another observable.
   * Observables that come in between subscriptions will be dropped on the floor.
   * @param {Function} selector Selector to invoke for every item in the current subscription.
   * @param {Any} [thisArg] An optional context to invoke with the selector parameter.
   * @returns {Observable} A debounced observable with only the results that happen when subscribed.
   */
  observableProto.debounceMap = function (selector, thisArg) {
    var sources = this;
    return new AnonymousObservable(function (observer) {
      var index = 0,
        hasCurrent = false,
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

                var result;
                try {
                  result = selector.call(thisArg, x, index++, innerSource);
                } catch (e) {
                  observer.onError(e);
                  return;
                }

                observer.onNext(result);
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