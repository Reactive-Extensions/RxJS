QUnit.module('FromNodeCallback');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

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

test('FromNodeCallback', function () {
    var scheduler = new TestScheduler();

    var res = scheduler.startWithCreate(function () {
        return Observable.fromNodeCallback(fs.rename, scheduler)('file1.txt', 'file2.txt', null);
    });

    res.messages.assertEqual(
        onNext(201, function (arr) { return arrayEquals(arr, [window]); }),
        onCompleted(201)
    );
});

test('FromNodeCallback_Single', function () {
    var scheduler = new TestScheduler();

    var res = scheduler.startWithCreate(function () {
        return Observable.fromNodeCallback(function (file, cb) {
            cb(null, 'foo');
        }, scheduler)('file.txt');
    });

    res.messages.assertEqual(
        onNext(201, 'foo'),
        onCompleted(201)
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
        onNext(201, window),
        onCompleted(201)
    );
});


test('FromNodeCallback_Context', function () {
    var scheduler = new TestScheduler();

    var res = scheduler.startWithCreate(function () {
        return Observable.fromNodeCallback(fs.rename, scheduler, 42)('file1.txt', 'file2.txt', null);
    });

    res.messages.assertEqual(
        onNext(201, function (arr) { return arrayEquals(arr, [42]); }),
        onCompleted(201)
    );
});

test('FromNodeCallback_Error', function () {
    var error = new Error();
    var scheduler = new TestScheduler();

    var res = scheduler.startWithCreate(function () {
        return Observable.fromNodeCallback(fs.rename, scheduler)('file1.txt', 'file2.txt', error);
    });

    res.messages.assertEqual(
        onError(201, error)
    );
});