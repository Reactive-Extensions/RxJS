  /**
   * Creates an observable sequence from an incoming generator.
   * @example
   * function foo* (value) { yield value; }
   * var source = Observable.fromGenerator(foo)(42);
   * @param {Function} generatorFunction A function which is a generator.
   * @param {Scheduler} [scheduler] Optional scheduler for scheduling recursive calls. Defaults to current thread if not specified
   * @returns {Function} A function, when applied, returns an observable sequence based upon the generator.
   */
  var observableFromGenerator = Observable.fromGenerator = function (generatorFunction, scheduler) {
    scheduler || (scheduler = currentThreadScheduler);
    return function () {
      var args = arguments, self = this;
      return new AnonymousObservable(function (observer) {
        var generator = generatorFunction.apply(self, args);

        return scheduler.scheduleRecursive(function (self) {
          var nextItem;
          try {
            nextItem = generator.next();
          } catch (e) {
            if (({}).toString.call(e) === "[object StopIteration]") { // FF non compliance
              observer.onCompleted();
              return;
            }
            observer.onError(e);
            return;
          }

          if (next.done) {
            observer.onCompleted();
          } else {
            observer.onNext(next.value);
            self();
          }
        });
      });
    };
  };
