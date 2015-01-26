  function observableOf (scheduler, array) {
    return new FromArrayObservable(array, scheduler);
  }

  /**
  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
  */
  Observable.of = function () {
    var args = [];
    for(var i = 0, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
    return new FromArrayObservable(args);
  };

  /**
  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
  * @param {Scheduler} scheduler A scheduler to use for scheduling the arguments.
  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
  */
  Observable.ofWithScheduler = function (scheduler) {
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
    return new FromArrayObservable(args, scheduler);
  };
