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

## `Disposable Class Methods` ##
- [`create`](#rxdisposablecreateaction)

## `Disposable Class Properties` ##
- [`empty`](#rxdisposableempty)
- [`isDisposable`](#rxdisposableisdisposabled)

## `Disposable Instance Methods` ##
- [`dispose`](#rxdisposableprototypedispose)

## _Class Methods_ ##

### <a id="rxdisposablecreateaction"></a>`Rx.Disposable.create(action)`
<a href="#rxdisposablecreateaction">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/disposable.js"View in source")

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

File:
- [`/src/core/disposables/disposable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/disposable.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/disposables/disposable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/disposables/disposable.js)

* * *

### <a id="rxdisposableisdisposabled"></a>`Rx.Disposable.isDisposable(d)`
<a href="#rxdisposableisdisposabled">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/disposable.js"View in source")

Creates a disposable object that invokes the specified action when disposed.

#### Arguments
1. `d` *(Object)*: Object to validate whether it has a dispose method.

#### Returns
*(Boolean)*: `true` if is a disposable object, else `false`.

#### Example
```js
var disposable = Rx.Disposable.empty;
console.log(disposable.isDisposable(disposable));
// => true
```

### Location

File:
- [`/src/core/disposables/disposable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/disposable.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/disposables/disposable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/disposables/disposable.js)

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

File:
- [`/src/core/disposables/disposable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/disposable.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/disposables/disposable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/disposables/disposable.js)

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

### Location

File:
- [`/src/core/disposables/disposable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/disposables/disposable.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/disposables/disposable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/disposables/disposable.js)

* * *
