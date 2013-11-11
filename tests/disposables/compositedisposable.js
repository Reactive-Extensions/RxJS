QUnit.module('CompositeDisposable');

var Disposable = Rx.Disposable,
    CompositeDisposable = Rx.CompositeDisposable,
    SerialDisposable = Rx.SerialDisposable,
    RefCountDisposable = Rx.RefCountDisposable,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable;

function noop() { }

test('GroupDisposable_Contains', function () {
    var d1 = Disposable.create(noop),
        d2 = Disposable.create(noop),
        g = new CompositeDisposable(d1, d2);
    equal(2, g.length);
    ok(g.contains(d1));
    ok(g.contains(d2));
});

test('GroupDisposable_Add', function () {
    var d1 = Disposable.create(noop),
        d2 = Disposable.create(noop),
        g = new CompositeDisposable(d1);

    equal(1, g.length);
    ok(g.contains(d1));
    
    g.add(d2);
    equal(2, g.length);
    ok(g.contains(d2));
});

test('GroupDisposable_AddAfterDispose', function () {
    var disp1 = false;
    var disp2 = false;

    var d1 = Disposable.create(function () {
        disp1 = true;
    });
    
    var d2 = Disposable.create(function () {
        disp2 = true;
    });
    
    var g = new CompositeDisposable(d1);
    equal(1, g.length);
    
    g.dispose();
    ok(disp1);
    equal(0, g.length);
    
    g.add(d2);
    ok(disp2);
    equal(0, g.length);
});

test('GroupDisposable_Remove', function () {
    var disp1 = false;
    var disp2 = false;

    var d1 = Disposable.create(function () {
        disp1 = true;
    });

    var d2 = Disposable.create(function () {
        disp2 = true;
    });

    var g = new CompositeDisposable(d1, d2);

    equal(2, g.length);

    ok(g.contains(d1));
    ok(g.contains(d2));

    ok(g.remove(d1));

    equal(1, g.length);

    ok(!g.contains(d1));
    ok(g.contains(d2));
    ok(disp1);
    ok(g.remove(d2));
    ok(!g.contains(d1));
    ok(!g.contains(d2));
    ok(disp2);

    var disp3 = false;
    var d3 = Disposable.create(function () {
        disp3 = true;
    });

    ok(!g.remove(d3));
    ok(!disp3);
});

test('GroupDisposable_Clear', function () {
    var disp1 = false;
    var disp2 = false;

    var d1 = Disposable.create(function () {
        disp1 = true;
    });

    var d2 = Disposable.create(function () {
        disp2 = true;
    });

    var g = new CompositeDisposable(d1, d2);
    equal(2, g.length);

    g.clear();
    ok(disp1);
    ok(disp2);
    equal(0, g.length);

    var disp3 = false;
    var d3 = Disposable.create(function () {
        disp3 = true;
    });

    g.add(d3);
    ok(!disp3);
    equal(1, g.length);
});