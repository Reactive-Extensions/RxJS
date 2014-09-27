module('FromPromise');

var TestScheduler = Rx.TestScheduler,
    Observable = Rx.Observable;

asyncTest('Promise_Success', function () {
    var promise = new RSVP.Promise(function (resolve, reject) {
        resolve(42);
    });

    var source = Observable.fromPromise(promise);

    var subscription = source.subscribe(
        function (x) {
            equal(42, x);
        },
        function (err) {
            ok(false);
        },
        function () {
            ok(true);
            start();
        });
});

asyncTest('Promise_Failure', function () {
    var error = new Error('woops');

    var promise = new RSVP.Promise(function (resolve, reject) {
        reject(error);
    });

    var source = Observable.fromPromise(promise);

    var subscription = source.subscribe(
        function (x) {
            ok(false);
        },
        function (err) {
            strictEqual(err, error);
            start();
        },
        function () {
            ok(false);
        });
});
