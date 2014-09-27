# `Rx.RefCountDisposable` class #

Represents a disposable resource that only disposes its underlying disposable resource when all `getDisposable` dependent disposable objects have been disposed.

## Usage ##

The follow example shows the basic usage of an `Rx.RefCountDisposable`.

```js
var disposable = Rx.Disposable.create(function () {
     console.log('disposed');
});

var refCountDisposable = new Rx.RefCountDisposable(disposable);

// Try disposing before the underlying is disposed
refCountDisposable.dispose();

console.log(refCountDisposable.isDisposed);
// => false

// Dispose the underlying disposable
disposable.dispose();
// => disposed

// Now dispose the primary
refCountDisposable.dispose();

console.log(refCountDisposable.isDisposed);
// => true
```

### Location

- rx.js

## `RefCountDisposable Constructor` ##
- [`constructor`](#rxrefcountdisposabledisposable)

## `RefCountDisposable Instance Methods` ##
- [`dispose`](#rxrefcountdisposableprototypedispose)
- [`getDisposable`](#rxrefcountdisposableprototypegetdisposable)

## `RefCountDisposable Instance Properties` ##
- [`isDisposed`](#isdisposed)

## _RefCountDisposable Constructor_ ##

### <a id="rxrefcountdisposable"></a>`Rx.RefCountDisposable(disposable)`
<a href="#rxrefcountdisposable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/rxrefcountdisposable.js#L7-L10 "View in source")

Initializes a new instance of the `Rx.RefCountDisposable` class with the specified disposable

#### Arguments
1. `disposable` *(Disposable)*: Underlying disposable.

#### Example
```js
var disposable = Rx.Disposable.create(function () {
     console.log('disposed');
});

var refCountDisposable = new Rx.RefCountDisposable(disposable);

console.log(refCountDisposable.isDisposed);
// => false
```

### Location

- rx.js

* * *

## _RefCountDisposable Instance Methods_ ##

### <a id="rxrefcountdisposableprototypedispose"></a>`Rx.RefCountDisposable.prototype.dispose()`
<a href="#rxrefcountdisposableprototypedispose">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/rxrefcountdisposable.js#L30-L35 "View in source")

Disposes the underlying disposable only when all dependent disposables have been disposed.

#### Example

```js
var disposable = Rx.Disposable.create(function () {
     console.log('disposed');
});

var refCountDisposable = new Rx.RefCountDisposable(disposable);

// Try disposing before the underlying is disposed
refCountDisposable.dispose();

console.log(refCountDisposable.isDisposed);
// => false

// Dispose the underlying disposable
disposable.dispose();
// => disposed

// Now dispose the primary
refCountDisposable.dispose();

console.log(refCountDisposable.isDisposed);
// => true
```

### Location

- rx.js

* * *

### <a id="rxrefcountdisposableprototypegetdisposable"></a>`Rx.RefCountDisposable.prototype.getDisposable()`
<a href="#rxrefcountdisposableprototypegetdisposable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/rxrefcountdisposable.js#L18-L20 "View in source")

Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.

#### Returns
*(Disposable)*: A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.

#### Example

```js
var disposable = Rx.Disposable.create(function () {
     console.log('disposed');
});

var refCountDisposable = new Rx.RefCountDisposable(disposable);

var d = refCountDisposable.getDisposable();

console.log(d === disposable);
// => false

// Clean up disposables
disposable.dispose();
d.dispose();

// Now try to dispose the main
refCountDisposable.dispose();

console.log(refCountDisposable.isDisposed);
// => true
```

### Location

- rx.js

* * *

## _RefCountDisposable Instance Properties_ ##

### <a id="isdisposed"></a>`isDisposed`
<a href="#isdisposed">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/rxrefcountdisposable.js#L8 "View in source")

Gets a value that indicates whether the object is disposed.

#### Example
```js
var disposable = Rx.Disposable.create(function () {
     console.log('disposed');
});

var refCountDisposable = new Rx.RefCountDisposable(disposable);

disposable.dispose();

console.log(refCountDisposable.isDisposed);
// => false

refCountDisposable.dispose();
// => disposed

console.log(refCountDisposable.isDisposed);
// => true
```

### Location

- rx.js

* * *
