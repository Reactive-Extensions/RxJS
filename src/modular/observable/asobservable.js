'use strict';

var AnonymousObservable = require('./anonymousobservable');

function createAsObservable(source) {
  return function subscribe(o) { return source.subscribe(o); };
}

/**
 *  Hides the identity of an observable sequence.
 * @returns {Observable} An observable sequence that hides the identity of the source sequence.
 */
module.exports = function asObservable(source) {
  return new AnonymousObservable(createAsObservable(source), source);
};
