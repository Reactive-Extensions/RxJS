  /**
   *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
   * @example
   *  var res = Rx.Observable.of(1,2,3);
   * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
   */
  Observable.of = function () {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    return observableFromArray(args);
  };

  /**
   *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
   * @example
   *  var res = Rx.Observable.of(1,2,3);
   * @param {Scheduler} scheduler A scheduler to use for scheduling the arguments.
   * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
   */
  var observableOf = Observable.ofWithScheduler = function (scheduler) {
    var len = arguments.length - 1, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i + 1]; }
    return observableFromArray(args, scheduler);
  };
