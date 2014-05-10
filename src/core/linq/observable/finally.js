  /**
   *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
   *  
   * @example
   *  var res = observable.finallyAction(function () { console.log('sequence ended'; });
   * @param {Function} finallyAction Action to invoke after the source observable sequence terminates.
   * @returns {Observable} Source sequence with the action-invoking termination behavior applied. 
   */  
  observableProto['finally'] = observableProto.finallyAction = function (action) {
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
