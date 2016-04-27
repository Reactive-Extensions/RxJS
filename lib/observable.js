'use strict';

var AnonymousObserver = require('./anonymousobserver');
var noop = require('../internal/noop');
var throwError = require('../internal/throwError');

function Observable() { }

Observable.subscribe = function (oOrNext, error, complete) {
  if (typeof oOrNext === 'object') {
    return this._subscribe(oOrNext);
  }
  return this._subscribe(new AnonymousObserver(oOrNext || noop, error || throwError, complete || noop));
};

module.exports = Observable;