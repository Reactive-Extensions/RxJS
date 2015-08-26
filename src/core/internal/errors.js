  var EmptyError = Rx.EmptyError = function() {
    this.message = 'Sequence contains no elements.';
    this.name = 'EmptyError';
    Error.call(this);
  };
  EmptyError.prototype = Object.create(Error.prototype);

  var ObjectDisposedError = Rx.ObjectDisposedError = function() {
    this.message = 'Object has been disposed';
    this.name = 'ObjectDisposedError';
    Error.call(this);
  };
  ObjectDisposedError.prototype = Object.create(Error.prototype);

  var ArgumentOutOfRangeError = Rx.ArgumentOutOfRangeError = function () {
    this.message = 'Argument out of range';
    this.name = 'ArgumentOutOfRangeError';
    Error.call(this);
  };
  ArgumentOutOfRangeError.prototype = Object.create(Error.prototype);

  var NotSupportedError = Rx.NotSupportedError = function (message) {
    this.message = message || 'This operation is not supported';
    this.name = 'NotSupportedError';
    Error.call(this);
  };
  NotSupportedError.prototype = Object.create(Error.prototype);

  var NotImplementedError = Rx.NotImplementedError = function (message) {
    this.message = message || 'This operation is not implemented';
    this.name = 'NotImplementedError';
    Error.call(this);
  };
  NotImplementedError.prototype = Object.create(Error.prototype);

  var notImplemented = Rx.helpers.notImplemented = function () {
    throw new NotImplementedError();
  };

  var notSupported = Rx.helpers.notSupported = function () {
    throw new NotSupportedError();
  };
