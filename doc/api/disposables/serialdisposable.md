# `Rx.SerialDisposable` class #

Represents a disposable resource whose underlying disposable resource can be replaced by another disposable resource, causing automatic disposal of the previous underlying disposable resource.

## Usage ##

The follow example shows the basic usage of an Rx.SerialDisposable.

```js
var serialDisposable = new Rx.SerialDisposable();

var d1 = Rx.Disposable.create(function () {
     console.log('one');
});

serialDisposable.setDisposable(d1);

var d2 = Rx.Disposable.create(function () {
     console.log('two');
});

serialDisposable.setDisposable(d2);
// => one

serialDisposable.dispose();
// = two
```

### Location

- rx.js

## `SerialDisposable Constructor` ##
- [`constructor`](#rxserialdisposable)

## `SerialDisposable Instance Methods` ##
- [`dispose`](#rxserialdisposableprototypedispose)
- [`getDisposable`](#rxserialdisposableprototypegetdisposable)
- [`setDisposable`](#rxserialdisposableprototypesetdisposable)

## `SerialDisposable Instance Properties` ##
- [`isDisposed`](#isdisposed)

## _SerialDisposable Constructor_ ##

### <a id="rxserialdisposable"></a>`Rx.SerialDisposable()`
<a href="#rxserialdisposable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/serialdisposable.js#L5-L8 "View in source")

Initializes a new instance of the `Rx.SerialDisposable` class.

#### Example
```js
var serialDisposable = new Rx.SerialDisposable();

console.log(serialDisposable.isDisposed);
// => false
```

### Location

- rx.js

* * *

## _SerialDisposable Instance Methods_ ##

### <a id="rxserialdisposableprototypedispose"></a>`Rx.SerialDisposable.prototype.dispose()`
<a href="#rxserialdisposableprototypedispose">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/serialdisposable.js#L50-L60 "View in source")

Disposes the underlying disposable as well as all future replacements.

#### Example

```js
var serialDisposable = new Rx.SerialDisposable();

var d1 = Rx.Disposable.create(function () {
     console.log('one');
});

serialDisposable.setDisposable(disposable);

serialDisposable.dispose();
// => one

var d2 = Rx.Disposable.create(function () {
     console.log('two');
});

// => two
```

### Location

- rx.js

* * *

### <a id="rxserialdisposableprototypegetdisposable"></a>`Rx.SerialDisposable.prototype.getDisposable()`
<a href="#rxserialdisposableprototypegetdisposable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/serialdisposable.js#L16-L18 "View in source")

Gets the underlying disposable.

#### Returns
*(Disposable)*: The underlying disposable.

#### Example

```js
var serialDisposable = new Rx.SerialDisposable();

var disposable = Rx.Disposable.create(function () {
     console.log('disposed');
});

serialDisposable.setDisposable(disposable);

var d = serialDisposable.getDisposable();

console.log(d === disposable);
```

### Location

- rx.js

* * *

### <a id="rxserialdisposableprototypesetdisposablevalue"></a>`Rx.SerialDisposable.prototype.setDisposable(value)`
<a href="#rxserialdisposableprototypesetdisposablevalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/serialdisposable.js#L24-L36 "View in source")

Sets the underlying disposable.

#### Arguments
1. `value` *(Disposable)*: The new underlying disposable.

#### Example

```js
var serialDisposable = new Rx.SerialDisposable();

var d1 = Rx.Disposable.create(function () {
     console.log('one');
});

serialDisposable.setDisposable(d1);

serialDisposable.dispose();
// => one

var d2 = Rx.Disposable.create(function () {
     console.log('two');
});

serialDisposable.setDisposable(d2);
// => two
```

### Location

- rx.js

* * *

## _SerialDisposable Instance Properties_ ##

### <a id="isdisposed"></a>`isDisposed`
<a href="#isdisposed">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/serialdisposable.js#L6 "View in source")

Gets a value that indicates whether the object is disposed.

#### Example
```js
var serialDisposable = new Rx.SerialDisposable();

var disposable = Rx.Disposable.create(function () {
     console.log('disposed');
});

serialDisposable.setDisposable(disposable);

console.log(serialDisposable.isDisposed);
// => false

serialDisposable.dispose();
// => disposed

console.log(serialDisposable.isDisposed);
// => true
```

### Location

- rx.js

* * *
