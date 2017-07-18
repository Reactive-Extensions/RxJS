# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
# Reactive Extensions Helpers #

Helper functions for the Reactive Extensions for JavaScript

## Documentation ##

- [`Rx.helpers.defaultComparer`](#rxhelpersdefaultcomparerx-y)
- [`Rx.helpers.defaultSubComparer`](#rxhelpersdefaultsubscomparerx-y)
- [`Rx.helpers.defaultError`](#rxhelpersdefaulterror)
- [`Rx.helpers.identity`](#rxhelpersidentityx)
- [`Rx.helpers.isPromise`](#rxhelpersispromisep)
- [`Rx.helpers.noop`](#rxhelpersnoop)

* * *

### <a id="rxhelpersdefaultcomparerx-y"></a>`Rx.helpers.defaultComparer(x, y)`
<a href="#rxhelpersdefaultcomparerx-y">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/basicheader.js "View in source") [&#x24C9;][1]

The default equality comparer, used when a comparer is not supplied to a function.  Uses an internal deep equality check.

#### Arguments
1. `x` *(Any)*: The first value to compare
2. `y` *(Any)*: The second value to compare

#### Returns
*(Boolean)*: `true` if equal; else `false`.

#### Example

```js
var comparer = Rx.helpers.defaultComparer;

// Should return true
var x = 42, y = 42
console.log(comparer(x, y));
// => true

// Should return false
var x = new Date(0), y = new Date();
console.log(comparer(x, y));
// => false
```
* * *

### <a id="rxhelpersdefaultsubcomparerx-y"></a>`Rx.helpers.defaultSubcomparer(x, y)`
<a href="#rxhelpersdefaultsubcomparerx-y">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/basicheader.js "View in source") [&#x24C9;][1]

The default comparer to determine whether one object is greater, less than or equal to another.

#### Arguments
1. `x` *(Any)*: The first value to compare
2. `y` *(Any)*: The second value to compare

#### Returns
*(Number)*: Returns `1` if `x` is greater than `y`, `-1` if `y` is greater than `x`, and `0` if the objects are equal.

#### Example

```js
var comparer = Rx.helpers.defaultSubcomparer;

// Should return 0
var x = 42, y = 42
console.log(comparer(x, y));
// => 0

// Should return -1
var x = new Date(0), y = new Date();
console.log(comparer(x, y));
// => -1

// Should return 1
var x = 43, y = 42;
console.log(comparer(x, y));
// => 1
```
* * *

### <a id="rxhelpersdefaulterror"></a>`Rx.helpers.defaultError(err)`
<a href="#rxhelpersdefaulterror">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/basicheader.js "View in source") [&#x24C9;][1]

Throws the specified error

#### Arguments
1. `err` *(Any)*: The error to throw

#### Example

```js
var defaultError = Rx.helpers.defaultError;

// Returns its value
defaultError(new Error('woops'))
// => Error: woops
```
* * *

### <a id="rxhelpersidentityx"></a>`Rx.helpers.identity(x)`
<a href="#rxhelpersidentityx">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/basicheader.js "View in source") [&#x24C9;][1]

A function which returns its value unmodified.

#### Arguments
1. `x` *(Any)*: The value to return.

#### Returns
*(Any)*: The value given as the parameter.

#### Example

```js
var identity = Rx.helpers.identity;

// Returns its value
var x = identity(42);
console.log(x);
// => 42
```
* * *

### <a id="rxhelpersispromisep"></a>`Rx.helpers.isPromise(p)`
<a href="#rxhelpersispromisep">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/basicheader.js "View in source") [&#x24C9;][1]

A function which determines whether the object is a `Promise`.

#### Arguments
1. `p` *(Any)*: The object to determine whether it is a promise.

#### Returns
*(Boolean)*: `true` if the object is a `Promise` else `false`

#### Example

```js
var isPromise = Rx.helpers.isPromise;

var p = RSVP.Promise(function (res) { res(42); });

console.log(isPromise(p));
// => true
```
* * *

### <a id="rxhelpersnoop"></a>`Rx.helpers.noop()`
<a href="#rxhelpersnoop">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/basicheader.js "View in source") [&#x24C9;][1]

A function which does nothing

#### Example

```js
var noop = Rx.helpers.noop;

// This does nothing!
noop();
```
* * *
