'use strict';

var Subject = require('../subject');
var multicast = require('./multicast');
var isFunction = require('../helpers/isfunction');

/**
 * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.
 * This operator is a specialization of Multicast using a regular Subject.
 * @param {Function} [selector] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
 * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
 */
module.exports = function publish (source, fn) {
  return fn && isFunction(fn) ?
    multicast(source, function () { return new Subject(); }, fn) :
    multicast(source, new Subject());
};
