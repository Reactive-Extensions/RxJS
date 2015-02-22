var assert = require('assert'),
    Rx = require('../../../rx.node'); // Use require('rx') outside this project

function createMessage(actual, expected) {
    return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
}

var collectionAssert = {
    /* Assertion for collections of notification messages */
    assertEqual: function (expected, actual, comparer, message) {
        comparer || (comparer = Rx.internals.isEqual);
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
