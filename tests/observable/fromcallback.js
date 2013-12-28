QUnit.module('FromCallback');

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

test('FromCallback', function () {
    var scheduler = new TestScheduler();

    var res = scheduler.startWithCreate(function () {
        return Observable.fromCallback(fs.exists, scheduler)('file.txt');
    });

    res.messages.assertEqual(
        onNext(201, function (arr) { return arrayEquals(arr, [true, 'file.txt', undefined]); }),
        onCompleted(201)
    );
});

test('FromCallback_Single', function () {
    var scheduler = new TestScheduler();

    var res = scheduler.startWithCreate(function () {
        return Observable.fromCallback(function (file, cb) {
            cb('foo');
        }, scheduler)('file.txt');
    });

    res.messages.assertEqual(
        onNext(201, 'foo'),
        onCompleted(201)
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
        onNext(201, true),
        onCompleted(201)
    );
});

test('FromCallback_Context', function () {
    var scheduler = new TestScheduler();

    var res = scheduler.startWithCreate(function () {
        return Observable.fromCallback(fs.exists, scheduler, 42)('file.txt');
    });

    res.messages.assertEqual(
        onNext(201, function (arr) { return arrayEquals(arr, [true, 'file.txt', 42]); }),
        onCompleted(201)
    );
});