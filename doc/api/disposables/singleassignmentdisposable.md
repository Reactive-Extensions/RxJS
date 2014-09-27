# `Rx.SingleAssignmentDisposable` class #

Represents a disposable resource which only allows a single assignment of its underlying disposable resource. If an underlying disposable resource has already been set, future attempts to set the underlying disposable resource will throw an Error.

## Usage ##

The follow example shows the basic usage of an Rx.SingleAssignmentDisposable.

```js
var singleDisposable = new Rx.SingleAssignmentDisposable();

var disposable = Rx.Disposable.create(function () {
     console.log('disposed');
});

singleDisposable.setDisposable(disposable);

singleDisposable.dispose();
// => disposed
```

### Location

- rx.js

## `SingleAssignmentDisposable Constructor` ##
- [`constructor`](#rxsingleassignmentdisposable)

## `SingleAssignmentDisposable Instance Methods` ##
- [`dispose`](#rxsingleassignmentdisposableprototypedispose)
- [`getDisposable`](#rxsingleassignmentdisposableprototypegetdisposable)
- [`setDisposable`](#rxsingleassignmentdisposableprototypesetdisposable)

## `SingleAssignmentDisposable Instance Properties` ##
- [`isDisposed`](#isdisposed)

## _SingleAssignmentDisposable Constructor_ ##

### <a id="rxsingleassignmentdisposable"></a>`Rx.SingleAssignmentDisposable()`
<a href="#rxsingleassignmentdisposable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/singleassignmentdisposable.js#L7-L10 "View in source")

Initializes a new instance of the `Rx.SingleAssignmentDisposable` class.

#### Example
```js
var singleDisposable = new Rx.SingleAssignmentDisposable();

console.log(singleDisposable.isDisposed);
// => false
```

### Location

- rx.js

* * *

## _SingleAssignmentDisposable Instance Methods_ ##

### <a id="rxsingleassignmentdisposableprototypedispose"></a>`Rx.SingleAssignmentDisposable.prototype.dispose()`
<a href="#rxsingleassignmentdisposableprototypedispose">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/singleassignmentdisposable.js#L47-L57 "View in source")

Disposes the underlying disposable.

#### Example

```js
var singleDisposable = new Rx.SingleAssignmentDisposable();

var disposable = Rx.Disposable.create(function () {
     console.log('disposed');
});

singleDisposable.setDisposable(disposable);

console.log(singleDisposable.isDisposed);
// => false

singleDisposable.dispose();
// => disposed

console.log(singleDisposable.isDisposed);
// => true
```

### Location

- rx.js

* * *

### <a id="rxsingleassignmentdisposableprototypegetdisposable"></a>`Rx.SingleAssignmentDisposable.prototype.getDisposable()`
<a href="#rxsingleassignmentdisposableprototypegetdisposable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/singleassignmentdisposable.js#L18-L20 "View in source")

Gets the underlying disposable. After disposal, the result of getting this method is undefined.

#### Returns
*(Disposable)*: The underlying disposable.

#### Example

```js
var singleDisposable = new Rx.SingleAssignmentDisposable();

var disposable = Rx.Disposable.create(function () {
     console.log('disposed');
});

singleDisposable.setDisposable(disposable);

var d = singleDisposable.getDisposable();

console.log(d === disposable);
```

### Location

- rx.js

* * *

### <a id="rxsingleassignmentdisposableprototypesetdisposablevalue"></a>`Rx.SingleAssignmentDisposable.prototype.setDisposable(value)`
<a href="#rxsingleassignmentdisposableprototypesetdisposablevalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/singleassignmentdisposable.js#L31-L42 "View in source")

Sets the underlying disposable.

#### Arguments
1. `value` *(Disposable)*: The new underlying disposable.

#### Example

```js
var singleDisposable = new Rx.SingleAssignmentDisposable();

var d1 = Rx.Disposable.create(function () {
     console.log('one');
});

singleDisposable.setDisposable(d1);

var d2 = Rx.Disposable.create(function () {
     console.log('two');
});

try {
    singleDisposable.setDisposable(d2);
} catch (e) {
    console.log(e.message);
}

// => Disposable has already been assigned
```

### Location

- rx.js

* * *

## _SingleAssignmentDisposable Instance Properties_ ##

### <a id="isdisposed"></a>`isDisposed`
<a href="#isdisposed">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/singleassignmentdisposable.js#L8 "View in source")

Gets a value that indicates whether the object is disposed.

#### Example
```js
var singleDisposable = new Rx.SingleAssignmentDisposable();

var disposable = Rx.Disposable.create(function () {
     console.log('disposed');
});

singleDisposable.setDisposable(disposable);

console.log(singleDisposable.isDisposed);
// => false

singleDisposable.dispose();
// => disposed

console.log(singleDisposable.isDisposed);
// => true
```

### Location

- rx.js

* * *
