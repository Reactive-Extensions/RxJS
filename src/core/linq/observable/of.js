  /**
   *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
   * @example
   *  var res = Rx.Observable.of(1,2,3);
   * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
   */
  Observable.of = function () {
    return observableFromArray(arguments);
  };

  /**
   *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments. 
   * @example
   *  var res = Rx.Observable.of(1,2,3);
   * @param {Scheduler} scheduler A scheduler to use for scheduling the arguments.
   * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
   */
  Observable.ofWithScheduler = function (scheduler) {
    return observableFromArray(slice.call(arguments, 1), scheduler);
  };
