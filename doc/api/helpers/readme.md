# Reactive Extensions Helpers #

Helper functions for the Reactive Extensions for JavaScript

## Documentation ##

- ['Rx.helpers.defaultError'](#rxhelpersdefaulterror)
- [`Rx.helpers.identity`](#rxhelpersidentityx)
- [`Rx.helpers.isPromise`](#rxhelpersispromisep)
- [`Rx.helpers.just`](#rxhelpersjustvalue)
- [`Rx.helpers.noop`](#rxhelpersnoop)

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

### <a id="rxhelpersidentityx"></a>`Rx.helpers.just(value)`
<a href="#rxhelpersjustvalue">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/basicheader.js "View in source") [&#x24C9;][1]

A function which takes an argument and returns a function, when invoked, returns the argument.

#### Arguments
1. `value` *(Any)*: The value to return.

#### Returns
*(Function)*: A function, when invoked, returns the value.

#### Example 

```js
var just = Rx.helpers.just;

Rx.Observable.timer(100)
  .map(just('foo'))
  .subscribe(console.log.bind(console));
// => foo
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

var isPromise(p);
console.log(p);
// => true
```
* * *


