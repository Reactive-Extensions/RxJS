QUnit.module('SerialDisposable');

var Disposable = Rx.Disposable,
    CompositeDisposable = Rx.CompositeDisposable,
    SerialDisposable = Rx.SerialDisposable,
    RefCountDisposable = Rx.RefCountDisposable,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable;

test('MutableDisposable_Ctor_Prop', function () {
    var m = new SerialDisposable();
    ok(!m.getDisposable());
});

test('MutableDisposable_ReplaceBeforeDispose', function () {
    var disp1 = false;
    var disp2 = false;

    var m = new SerialDisposable();
    var d1 = Disposable.create(function () {
        disp1 = true;
    });
    
    m.setDisposable(d1);

    equal(d1, m.getDisposable());
    ok(!disp1);

    var d2 = Disposable.create(function () {
        disp2 = true;
    });
    m.setDisposable(d2);

    equal(d2, m.getDisposable());
    ok(disp1);
    ok(!disp2);
});

test('MutableDisposable_ReplaceAfterDispose', function () {
    var disp1 = false;
    var disp2 = false;
    var m = new SerialDisposable();
    m.dispose();

    var d1 = Disposable.create(function () {
        disp1 = true;
    });
    m.setDisposable(d1);

    equal(null, m.getDisposable());
    ok(disp1);

    var d2 = Disposable.create(function () {
        disp2 = true;
    });
    m.setDisposable(d2);

    equal(null, m.getDisposable());
    ok(disp2);
});

test('MutableDisposable_Dispose', function () {
    var disp = false;
    var m = new SerialDisposable();
    var d = Disposable.create(function () {
        disp = true;
    });
    m.setDisposable(d);

    equal(d, m.getDisposable());
    ok(!disp);
    m.dispose();
    ok(disp);
    equal(null, m.getDisposable());
});