  /**
   *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
   *
   * @example
   *  var res = observable.finallyAction(function () { console.log('sequence ended'; });
   * @param {Function} finallyAction Action to invoke after the source observable sequence terminates.
   * @returns {Observable} Source sequence with the action-invoking termination behavior applied.
   */
  observableProto['finally'] = observableProto.ensure = function (action) {
    var source = this;
    return new AnonymousObservable(function (observer) {
      var subscription;
      try {
        subscription = source.subscribe(observer);
      } catch (e) {
        action();
        throw e;
      }
      return disposableCreate(function () {
        try {
          subscription.dispose();
        } catch (e) {
          throw e;
        } finally {
          action();
        }
      });
    });
  };

  var warnFinally = true;
  /**
   * @deprecated use #finally or #ensure instead.
   */
  observableProto.finallyAction = function (action) {
    if(warnFinally) {
      console.warn('#finallyAction deprecated, use #finally or #ensure instead');
      warnFinally = null;
    }
    return this.ensure(action);
  };
