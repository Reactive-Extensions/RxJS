QUnit.module('tryCatch');

var tryCatch = Rx.internals.tryCatch;

test('tryCatch_multiple', function () {
  var catcher1 = tryCatch(function() { return 1; });
  var catcher2 = tryCatch(function() { return 2; });

  ok(catcher1() === 1, "Shouldn't store state in global context");
  ok(catcher2() === 2, "Shouldn't store state in global context");
});
