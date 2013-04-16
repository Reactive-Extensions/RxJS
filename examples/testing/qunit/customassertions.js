(function (global) {

    var root = global.Rx;

    /* Comparer that checks for equals method before defaulting to standard strict equality */
    function defaultComparer(x, y) {
        if (!y.equals) {
            return x === y;
        }
        return x.equals(y);
    }

    /* Creates a message based upon actual/expected */
    function createMessage(actual, expected) {
        return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
    }

    root.CollectionAssert = {
        /* Assertion for collections of notification messages */
        assertEqual: function (expected, actual, comparer, message) {
            comparer || (comparer = defaultComparer);
            var isOk = true, i, len;

            if (expected.length !== actual.length) {
                ok(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
                return;
            }

            for(i = 0, len = expected.length; i < len; i++) {
                isOk = comparer(expected[i], actual[i]);
                if (!isOk) {
                    break;
                }
            }

            ok(isOk, message || createMessage(expected, actual));
        }
    };

}(window));