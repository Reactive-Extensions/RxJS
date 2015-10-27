'use strict';

var AnonymousObserver = require('./anonymousobserver');
var Notification = require('../notification');
var bindCallback = require('../internal/bindcallback');

/**
 *  Creates an observer from a notification callback.
 * @param {Function} handler Action that handles a notification.
 * @returns The observer object that invokes the specified handler using a notification corresponding to each message it receives.
 */
module.exports = function (handler, thisArg) {
  var cb = bindCallback(handler, thisArg, 1);
  return new AnonymousObserver(function (x) {
    return cb(Notification.createOnNext(x));
  }, function (e) {
    return cb(Notification.createOnError(e));
  }, function () {
    return cb(Notification.createOnCompleted());
  });
};
