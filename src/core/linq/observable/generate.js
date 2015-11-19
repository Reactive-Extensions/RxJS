  var GenerateObservable = (function (__super__) {
    inherits(GenerateObservable, __super__);
    function GenerateObservable(state, cndFn, itrFn, resFn, s) {
      this._initialState = state;
      this._cndFn = cndFn;
      this._itrFn = itrFn;
      this._resFn = resFn;
      this._s = s;
      __super__.call(this);
    }

    function scheduleRecursive(state, recurse) {
      if (state.first) {
        state.first = false;
      } else {
        state.newState = tryCatch(state.self._itrFn)(state.newState);
        if (state.newState === errorObj) { return state.o.onError(state.newState.e); }
      }
      var hasResult = tryCatch(state.self._cndFn)(state.newState);
      if (hasResult === errorObj) { return state.o.onError(hasResult.e); }
      if (hasResult) {
        var result = tryCatch(state.self._resFn)(state.newState);
        if (result === errorObj) { return state.o.onError(result.e); }
        state.o.onNext(result);
        recurse(state);
      } else {
        state.o.onCompleted();
      }
    }

    GenerateObservable.prototype.subscribeCore = function (o) {
      var state = {
        o: o,
        self: this,
        first: true,
        newState: this._initialState
      };
      return this._s.scheduleRecursive(state, scheduleRecursive);
    };

    return GenerateObservable;
  }(ObservableBase));

  /**
   *  Generates an observable sequence by running a state-driven loop producing the sequence's elements, using the specified scheduler to send out observer messages.
   *
   * @example
   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; });
   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; }, Rx.Scheduler.timeout);
   * @param {Mixed} initialState Initial state.
   * @param {Function} condition Condition to terminate generation (upon returning false).
   * @param {Function} iterate Iteration step function.
   * @param {Function} resultSelector Selector function for results produced in the sequence.
   * @param {Scheduler} [scheduler] Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.currentThread.
   * @returns {Observable} The generated sequence.
   */
  Observable.generate = function (initialState, condition, iterate, resultSelector, scheduler) {
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new GenerateObservable(initialState, condition, iterate, resultSelector, scheduler);
  };
