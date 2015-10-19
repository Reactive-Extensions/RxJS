'use strict';

function EmptyError () {
  this.message = 'Sequence contains no elements.';
  Error.call(this);
}
EmptyError.prototype = Object.create(Error.prototype);
EmptyError.prototype.name = 'EmptyError';

function ObjectDisposedError() {
  this.message = 'Object has been disposed';
  Error.call(this);
}
ObjectDisposedError.prototype = Object.create(Error.prototype);
ObjectDisposedError.prototype.name = 'ObjectDisposedError';

function ArgumentOutOfRangeError() {
  this.message = 'Argument out of range';
  Error.call(this);
}
ArgumentOutOfRangeError.prototype = Object.create(Error.prototype);
ArgumentOutOfRangeError.prototype.name = 'ArgumentOutOfRangeError';

function NotSupportedError(message) {
  this.message = message || 'This operation is not supported';
  Error.call(this);
}
NotSupportedError.prototype = Object.create(Error.prototype);
NotSupportedError.prototype.name = 'NotSupportedError';

function NotImplementedError(message) {
  this.message = message || 'This operation is not implemented';
  Error.call(this);
}
NotImplementedError.prototype = Object.create(Error.prototype);
NotImplementedError.prototype.name = 'NotImplementedError';

module.exports = {
  EmptyError: EmptyError,
  ObjectDisposedError: ObjectDisposedError,
  ArgumentOutOfRangeError: ArgumentOutOfRangeError,
  NotSupportedError: NotSupportedError,
  NotImplementedError: NotImplementedError
};
