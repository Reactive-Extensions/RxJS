QUnit.module('RefCountDisposable');

var Disposable = Rx.Disposable,
    CompositeDisposable = Rx.CompositeDisposable,
    SerialDisposable = Rx.SerialDisposable,
    RefCountDisposable = Rx.RefCountDisposable,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable;

test('RefCountDisposable_RefCounting', function () {
    var d = new BooleanDisposable();
    var r = new RefCountDisposable(d);
    ok(!d.isDisposed);

    var d1 = r.getDisposable();
    var d2 = r.getDisposable();
    ok(!d.isDisposed);
    
    d1.dispose();
    ok(!d.isDisposed);
    
    d2.dispose();
    ok(!d.isDisposed);
    
    r.dispose();
    ok(d.isDisposed);
    
    var d3 = r.getDisposable();
    d3.dispose();
});

test('RefCountDisposable_PrimaryDisposesFirst', function () {
    var d = new BooleanDisposable();
    var r = new RefCountDisposable(d);

    ok(!d.isDisposed);
    
    var d1 = r.getDisposable();
    var d2 = r.getDisposable();
    
    ok(!d.isDisposed);
    
    d1.dispose();
    ok(!d.isDisposed);
    
    r.dispose();
    ok(!d.isDisposed);
    
    d2.dispose();
    ok(d.isDisposed);
});