  /*
  * Converts an existing observable sequence to an ES6 Compatible Promise and calls the fulfillment or rejection methods.
  * @param {Function} [onFulfilled] the handler to call on fulfillment of the Promise.
  * @param {Function} [onRejected] the handler to call on the rejection of the Promise.
  * @returns {Promise} An ES6 compatible promise with the last value from the observable sequence and executing the handlers.
  */
  observableProto.then = function (onFulfilled, onRejected) {
    var promiseCtor = Rx.config.Promise;
    if (!promiseCtor) { throw new TypeError('Promise type not provided in Rx.config.Promise'); }
    var source = this;
    var p = new promiseCtor(function (resolve, reject) {
      // No cancellation can be done
      var value, hasValue = false;
      source.subscribe(function (v) {
        value = v;
        hasValue = true;
      }, reject, function () {
        hasValue && resolve(value);
      });
    });

    return p.then(onFulfilled, onRejected);
  };
