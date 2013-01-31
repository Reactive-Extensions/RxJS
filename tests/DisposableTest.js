/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root = window.Rx;

    QUnit.module('DisposableTests');

    var Disposable = root.Disposable,
        CompositeDisposable = root.CompositeDisposable,
        SerialDisposable = root.SerialDisposable,
        RefCountDisposable = root.RefCountDisposable,
        SingleAssignmentDisposable = root.SingleAssignmentDisposable;

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
        ok(disposed === false);
        d.dispose();
        ok(disposed);
    });

    test('EmptyDisposable', function () {
        var d = Disposable.empty;
        ok(d !== null);
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

    test('FutureDisposable_SetNull', function () {
        var d = new SingleAssignmentDisposable();
        d.disposable(null);
        equal(null, d.disposable());
    });

    test('FutureDisposable_DisposeAfterSet', function () {
        var disposed = false
            d = new SingleAssignmentDisposable()
            dd = Disposable.create(function () { disposed = true; });
        d.disposable(dd);
        equal(dd, d.disposable());
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
        d.disposable(dd);
        ok(d.disposable() === null);
        ok(disposed);
        d.dispose();
        ok(disposed);
    });

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
        var d1, d2, disp1, disp2, g;
        disp1 = false;
        disp2 = false;
        d1 = Disposable.create(function () {
            disp1 = true;
        });
        d2 = Disposable.create(function () {
            disp2 = true;
        });
        g = new CompositeDisposable(d1);
        equal(1, g.length);
        g.dispose();
        ok(disp1);
        equal(0, g.length);
        g.add(d2);
        ok(disp2);
        return equal(0, g.length);
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
        return ok(!disp3);
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

    test('MutableDisposable_Ctor_Prop', function () {
        var m = new SerialDisposable();
        ok(m.disposable() === null);
    });

    test('MutableDisposable_ReplaceBeforeDispose', function () {
        var disp1 = false;
        var disp2 = false;
        var m = new SerialDisposable();
        var d1 = Disposable.create(function () {
            disp1 = true;
        });
        m.disposable(d1);

        equal(d1, m.disposable());
        ok(!disp1);

        var d2 = Disposable.create(function () {
            disp2 = true;
        });
        m.disposable(d2);

        equal(d2, m.disposable());
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
        m.disposable(d1);

        equal(null, m.disposable());
        ok(disp1);

        var d2 = Disposable.create(function () {
            disp2 = true;
        });
        m.disposable(d2);

        equal(null, m.disposable());
        ok(disp2);
    });

    test('MutableDisposable_Dispose', function () {
        var disp = false;
        var m = new SerialDisposable();
        var d = Disposable.create(function () {
            disp = true;
        });
        m.disposable(d);

        equal(d, m.disposable());
        ok(!disp);
        m.dispose();
        ok(disp);
        equal(null, m.disposable());
    });

    test('RefCountDisposable_SingleReference', function () {
        var d = new BooleanDisposable();
        var r = new RefCountDisposable(d);

        ok(!d.isDisposed);
        r.dispose();
        ok(d.isDisposed);
        r.dispose();
        ok(d.isDisposed);
    });

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
        d3 = r.getDisposable();
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

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));