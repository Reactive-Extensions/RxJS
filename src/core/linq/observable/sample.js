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

      return new CompositeDisposable(
        source.subscribe(function (newValue) {
          hasValue = true;
          value = newValue;
        }, observer.onError.bind(observer), function () {
          atEnd = true;
        }),
        sampler.subscribe(sampleSubscribe, observer.onError.bind(observer), sampleSubscribe)
      );
    }, source);
  }

  function computeTimeRemaining(s, i) {
    var now = s.now();
    return (i > 0) ? i - (now % i) : 0;
  }

  function sampleObservableInterval(source, interval, scheduler) {
    return new AnonymousObservable(function(observer){

      var currentItemDisposable = new SerialDisposable(),
          sad = new SingleAssignmentDisposable(),
          observerCompleted = bindCallback(observer.onCompleted, observer),
          completion = new CompositeDisposable(sad, disposableCreate(observerCompleted)),
          atEnd;

      function sampleSubscribe(n) {

        var timeRemaining = computeTimeRemaining(scheduler, interval);

        //Wait around for the next interval
        if (timeRemaining == interval) {
          currentItemDisposable = new SerialDisposable();
        }

        currentItemDisposable.setDisposable(scheduler.scheduleRelativeWithState(n, timeRemaining, function(s, state) {
          observer.onNext(state);
          atEnd && completion.dispose();
        }));
      }

      function sampleComplete() {
        var timeRemaining = computeTimeRemaining(scheduler, interval);
        sad.setDisposable(scheduler.scheduleRelative(timeRemaining, observerCompleted));
        atEnd = true;
      }

      return new CompositeDisposable(currentItemDisposable, sad,
          source.subscribe(sampleSubscribe, bindCallback(observer.onError, observer), sampleComplete));

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
      //sampleObservable(this, observableinterval(intervalOrSampler, scheduler)) :
      sampleObservableInterval(this, intervalOrSampler, scheduler) :
      sampleObservable(this, intervalOrSampler);
  };
