var assert = require('assert');

function defaultComparer(x, y) {
    if (!y.equals) {
        return x === y;
    }
    return x.equals(y);
}

function createMessage(actual, expected) {
    return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
}

var collectionAssert = {
    /* Assertion for collections of notification messages */
    assertEqual: function (expected, actual, comparer, message) {
        comparer || (comparer = defaultComparer);
        var isOk = true, i, len;

        if (expected.length !== actual.length) {
            assert.ok(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
            return;
        }

        for(i = 0, len = expected.length; i < len; i++) {
            isOk = comparer(expected[i], actual[i]);
            if (!isOk) {
                break;
            }
        }

        assert.ok(isOk, message || createMessage(expected, actual));
    }
};

module.exports = collectionAssert;