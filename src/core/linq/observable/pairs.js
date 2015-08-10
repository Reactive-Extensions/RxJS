  /**
   * Convert an object into an observable sequence of [key, value] pairs.
   * @param {Object} obj The object to inspect.
   * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
   * @returns {Observable} An observable sequence of [key, value] pairs from the object.
   */
  Observable.pairs = function (obj, scheduler) {
    scheduler || (scheduler = currentThreadScheduler);
    return new AnonymousObservable(function (observer) {
      var keys = Object.keys(obj), len = keys.length;
      return scheduler.scheduleRecursive(0, function (i, self) {
        if (i < len) {
          var key = keys[i];
          observer.onNext([key, obj[key]]);
          self(i + 1);
        } else {
          observer.onCompleted();
        }
      });
    });
  };
