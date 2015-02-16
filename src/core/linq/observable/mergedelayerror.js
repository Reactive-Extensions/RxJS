  function CompositeError(errors) {
    this.name = "NotImplementedError";
    this.innerErrors = errors;
    this.message = 'This contains multiple errors. Check the innerErrors';
  }
  CompositeError.prototype = Error.prototype;

  /**
  * Flattens an Observable that emits Observables into one Observable, in a way that allows an Observer to
  * receive all successfully emitted items from all of the source Observables without being interrupted by
  * an error notification from one of them.
  *
  * This behaves like Observable.prototype.mergeAll except that if any of the merged Observables notify of an
  * error via the Observer's onError, mergeDelayError will refrain from propagating that
  * error notification until all of the merged Observables have finished emitting items.
  */
  observableProto.mergeDelayError = function() {
    var source = this;
    return new AnonymousObservable(function (o) {
      var group = new CompositeDisposable(),
        m = new SingleAssignmentDisposable(),
        isStopped = false,
        errors = [];

      group.add(m);

      m.setDisposable(source.subscribe(
        function (innerSource) {
          var innerSubscription = new SingleAssignmentDisposable();
          group.add(innerSubscription);

          // Check for promises support
          isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));

          innerSubscription.setDisposable(innerSource.subscribe(
            function (x) { o.onNext(x); },
            function (e) {
              errors.push(e);
              group.remove(innerSubscription);

            },
            function () {
              group.remove(innerSubscription);
              isStopped && group.length === 1 && o.onCompleted();
          }));
        },
        function (e) {
          errors.push(e);

        },
        function () {
          isStopped = true;
          group.length === 1 && errors.length === 0 && o.onCompleted();
        }));
      return group;
    }, source);
  };
