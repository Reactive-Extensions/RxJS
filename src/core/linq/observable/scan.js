  /**
   *  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
   *  For aggregation behavior with no intermediate results, see Observable.aggregate.
   * @example
   *  var res = source.scan(function (acc, x) { return acc + x; });
   *  var res = source.scan(function (acc, x) { return acc + x; }, 0);
   * @param {Function} accumulator An accumulator function to be invoked on each element.
   * @param {Mixed} [seed] The initial accumulator value.
   * @returns {Observable} An observable sequence containing the accumulated values.
   */
  observableProto.scan = function (accumulator) {
    var hasSeed = false, seed, source = this, accumulator = arguments[0];
    if (arguments.length === 2) {
      hasSeed = true;
      seed = arguments[1];
    }
    return new AnonymousObservable(function (o) {
      var hasAccumulation, accumulation, hasValue;
      return source.subscribe (
        function (x) {
          !hasValue && (hasValue = true);
          if (hasAccumulation) {
            accumulation = tryCatch(accumulator)(accumulation, x);
          } else {
            accumulation = hasSeed ? tryCatch(accumulator)(seed, x) : x;
            hasAccumulation = true;
          }
          if (accumulation === errorObj) { return o.onError(accumulation.e); }
          o.onNext(accumulation);
        },
        function (e) { o.onError(e); },
        function () {
          !hasValue && hasSeed && o.onNext(seed);
          o.onCompleted();
        }
      );
    }, source);
  };
