  if (!!root.Set) {
    /**
     * Converts the observable sequence to a Set if it exists.
     * @returns {Observable} An observable sequence with a single value of a Set containing the values from the observable sequence.
     */
    observableProto.toSet = function () {
      return toSet(this, root.Set);
    };
  }
