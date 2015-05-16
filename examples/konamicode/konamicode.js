$(function () {
    var codes = [
        38, // up
        38, // up
        40, // down
        40, // down
        37, // left
        39, // right
        37, // left
        39, // right
        66, // b
        65  // a
    ];
    var konami = Rx.Observable.fromArray(codes);
    var result = $('#result');

    $(document).keyupAsObservable()
        .map(function (e) { return e.keyCode; }) // get the key code
        .windowWithCount(10, 1)                     // get the last 10 keys
        .selectMany(function (x) {                  // compare to known konami code sequence
            return x.sequenceEqual(konami);
        })
        .filter(function (equal) { return equal; })  // where we match
        .subscribe(function () {
            result.html('KONAMI!').show().fadeOut(2000);   // print the result
        });
});
