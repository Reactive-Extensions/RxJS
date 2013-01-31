(function (window) {

    var root = window.Rx;

    QUnit.module('ObservableBindingExperimentalTest');

    var Observable = root.Observable;

    test('Let_CallsFunctionImmediately', function () {
        var called = false;
        Observable.empty().letBind(function (x) {
            called = true;
            return x;
        });
        ok(called);
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));