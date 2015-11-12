'use strict';

var ObservableBase = require('./observablebase');
var ConnectableObservable = require('./connectableobservable');
var BinaryDisposable = require('../binarydisposable');
var isFunction = require('../helpers/isfunction');
var inherits = require('util').inherits;

function MulticastObservable(source, fn1, fn2) {
  this.source = source;
  this._fn1 = fn1;
  this._fn2 = fn2;
  ObservableBase.call(this);
}

inherits(MulticastObservable, ObservableBase);

MulticastObservable.prototype.subscribeCore = function (o) {
  var connectable = this.source.multicast(this._fn1());
  return new BinaryDisposable(this._fn2(connectable).subscribe(o), connectable.connect());
};

/**
 * Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
 * subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
 * invocation. For specializations with fixed subject types, see Publish, PublishLast, and Replay.
 * @param {Function|Subject} subjectOrSubjectSelector
 * Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
 * Or:
 * Subject to push source elements into.
 *
 * @param {Function} [selector] Optional selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if <paramref name="subjectOrSubjectSelector" is a factory function.
 * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
 */
module.exports = function multicast (source, subjectOrSubjectSelector, selector) {
  return isFunction(subjectOrSubjectSelector) ?
    new MulticastObservable(source, subjectOrSubjectSelector, selector) :
    new ConnectableObservable(source, subjectOrSubjectSelector);
};
