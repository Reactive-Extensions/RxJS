'use strict';

var noop = require('./noop');

var NoOpObserver = {
  next: noop,
  error: noop,
  complete: noop
};

function Forwarder(fwd) {
  this._fwd = fwd;
}

Forwarder.prototype.next = function (x) {
  this._fwd._o.next(x);
};

Forwarder.prototype.error = function (e) {
  this._fwd._o.error(e);
};

Forwarder.prototype.complete = function () {
  this._fwd._o.complete();
  this._fwd.dispose();
};

function Sink(o, cancel) {
  this._o = o;
  this._cancel = cancel;
}

Sink.prototype.dispose = function () {
  this._o = NoOpObserver;
  var cancel = this._cancel;
  this._cancel = null;
  cancel && cancel.dispose();
};

Sink.prototype.getForwarder = function () {
  return new Forwarder(this);
};

module.exports = Sink;