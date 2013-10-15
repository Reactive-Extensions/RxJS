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
    
}(typeof global == 'object' && global || this));