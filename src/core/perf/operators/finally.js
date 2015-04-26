  var FinallyObservable = (function (__super__) {
		inherits(FinallyObservable, __super__);
		function FinallyObservable(source, action, thisArg) {
			this.source = source;
			this.action = bindCallback(action, thisArg, 1);
      __super__.call(this);
		}
    
    FinallyObservable.prototype.subscribeCore = function (o) {
      var subscription = this.source.subscribe(o);
      return new FinallyDisposable(subscription, parent);
    };
    
    function FinallyDisposable(subscription, parent) {
      this.isDisposed = false;
      this.subscription = subscription;
      this.parent = parent;
    }
    FinallyDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        var res = tryCatch(this.subscription.dispose).call(this.subscription);
        this.parent.action();
        if (res === errorObj) { thrower(res.e); }
      }
    };
    
    return FinallyObservable;
    
	}(ObservableBase));  
	
	/**
   *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
   * @param {Function} finallyAction Action to invoke after the source observable sequence terminates.
   * @returns {Observable} Source sequence with the action-invoking termination behavior applied.
   */
  observableProto['finally'] = observableProto.ensure = observableProto.finallyAction = function (action, thisArg) {
    return new FinallyObservable(this, action, thisArg);
  };
