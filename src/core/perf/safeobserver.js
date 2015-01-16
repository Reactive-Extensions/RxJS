  function SafeObserver(observer, disposable) {
    this._observer = observer;
    this._disposable = disposable;
  }

  SafeObserver.create = function (observer, disposable) {
    if (typeof observer.makeSafe === 'function') {
      return observer.makeSafe(disposable);
    }
    return new SafeObserver(observer, disposable);
  };

  SafeObserver.prototype.onNext = function(x) {
    var noError = false;
    try {
      this._observer.onNext(x);
      noError = true;
    } catch (e) {
      throw e;
    } finally {
      !noError && this._disposable.dispose();
    }
  };

  SafeObserver.prototype.onError = function(e) {
    try {
      this._observer.onError(e);
    } catch (e) {
      throw e;
    } finally {
      this._disposable.dispose();
    }
  };

  SafeObserver.prototype.onCompleted = function() {
    try {
      this._observer.onCompleted();
    } catch (e) {
      throw e;
    } finally {
      this._disposable.dispose();
    }
  };
