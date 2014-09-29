  /**
   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
   * @param {Array | Arguments} args Arguments or an array to use as the next sequence if an error occurs.
   * @returns {Observable} An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.
   */
  var observableCatch = Observable.catchException = Observable.catchError = Observable['catch'] = function () {
    return enumerableOf(argsOrArray(arguments, 0)).catchException();
  };
