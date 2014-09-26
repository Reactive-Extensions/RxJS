  /**
   * Class to create an Observer instance from delegate-based implementations of the on* methods.
   */
  var AnonymousObserver = Rx.AnonymousObserver = (function (__super__) {
    inherits(AnonymousObserver, __super__);

    /**
     * Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
     * @param {Any} onNext Observer's OnNext action implementation.
     * @param {Any} onError Observer's OnError action implementation.
     * @param {Any} onCompleted Observer's OnCompleted action implementation.  
     */      
    function AnonymousObserver(onNext, onError, onCompleted, thisArg) {
      __super__.call(this);
      this._onNext = onNext;
      this._onError = onError;
      this._onCompleted = onCompleted;
      this._thisArg = arguments.length === 4 ? thisArg : this;
    }

    /**
     * Calls the onNext action.
     * @param {Any} value Next element in the sequence.   
     */     
    AnonymousObserver.prototype.next = function (value) {
      this._onNext.call(this._thisArg, value);
    };

    /**
     * Calls the onError action.
     * @param {Any} error The error that has occurred.   
     */     
    AnonymousObserver.prototype.error = function (error) {
      this._onError.call(this._thisArg, error);
    };

    /**
     *  Calls the onCompleted action.
     */        
    AnonymousObserver.prototype.completed = function () {
      this._onCompleted.call(this._thisArg);
    };

    return AnonymousObserver;
  }(AbstractObserver));
