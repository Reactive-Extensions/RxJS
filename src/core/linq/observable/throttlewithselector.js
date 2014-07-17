  /**
   *  Ignores values from an observable sequence which are followed by another value within a computed throttle duration.
   *  
   * @example
   *  1 - res = source.delayWithSelector(function (x) { return Rx.Scheduler.timer(x + x); }); 
   * 
   * @param {Function} throttleDurationSelector Selector function to retrieve a sequence indicating the throttle duration for each given element.
   * @returns {Observable} The throttled sequence.
   */
  observableProto.throttleWithSelector = function (throttleDurationSelector) {
    var source = this;
    return new AnonymousObservable(function (observer) {
      var value, hasValue = false, cancelable = new SerialDisposable(), id = 0, subscription = source.subscribe(function (x) {
        var throttle;
        try {
          throttle = throttleDurationSelector(x);
        } catch (e) {
          observer.onError(e);
          return;
        }
        hasValue = true;
        value = x;
        id++;
        var currentid = id, d = new SingleAssignmentDisposable();
        cancelable.setDisposable(d);
        d.setDisposable(throttle.subscribe(function () {
          if (hasValue && id === currentid) {
            observer.onNext(value);
          }
          hasValue = false;
          d.dispose();
        }, observer.onError.bind(observer), function () {
          if (hasValue && id === currentid) {
            observer.onNext(value);
          }
          hasValue = false;
          d.dispose();
        }));
      }, function (e) {
        cancelable.dispose();
        observer.onError(e);
        hasValue = false;
        id++;
      }, function () {
        cancelable.dispose();
        if (hasValue) {
            observer.onNext(value);
        }
        observer.onCompleted();
        hasValue = false;
        id++;
      });
      return new CompositeDisposable(subscription, cancelable);
    });
  };
