(function(window) {

    var root = window.Rx;

    QUnit.module('ObservableAsyncTest');

    var Observable = root.Observable,
        TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe;

    test('ToAsync_Context', function () {
        var context = { value: 42 };

        var scheduler = new TestScheduler();

        var res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (x) {
                return this.value + x;
            }, scheduler, context)(42);
        });
        
        res.messages.assertEqual(
            onNext(200, 84), 
            onCompleted(200)
        );
    });

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

    var fs = {
        exists: function (file, cb) {
            cb(true, file, this);
        },
        rename: function (oldFile, newFile, error, cb) {
            if (error) {
                cb(error);
                return;
            }

            cb(null, this);
        }
    }

    function arrayEquals(arr1, arr2) {
        var comparer = Rx.Internals.equals,
            isOk = true;
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (var i = 0, len = arr1.length; i < len; i++) {
            if (!comparer(arr1[i], arr2[i])) {
                isOk = false;
                break;
            }
        }
        return isOk;
    }

    test('FromCallback', function () {
        var scheduler = new TestScheduler();

        var res = scheduler.startWithCreate(function () {
            return Observable.fromCallback(fs.exists, scheduler)('file.txt');
        });

        res.messages.assertEqual(
            onNext(200, function (arr) { return arrayEquals(arr, [true, 'file.txt', undefined]); }),
            onCompleted(200)
        );
    });

    test('FromCallback_Selector', function () {
        var scheduler = new TestScheduler();

        var res = scheduler.startWithCreate(function () {
            return Observable.fromCallback(fs.exists, scheduler, null, function (arr) {
                return arr[0];
            })('file.txt');
        });

        res.messages.assertEqual(
            onNext(200, true),
            onCompleted(200)
        );
    });

    test('FromCallback_Context', function () {
        var scheduler = new TestScheduler();

        var res = scheduler.startWithCreate(function () {
            return Observable.fromCallback(fs.exists, scheduler, 42)('file.txt');
        });

        res.messages.assertEqual(
            onNext(200, function (arr) { return arrayEquals(arr, [true, 'file.txt', 42]); }),
            onCompleted(200)
        );
    });

    test('FromNodeCallback', function () {
        var scheduler = new TestScheduler();

        var res = scheduler.startWithCreate(function () {
            return Observable.fromNodeCallback(fs.rename, scheduler)('file1.txt', 'file2.txt', null);
        });

        res.messages.assertEqual(
            onNext(200, function (arr) { return arrayEquals(arr, [window]); }),
            onCompleted(200)
        );
    });

    test('FromNodeCallback_Selector', function () {
        var scheduler = new TestScheduler();

        var res = scheduler.startWithCreate(function () {
            return Observable.fromNodeCallback(fs.rename, scheduler, null, function (arr) {
                return arr[0];
            })('file1.txt', 'file2.txt', null);
        });

        res.messages.assertEqual(
            onNext(200, window),
            onCompleted(200)
        );
    });


    test('FromNodeCallback_Context', function () {
        var scheduler = new TestScheduler();

        var res = scheduler.startWithCreate(function () {
            return Observable.fromNodeCallback(fs.rename, scheduler, 42)('file1.txt', 'file2.txt', null);
        });

        res.messages.assertEqual(
            onNext(200, function (arr) { return arrayEquals(arr, [42]); }),
            onCompleted(200)
        );
    });

    test('FromNodeCallback_Error', function () {
        var error = new Error();
        var scheduler = new TestScheduler();

        var res = scheduler.startWithCreate(function () {
            return Observable.fromNodeCallback(fs.rename, scheduler)('file1.txt', 'file2.txt', error);
        });

        res.messages.assertEqual(
            onError(200, error)
        );
    });
    
}(typeof global == 'object' && global || this));