# `Rx.Disposable` class #

Provides a set of static methods for creating Disposables, which defines a method to release allocated resources.

## Usage ##

The follow example shows the basic usage of an `Rx.Disposable`.

```js
var disposable = Rx.Disposable.create(function () {
    console.log('disposed');
});

disposable.dispose();
// => disposed
```

### Location

- rx.js

## `Disposable Class Methods` ##
- [`create`](#rxdisposablecreateaction)

## `Disposable Class Properties` ##
- [`empty`](#rxdisposableempty)

## `Disposable Instance Methods` ##
- [`dispose`](#rxdisposableprototypedispose)

## _Class Methods_ ##

### <a id="rxdisposablecreateaction"></a>`Rx.Disposable.create(action)`
<a href="#rxdisposablecreateaction">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/disposable.js#L25 "View in source")

Creates a disposable object that invokes the specified action when disposed.

#### Arguments
1. `action` *(Function)*: Function to run during the first call to `dispose`. The action is guaranteed to be run at most once.

#### Returns
*(Disposable)*: The disposable object that runs the given action upon disposal.

#### Example
```js
var disposable = Rx.Disposable.create(function () {
    console.log('disposed');
});

disposable.dispose();
// => disposed
```

### Location

- rx.js

* * *

## _Disposable Class Properties_ ##

### <a id="rxdisposableempty"></a>`Rx.Disposable.empty`
<a href="#rxdisposableempty">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/disposable.js#L130 "View in source")

Gets the disposable that does nothing when disposed.

#### Returns
*(Disposable)*: The disposable that does nothing when disposed.

#### Example

```js
var disposable = Rx.Disposable.empty;

disposable.dispose(); // Does nothing
```

### Location

- rx.js

* * *

## _Disposable Instance Methods_ ##

### <a id="rxdisposableprototypedispose"></a>`Rx.Disposable.prototype.dispose()`
<a href="#rxdisposableprototypedispose">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/disposable.js#L13-L18 "View in source")

Performs the task of cleaning up resources.

#### Example

```js
var disposable = Rx.Disposable.create(function () {
    console.log('disposed');
});

disposable.dispose();
// => disposed
```

### Location

- rx.js

* * *
