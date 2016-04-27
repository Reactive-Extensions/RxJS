'use strict';

var AnonymousSafeObserver = require('./anonymousobserver');
var ObserverBase = require('./observerbase');
var inherits = require('inherits');

function AnonymousObserver(next, error, complete) {
  this._next = next;
  this._error = error;
  this._complete = complete;
  ObserverBase.call(this);
}

inherits(AnonymousObserver, ObserverBase);

AnonymousObserver.prototype.makeSafe = function (d) {
  return new AnonymousSafeObserver(this._next.bind(this), this._error.bind(this), this._complete.bind(this), d);
};

module.exports = AnonymousObserver;