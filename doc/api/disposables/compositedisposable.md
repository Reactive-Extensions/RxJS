# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
# `Rx.CompositeDisposable` class #

Represents a group of disposable resources that are disposed together.

## Usage ##

The follow example shows the basic usage of an Rx.CompositeDisposable.

```js
var d1 = Rx.Disposable.create(function () {
     console.log('one');
});

var d2 = Rx.Disposable.create(function () {
     console.log('two');
});

// Initialize with two disposables
var disposables = new Rx.CompositeDisposable(d1, d2);

disposables.dispose();
// => one
// => two
```

### Location

- rx.js

## `CompositeDisposable Constructor` ##
- [`constructor`](#rxcompositedisposablergs)

## `CompositeDisposable Instance Methods` ##
- [`add`](#rxcompositedisposableprototypeadditem)
- [`dispose`](#rxcompositedisposableprototypedispose)
- [`remove`](#rxcompositedisposableprototyperemoveitem)
- [`toArray`](#rxcompositedisposableprototypetoarray)

## `CompositeDisposable Instance Properties` ##
- [`isDisposed`](#isdisposed)
- [`length`](#length)

## _CompositeDisposable Constructor_ ##

### <a id="rxcompositedisposableargs"></a>`Rx.CompositeDisposable(...args)`
<a href="#rxcompositedisposablergs">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/compositedisposable.js#L5-L9 "View in source")

Initializes a new instance of the `Rx.CompositeDisposable` class from a group of disposables.

#### Arguments
1. `args` *(Array|arguments)*: Disposables that will be disposed together.

#### Example
```js
var d1 = Rx.Disposable.create(function () {
     console.log('one');
});

var d2 = Rx.Disposable.create(function () {
     console.log('two');
});

// Initialize with two disposables
var disposables = new Rx.CompositeDisposable(d1, d2);

disposables.dispose();
// => one
// => two
```

### Location

- rx.js

* * *

## _CompositeDisposable Instance Methods_ ##

### <a id="rxcompositedisposableprototypeadditem"></a>`Rx.CompositeDisposable.prototype.add(item)`
<a href="#rxcompositedisposableprototypeadditem">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/compositedisposable.js#L17-L24 "View in source")

Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.

#### Arguments
1. `item` *(Disposable)*: Disposable to add.

#### Example

```js
var disposables = new Rx.CompositeDisposable();

var d1 = Rx.Disposable.create(function () {
     console.log('one');
});

disposables.add(d1);

disposables.dispose();
// => one
```

### Location

- rx.js

* * *

### <a id="rxcompositedisposableprototypedispose"></a>`Rx.CompositeDisposable.prototype.dispose()`
<a href="#rxcompositedisposableprototypedispose">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/compositedisposable.js#L49-L60 "View in source")

Disposes all disposables in the group and removes them from the group.

#### Example

```js
var d1 = Rx.Disposable.create(function () {
     console.log('one');
});

var d2 = Rx.Disposable.create(function () {
     console.log('two');
});

var disposables = new Rx.CompositeDisposable(d1, d2);

disposables.dispose();
// => one
// => two

console.log(disposables.length);
// => 0
```

### Location

- rx.js

* * *

### <a id="rxcompositedisposableprototyperemoveitem"></a>`Rx.CompositeDisposable.prototype.remove(item)`
<a href="#rxcompositedisposableprototyperemoveitem">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/compositedisposable.js#L31-L44 "View in source")

Removes and disposes the first occurrence of a disposable from the CompositeDisposable.

#### Arguments
1. `item` *(Disposable)*: Disposable to remove.

#### Returns
*(Boolean)*: `true` if the disposable was found and disposed; otherwise, `false`.

#### Example

```js
var disposables = new Rx.CompositeDisposable();

var d1 = Rx.Disposable.create(function () {
     console.log('one');
});

disposables.add(d1);

console.log(disposables.remove(d1));
// => true
```

### Location

- rx.js

* * *

### <a id="rxcompositedisposableprototypetoarray"></a>`Rx.CompositeDisposable.prototype.toarray()`
<a href="#rxcompositedisposableprototypetoarray">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/compositedisposable.js#L87-L89 "View in source")

Converts the existing CompositeDisposable to an array of disposables. Does not dispose the objects.

#### Returns
*(Array)*: An array of disposable objects.

#### Example

```js
var d1 = Rx.Disposable.create(function () {
     console.log('one');
});

var d2 = Rx.Disposable.create(function () {
     console.log('two');
});

var disposables = new Rx.CompositeDisposable(d1, d2);

var array = disposables.toArray();

console.log(array.length);
// => 2
```

### Location

- rx.js

* * *

## _CompositeDisposable Instance Properties_ ##

### <a id="isdisposed"></a>`isDisposed`
<a href="#isdisposed">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/compositedisposable.js#L7 "View in source")

Gets a value that indicates whether the object is disposed.

#### Example
```js
var disposables = new Rx.CompositeDisposable();

var d1 = Rx.Disposable.create(function () {
     console.log('disposed');
});

disposables.add(d1);

console.log(disposables.isDisposed);
// => false

disposables.dispose();
// => disposed

console.log(disposables.isDisposed);
// => true
```

### Location

- rx.js

* * *

### <a id="length"></a>`length`
<a href="#length">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/compositedisposable.js#L8 "View in source")

Gets the number of disposables in the CompositeDisposable.

#### Example
```js
var disposables = new Rx.CompositeDisposable();

var d1 = Rx.Disposable.create(function () {
     console.log('disposed');
});

disposables.add(d1);

console.log(disposables.length);
// => 1

disposables.dispose();
// => disposed

console.log(disposables.length);
// => 0
```

### Location

- rx.js

* * *
