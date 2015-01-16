  /**
  * Subscribes to the specified source, re-routing synchronous exceptions during invocation of the Subscribe method to the observer's OnError channel.
  * @param {Observer} observer Observer that will be passed to the observable sequence, and that will be used for exception propagation.
  * @returns {Disposable} Disposable object used to unsubscribe from the observable sequence.
  */
  observableProto.subscribeSafe = function(observer) {
    if (typeof this.subscribeRaw === 'function') {
      return this.subscribeRaw(observer, false);
    }
    return this.subscribe(observer);
  };
