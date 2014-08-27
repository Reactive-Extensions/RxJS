  if (!!root.WeakMap) {
    /**
    * Converts the observable sequence to a WeakMap if it exists.
    * @param {Function} keySelector A function which produces the key for the WeakMap
    * @param {Function} [elementSelector] An optional function which produces the element for the WeakMap. If not present, defaults to the value from the observable sequence.
    * @returns {Observable} An observable sequence with a single value of a WeakMap containing the values from the observable sequence.
    */
    observableProto.toWeakMap = function (keySelector, elementSelector) {
      return toMap(this, root.WeakMap, keySelector, elementSelector);
    };
  }
