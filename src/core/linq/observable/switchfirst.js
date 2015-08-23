  /**
   * Performs a exclusive waiting for the first to finish before subscribing to another observable.
   * Observables that come in between subscriptions will be dropped on the floor.
   * @returns {Observable} A exclusive observable with only the results that happen when subscribed.
   */
  observableProto.switchFirst = function () {
    var sources = this;
    return new AnonymousObservable(function (o) {
      var hasCurrent = false,
        isStopped = false,
        m = new SingleAssignmentDisposable(),
        g = new CompositeDisposable();

      g.add(m);

      m.setDisposable(sources.subscribe(
        function (innerSource) {
          if (!hasCurrent) {
            hasCurrent = true;

            isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));

            var innerSubscription = new SingleAssignmentDisposable();
            g.add(innerSubscription);

            innerSubscription.setDisposable(innerSource.subscribe(
              function (x) { o.onNext(x); },
              function (e) { o.onError(e); },
              function () {
                g.remove(innerSubscription);
                hasCurrent = false;
                isStopped && g.length === 1 && o.onCompleted();
            }));
          }
        },
        function (e) { o.onError(e); },
        function () {
          isStopped = true;
          !hasCurrent && g.length === 1 && o.onCompleted();
        }));

      return g;
    }, this);
  };
