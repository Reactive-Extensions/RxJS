(function(window) {

    var root = window.Rx;

    QUnit.module('ObservableAsyncTest');

    var Observable = root.Observable,
        TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe;

    test('ToAsync0', function () {
        var scheduler = new TestScheduler();

        var res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function () {
                return 0;
            }, scheduler)();
        });
        
        res.messages.assertEqual(
            onNext(200, 0), 
            onCompleted(200)
        );
    });

    test('ToAsync1', function () {
        var scheduler = new TestScheduler();

        var res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (x) {
                return x;
            }, scheduler)(1);
        });

        res.messages.assertEqual(
            onNext(200, 1), 
            onCompleted(200)
        );
    });

    test('ToAsync2', function () {
        var scheduler = new TestScheduler();

        var res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (x, y) {
                return x + y;
            }, scheduler)(1, 2);
        });

        res.messages.assertEqual(
            onNext(200, 3), 
            onCompleted(200)
        );
    });

    test('ToAsync3', function () {
        var scheduler = new TestScheduler();
        
        var res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (x, y, z) {
                return x + y + z;
            }, scheduler)(1, 2, 3);
        });
        
        res.messages.assertEqual(
            onNext(200, 6), 
            onCompleted(200)
        );
    });

    test('ToAsync4', function () {
        var scheduler = new TestScheduler();
        
        var res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (a, b, c, d) {
                return a + b + c + d;
            }, scheduler)(1, 2, 3, 4);
        });

        res.messages.assertEqual(
            onNext(200, 10), 
            onCompleted(200)
        );
    });

    test('ToAsync_Error0', function () {
        var ex = new Error();

        var scheduler = new TestScheduler();

        var res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function () {
                throw ex;
            }, scheduler)();
        });
        
        res.messages.assertEqual(
            onError(200, ex)
        );
    });

    test('ToAsync_Error1', function () {
        var ex = new Error();

        var scheduler = new TestScheduler();
        
        var res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (a) {
                throw ex;
            }, scheduler)(1);
        });
        
        res.messages.assertEqual(
            onError(200, ex)
        );
    });

    test('ToAsync_Error2', function () {
        var ex, res, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (a, b) {
                throw ex;
            }, scheduler)(1, 2);
        });
        res.messages.assertEqual(onError(200, ex));
    });

    test('ToAsync_Error3', function () {
        var ex, res, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (a, b, c) {
                throw ex;
            }, scheduler)(1, 2, 3);
        });
        res.messages.assertEqual(onError(200, ex));
    });

    test('ToAsync_Error4', function () {
        var ex = new Error();
        
        var scheduler = new TestScheduler();
        
        var res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (a, b, c, d) {
                throw ex;
            }, scheduler)(1, 2, 3, 4);
        });

        res.messages.assertEqual(
            onError(200, ex)
        );
    });

    test('Start_Action2', function () {
        var scheduler = new TestScheduler();
        
        var done = false;
        
        var res = scheduler.startWithCreate(function () {
            return Observable.start(function () {
                done = true;
            }, scheduler);
        });
        
        res.messages.assertEqual(
            onNext(200, undefined), 
            onCompleted(200)
        );

        ok(done);
    });

    test('Start_Func2', function () { 
        var scheduler = new TestScheduler();

        var res = scheduler.startWithCreate(function () {
            return Observable.start(function () {
                return 1;
            }, scheduler);
        });

        res.messages.assertEqual(
            onNext(200, 1), 
            onCompleted(200)
        );
    });

    test('Start_FuncError', function () {
        var ex = new Error();

        var scheduler = new TestScheduler();
        
        var res = scheduler.startWithCreate(function () {
            return Observable.start(function () {
                throw ex;
            }, scheduler);
        });
        
        res.messages.assertEqual(
            onError(200, ex)
        );
    });

    test('Start_FuncContext', function () {
        var context = { value: 42 };

        var scheduler = new TestScheduler();
        
        var res = scheduler.startWithCreate(function () {
            return Observable.start(function () {
                return this.value;
            }, scheduler, context);
        });
        
        res.messages.assertEqual(
            onNext(200, 42),
            onCompleted(200)
        );
    });    

    
}(typeof global == 'object' && global || this));