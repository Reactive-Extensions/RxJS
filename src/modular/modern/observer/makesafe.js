'use strict';

var AnonymousSafeObserver = require('./anonymoussafeobserver');

module.exports = function(observer, disposable) {
  return new AnonymousSafeObserver(
    observer._onNext,
    observer._onError,
    observer._onCompleted,
    disposable);
};
