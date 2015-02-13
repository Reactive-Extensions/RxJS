QUnit.module('ImmediateSchedulerTest');

var scheduler = Rx.Scheduler.immediate,
    disposableEmpty = Rx.Disposable.empty;

test('Immediate_Now', function () {
  var res = scheduler.now() - new Date().getTime();
  ok(res < 1000);
});

test('Immediate_ScheduleAction', function () {
  var ran = false;
  scheduler.schedule(function () { ran = true; });
  ok(ran);
});

test('Immediate_ScheduleActionError', function () {
  var ex = new Error();
  try {
    return scheduler.schedule(function () { throw ex; });
  } catch (e) {
    equal(e, ex);
  }
});

test('Immediate_Simple1', function () {
  var xx = 0;
  scheduler.scheduleWithState(42, function (self, x) { xx = x; return disposableEmpty; });
  equal(42, xx);
});

test('Immediate_Recursive1', function () {
  var xx = 0;
  var yy = 0;
  scheduler.scheduleWithState(42, function (self, x) {
    xx = x;
    return self.scheduleWithState(43, function (self2, y) {
      yy = y;
      return disposableEmpty;
    });
  });
  equal(42, xx);
  equal(43, yy);
});
