'use strict';

var test = require('tape');
var Observable = require('../observable');
var LocalPromise = require('lie');

Observable.addToObject({
  just: require('../observable/just'),
  'throw': require('../observable/throw')
});

Observable.addToPrototype({
  toPromise: require('../observable/topromise')
});

test('Observable#toPromise success', function (t) {
  var source = Observable.just(42);

  var promise = source.toPromise(LocalPromise);

  promise.then(
    function (value) {
      t.equal(42, value);
      t.end();
    },
    function () {
      t.fail();
    }
  );
});

test('Observable#toPromise Failure', function (t) {
  var error = new Error('woops');

  var source = Observable['throw'](error);

  var promise = source.toPromise(LocalPromise);

  promise.then(
    function () {
      t.fail();
    },
    function (reason) {
      t.equal(error, reason);
      t.end();
    }
  );
});
