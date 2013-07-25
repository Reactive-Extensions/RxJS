(function (global, _undefiend) {
    var slice = Array.prototype.slice;

    function defaultComparer(x, y) {
		if (!y.equals) {
			return x === y;
		}
		return x.equals(y);
    }

	function createMessage(actual, expected) {
			return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
	}

	function areElementsEqual(expected, actual, comparer, message) {
		var i, isOk = true;
		comparer || (comparer = defaultComparer);
		if (expected.length !== actual.length) {
			ok(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
			return;
		}
		for (i = 0; i < expected.length; i++) {
			isOk = comparer(expected[i], actual[i]);
			if (!isOk) {
				break;
			}
		}
		ok(isOk, message || createMessage(expected, actual));
	}
	
	Array.prototype.assertEmpty = function() {
		return areElementsEqual(this, [], defaultComparer);
	}

    Array.prototype.assertEqual = function () {
        var actual = slice.call(arguments);
        return areElementsEqual(this, actual, defaultComparer);
    };
})(this);