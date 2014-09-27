QUnit.module('Disposable');

var Disposable = Rx.Disposable,
    CompositeDisposable = Rx.CompositeDisposable,
    SerialDisposable = Rx.SerialDisposable,
    RefCountDisposable = Rx.RefCountDisposable,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable;

var BooleanDisposable = (function () {
    function BooleanDisposable() {
        this.isDisposed = false;
    }
    BooleanDisposable.prototype.dispose = function () {
        this.isDisposed = true;
    };
    return BooleanDisposable;
})();

test('AnonymousDisposable_Create', function () {
    var disposable = Disposable.create(function () { });
    ok(disposable !== null);
});

test('AnonymousDisposable_Dispose', function () {
    var disposed = false;
    var d = Disposable.create(function () {
        disposed = true;
    });

    ok(!disposed);
    d.dispose();
    ok(disposed);
});

test('EmptyDisposable', function () {
    var d = Disposable.empty;
    ok(d);
    d.dispose();
});

test('BooleanDisposable', function () {
    var d = new BooleanDisposable();
    ok(!d.isDisposed);
    d.dispose();
    ok(d.isDisposed);
    d.dispose();
    ok(d.isDisposed);
});
