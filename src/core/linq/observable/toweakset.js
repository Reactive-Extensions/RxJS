  if (!!root.WeakSet) {
    /**
     * Converts the observable sequence to a WeakSet if it exists.
     * @returns {Observable} An observable sequence with a single value of a WeakSet containing the values from the observable sequence.
     */
    observableProto.toWeakSet = function () {
      return toSet(this, root.WeakSet);
    };
  }
