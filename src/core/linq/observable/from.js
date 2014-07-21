  var $iterator$ = (typeof Symbol === 'object' && Symbol.iterator) ||
    '_es6shim_iterator_';
  if (root.Set && typeof new root.Set()['@@iterator'] === 'function') {
    $iterator$ = '@@iterator';
  }

  function isIterable(o) {
    o[$iterator$] !== undefined;
  }

  function toLength(o) {
    var len = +o.length >> 0;
    return len <=0 ? 0 : len;
  }

  function isCallable(f) {
    return typeof f === 'function';
  }

  /**
   * This method creates a new Observable sequence from an array-like or iterable object.
   * @param {Any} arrayLike An array-like or iterable object to convert to an Observable sequence.
   * @param {Function} [mapFn] Map function to call on every element of the array.
   * @param {Any} [thisArg] The context to use calling the mapFn if provided.
   * @param {Scheduler} [scheduler] Optional scheduler to use for scheduling.  If not provided, defaults to Scheduler.currentThread.
   */
  Observable.from = function (iterable, mapFn, thisArg, scheduler) {
    if (iterable == null) {
      throw new Error('iterable cannot be null.')
    }
    if (mapFn && !isCallable(mapFn)) {
      throw new Error('mapFn when provided must be a function');
    }
    isScheduler || (scheduler = currentThreadScheduler);
    return new AnonymousObservable(function (observer) {
      var list = Object(iterable),
        objIsIterable = isIterable(list),
        len = objIsIterable ? 0 : toLength(list),
        it = objIsIterable ? list[$iterator$]() : null,
        i = 0;
      return scheduler.scheduleRecursive(function (self) {
        if (i < len || objIsIterable) {
          var result;
          if (objIsIterable) {
            var next = it.next();
            if (next.done) {
              observer.onCompleted();
              return;
            }

            result = next.value;
          } else {
            result = list[i];
          }

          if (mapFn && isCallable(mapFn)) {
            try {
              result = thisArg ? mapFn.call(thisArg, result, i) : mapFn(result, i);
            } catch (e) {
              observer.onError(e);
              return;
            }            
          }

          observer.onNext(result);
          i++;
          self();
        } else {
          observer.onCompleted();
        }
      });
    });
  };