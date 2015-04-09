  var BooleanDisposable = (function () {
    var trueInstance = (function () {
      var d = new BooleanDisposable();
      d.isDisposed = true;
      return d;
    }());

    function BooleanDisposable (isSingle) {
      this.isDisposed = false;
      this.current = null;
      this.isSingle = isSingle;
    }

    var booleanDisposablePrototype = BooleanDisposable.prototype;

    /**
     * Gets the underlying disposable.
     * @return The underlying disposable.
     */
    booleanDisposablePrototype.getDisposable = function () {
      return this.current === trueInstance ? disposableEmpty : this.current;
    };

    /**
     * Sets the underlying disposable.
     * @param {Disposable} value The new underlying disposable.
     */
    booleanDisposablePrototype.setDisposable = function (value) {
      var shouldDispose = this.current === trueInstance;
      if (!shouldDispose) {
        var old = this.current;
        this.current = value;
      }
      old && old.dispose();
      shouldDispose && value && value.dispose();
    };

    /**
     * Disposes the underlying disposable as well as all future replacements.
     */
    booleanDisposablePrototype.dispose = function () {
      if (!this.isDisposed) {
        var old = this.current;
        this.current = trueInstance;
        this.isDisposed = trueInstance.isDisposed;
      }
      old && old.dispose();
    };

    return BooleanDisposable;
  }());
  var SingleAssignmentDisposable = Rx.SingleAssignmentDisposable = function () {
    return new BooleanDisposable(true);
  };
  var SerialDisposable = Rx.SerialDisposable = function () {
    return new BooleanDisposable();
  };
