  /**
   * Retrieves the value of a specified nested property from all elements in
   * the Observable sequence.
   * @param {String} nestedProps The nested property to pluck.
   * @returns {Observable} Returns a new Observable sequence of property values.
   */
  observableProto.pluck = function () {
    var args = [].slice.call(arguments);
    var len = args.length;
    return this.map(function (x) {
      if (len === 0) {
        return undefined;
      }

      var currentProp = x;
      for (var i = 0; i < len; i++) {
        var p = currentProp[args[i]];
        if (typeof p !== 'undefined') {
          currentProp = p;
        } else {
          return undefined;
        }
      }
      return currentProp;
    });
  };
