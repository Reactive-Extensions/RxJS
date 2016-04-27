'use strict';

var AnonymousObserver = require('../anonymousobserver');

function SafeObserver(o, disposable) {
  this._o = o;
  this._disposable = disposable;
}

SafeObserver.create = function (o, disposable) {
  if (o instanceof AnonymousObserver) {
    return o.makeSafe(disposable);
  }
  return new SafeObserver(o, disposable);
};

SafeObserver.prototype.next = function (x) {
  var noError = false;
  try {
    this._o.next(x);
    noError = true;
  } finally {
    !noError && this._disposable.dispose();
  }
};

SafeObserver.prototype.error = function (e) {
  try {
    this._o.error(e);
  } finally {
    this._disposable.dispose();
  }
};

SafeObserver.prototype.complete = function () {
  try {
    this._o.complete();
  } finally {
    this._disposable.dispose();
  }
};

module.exports = SafeObserver;