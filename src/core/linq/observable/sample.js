  function sampleObservable(source, sampler) {
    return new AnonymousObservable(function (observer) {
      var atEnd, value, hasValue;

      function sampleSubscribe() {
        if (hasValue) {
          hasValue = false;
          observer.onNext(value);
        }
        atEnd && observer.onCompleted();
      }

      function sampleComplete() {
        sampleSubscribe();
        atEnd = true;
      }

      return new CompositeDisposable(
        source.subscribe(function (newValue) {
          hasValue = true;
          value = newValue;
        }, observer.onError.bind(observer), function () {
          atEnd && observer.onCompleted();
          atEnd = true;
        }),
        sampler.subscribe(sampleSubscribe, observer.onError.bind(observer), sampleComplete)
      );
    }, source);
  }

  function computeTimeRemaining(s, i) {
    var now = s.now();
    return (i == 0) ? 0 : i - (now % i);
  }

  function sampleObservableInterval(source, interval, scheduler) {
    return new AnonymousObservable(function(observer){

      var sad = new SingleAssignmentDisposable(),
          observerCompleted = bindCallback(observer.onCompleted, observer, 0),
          value = [],
          disposables = [];

      function sampleSubscribe(n) {

        var timeRemaining = computeTimeRemaining(scheduler, interval);

        var i = Math.floor(timeRemaining / interval);

        value[i] = n;

        if (!disposables[i]) {
          disposables[i] = scheduler.scheduleRelative(timeRemaining, function() {
            value.length > 0 && observer.onNext(value.shift());
            disposables[i] = null;
          });
        }
      }

      function sampleComplete() {
        var timeRemaining = computeTimeRemaining(scheduler, interval);
        sad.setDisposable(scheduler.scheduleRelative(timeRemaining, observerCompleted));
      }

      return new CompositeDisposable(sad,
          Disposable.create(function() {
            while (disposables.length > 0) {
              var d = disposables.shift();
              d && d.dispose();
            }
          }),
          source.subscribe(sampleSubscribe, bindCallback(observer.onError, observer, 1), sampleComplete));

    }, source);
  }

  /**
   *  Samples the observable sequence at each interval.
   *
   * @example
   *  1 - res = source.sample(sampleObservable); // Sampler tick sequence
   *  2 - res = source.sample(5000); // 5 seconds
   *  2 - res = source.sample(5000, Rx.Scheduler.timeout); // 5 seconds
   *
   * @param {Mixed} intervalOrSampler Interval at which to sample (specified as an integer denoting milliseconds) or Sampler Observable.
   * @param {Scheduler} [scheduler]  Scheduler to run the sampling timer on. If not specified, the timeout scheduler is used.
   * @returns {Observable} Sampled observable sequence.
   */
  observableProto.sample = observableProto.throttleLatest = function (intervalOrSampler, scheduler) {
    isScheduler(scheduler) || (scheduler = timeoutScheduler);
    return typeof intervalOrSampler === 'number' ?
      sampleObservableInterval(this, intervalOrSampler, scheduler) :
      sampleObservable(this, intervalOrSampler);
  };
