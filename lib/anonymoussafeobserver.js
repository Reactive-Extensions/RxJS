'use strict';

function AnonymousSafeObserver(next, error, complete, disposable) {
  this._next = next;
  this._error = error;
  this._complete = complete;
  this._disposable = disposable;
  this._stopped = false;
}

AnonymousSafeObserver.prototype.next = function (x) {
  if (this._stopped) { return; }
  var noError = false;
  try {
    this._next(x);
    noError = true;
  } finally {
    !noError && this._disposable.dispose();
  }
};

AnonymousSafeObserver.prototype.error = function (e) {
  if (!this._stopped) {
    try {
      this._error(e);
    } finally {
      this._disposable.dispose();
    }
  }
};

AnonymousSafeObserver.prototype.complete = function () {
  if (!this._stopped) {
    try {
      this._complete();
    } finally {
      this._disposable.dispose();
    }
  }  
};

module.exports = AnonymousSafeObserver;