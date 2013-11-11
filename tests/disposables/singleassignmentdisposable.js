QUnit.module('SingleAssignmentDisposable');

var Disposable = Rx.Disposable,
    CompositeDisposable = Rx.CompositeDisposable,
    SerialDisposable = Rx.SerialDisposable,
    RefCountDisposable = Rx.RefCountDisposable,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable;

test('FutureDisposable_SetNull', function () {
    var d = new SingleAssignmentDisposable();
    d.setDisposable(null);
    equal(null, d.getDisposable());
});

test('FutureDisposable_DisposeAfterSet', function () {
    var disposed = false
        d = new SingleAssignmentDisposable()
        dd = Disposable.create(function () { disposed = true; });
    d.setDisposable(dd);
    equal(dd, d.getDisposable());
    ok(!disposed);
    d.dispose();
    ok(disposed);
    d.dispose();
    ok(disposed);
});

test('FutureDisposable_DisposeBeforeSet', function () {
    var disposed = false,
        d = new SingleAssignmentDisposable(),
        dd = Disposable.create(function () { disposed = true; });
    ok(!disposed);
    d.dispose();
    ok(!disposed);
    d.setDisposable(dd);
    ok(d.getDisposable() === null);
    ok(disposed);
    d.dispose();
    ok(disposed);
});
