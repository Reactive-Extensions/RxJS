    /** Used to determine if values are of the language type Object */
    var objectTypes = {
        'boolean': false,
        'function': true,
        'object': true,
        'number': false,
        'string': false,
        'undefined': false
    };

    /** `Object#toString` result shortcuts */
    var argsClass = '[object Arguments]',
        arrayClass = '[object Array]',
        boolClass = '[object Boolean]',
        dateClass = '[object Date]',
        errorClass = '[object Error]',
        funcClass = '[object Function]',
        numberClass = '[object Number]',
        objectClass = '[object Object]',
        regexpClass = '[object RegExp]',
        stringClass = '[object String]';

    var toString = Object.prototype.toString,
        hasOwnProperty = Object.prototype.hasOwnProperty,  
        supportsArgsClass = toString.call(arguments) == argsClass, // For less <IE9 && FF<4
        suportNodeClass;

    try {
        suportNodeClass = !(toString.call(document) == objectClass && !({ 'toString': 0 } + ''));
    } catch(e) {
        suportNodeClass = true;
    }

    function isNode(value) {
        // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
        // methods that are `typeof` "string" and still can coerce nodes to strings
        return typeof value.toString != 'function' && typeof (value + '') == 'string';
    }

    function isArguments(value) {
        return (value && typeof value == 'object') ? toString.call(value) == argsClass : false;
    }

    // fallback for browsers that can't detect `arguments` objects by [[Class]]
    if (!supportsArgsClass) {
        isArguments = function(value) {
            return (value && typeof value == 'object') ? hasOwnProperty.call(value, 'callee') : false;
        };
    }

    function isFunction(value) {
        return typeof value == 'function';
    }

    // fallback for older versions of Chrome and Safari
    if (isFunction(/x/)) {
        isFunction = function(value) {
            return typeof value == 'function' && toString.call(value) == funcClass;
        };
    }        

    var isEqual = Rx.Internals.isEqual = function (x, y) {
        return deepEquals(x, y, [], []); 
    };

    /** @private
     * Used for deep comparison
     **/
    function deepEquals(a, b, stackA, stackB) {
        var result;
        // exit early for identical values
        if (a === b) {
            // treat `+0` vs. `-0` as not equal
            return a !== 0 || (1 / a == 1 / b);
        }
        var type = typeof a,
            otherType = typeof b;

        // exit early for unlike primitive values
        if (a === a &&
            !(a && objectTypes[type]) &&
            !(b && objectTypes[otherType])) {
            return false;
        }

        // exit early for `null` and `undefined`, avoiding ES3's Function#call behavior
        // http://es5.github.io/#x15.3.4.4
        if (a == null || b == null) {
            return a === b;
        }
        // compare [[Class]] names
        var className = toString.call(a),
            otherClass = toString.call(b);

        if (className == argsClass) {
            className = objectClass;
        }
        if (otherClass == argsClass) {
            otherClass = objectClass;
        }
        if (className != otherClass) {
            return false;
        }
      
        switch (className) {
            case boolClass:
            case dateClass:
                // coerce dates and booleans to numbers, dates to milliseconds and booleans
                // to `1` or `0`, treating invalid dates coerced to `NaN` as not equal
                return +a == +b;

            case numberClass:
                // treat `NaN` vs. `NaN` as equal
                return (a != +a)
                    ? b != +b
                    // but treat `+0` vs. `-0` as not equal
                    : (a == 0 ? (1 / a == 1 / b) : a == +b);

            case regexpClass:
            case stringClass:
                // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
                // treat string primitives and their corresponding object instances as equal
                return a == String(b);
        }

        var isArr = className == arrayClass;
        if (!isArr) {
        
            // exit for functions and DOM nodes
            if (className != objectClass || (!suportNodeClass && (isNode(a) || isNode(b)))) {
                return false;
            }

            // in older versions of Opera, `arguments` objects have `Array` constructors
            var ctorA = !supportsArgsClass && isArguments(a) ? Object : a.constructor,
                ctorB = !supportsArgsClass && isArguments(b) ? Object : b.constructor;

            // non `Object` object instances with different constructors are not equal
            if (ctorA != ctorB && !(
                isFunction(ctorA) && ctorA instanceof ctorA &&
                isFunction(ctorB) && ctorB instanceof ctorB
            )) {
                return false;
            }
        }
        
        // assume cyclic structures are equal
        // the algorithm for detecting cyclic structures is adapted from ES 5.1
        // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
        var length = stackA.length;
        while (length--) {
            if (stackA[length] == a) {
                return stackB[length] == b;
            }
        }
        
        var size = 0;
        result = true;

        // add `a` and `b` to the stack of traversed objects
        stackA.push(a);
        stackB.push(b);

        // recursively compare objects and arrays (susceptible to call stack limits)
        if (isArr) {
            length = a.length;
            size = b.length;

            // compare lengths to determine if a deep comparison is necessary
            result = size == a.length;
            // deep compare the contents, ignoring non-numeric properties
            while (size--) {
                var index = length,
                    value = b[size];

                if (!(result = deepEquals(a[size], value, stackA, stackB))) {
                    break;
                }
            }
        
            return result;
        }

        // deep compare each object
        for(var key in b) {
            if (hasOwnProperty.call(b, key)) {
                // count properties and deep compare each property value
                size++;
                return (result = hasOwnProperty.call(a, key) && deepEquals(a[key], b[key], stackA, stackB));
            }
        }

        if (result) {
            // ensure both objects have the same number of properties
            for (var key in a) {
                if (hasOwnProperty.call(a, key)) {
                    // `size` will be `-1` if `a` has more properties than `b`
                    return (result = --size > -1);
                }
            }
        }
        stackA.pop();
        stackB.pop();

        return result;
    }