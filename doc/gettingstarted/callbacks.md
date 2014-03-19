# Bridging to Callbacks and Promises #

Besides events, other asynchronous data sources exist in the the web and server-side world. One of them is the the simple callback pattern which is frequently used in Node.js. In this design pattern, the arguments are passed to the function, and then a callback is usually the last parameter, which when executed, passes control to the inner scope with the data.  Node.js has a standard way of doing callbacks in which the the callback is called with the `Error` object first if there is an error, else null, and then the additional parameters from the callback.

Promises have been gaining momentum within the JavaScript community and is on track to become part of the ECMAScript Standard as well as the DOM.  A promise represents the eventual result of an asynchronous operation. The primary way of interacting with a promise is through its then method, which registers callbacks to receive either a promise’s eventual value or the reason why the promise cannot be fulfilled.

## Converting Callbacks to Observable Sequences ##

Many asynchronous methods in Node.js and the many JavaScript APIs are written in such a way that it has a callback as the last parameter. These standard callbacks are executed with the data passed to it once it is available.  We can use the [`Rx.Observable.fromCallback`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefromcallbackfunc-scheduler-context) to wrap these kinds of callbacks.  Note that this does not cover the Node.js style of callbacks where the `Error` parameter is first.  For that operation, we provide the [`Rx.Observable.fromNodeCallback`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefromnodecallbackfunc-scheduler-context) which we will cover below.

In the following example, we will convert the Node.js [`fs.exists`]http://nodejs.org/api/fs.html#fs_fs_exists_path_callback) function.  This function takes a path and returns a `true` or `false` value whether the file exists, in this case we will check if 'file.txt' exists.  The arguments returned when wrapped in `Rx.Observable.fromCallback` will return an array containing the arguments passed to the callback.

```js
var Rx = require('rx'),
	fs = require('fs');

// Wrap the exists method
var exists = Rx.Observable.fromCallback(fs.exists);

var source = exists('file.txt');

// Get the first argument only which is true/false
var subscription = source.subscribe(
	function (x) { console.log('onNext: ' + x[0]); },
	function (e) { console.log('onError: ' + e.message); },
	function () { console.log('onCompleted'); });

// => onNext: true
// => onCompleted
```

## Converting Node.js Style Callbacks to Observable Sequences ##

Node.js has adopted a convention in many of the callbacks where an error may occur, such as File I/O, Network requests, etc.  RxJS supports this through the [`Rx.Observable.fromNodeCallback`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefromnodecallbackfunc-scheduler-context) method in which the error, if present, is captured and the `onError` notification is sent.  Otherwise, the `onNext` is sent with the rest of the callback arguments, followed by an `onCompleted` notification.

In the following example, we will convert the Node.js [`fs.rename`](http://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback) function to an Observable sequence.

```js
var fs = require('fs'),
    Rx = require('rx');

// Wrap fs.rename
var rename = Rx.Observable.fromCallback(fs.rename);

// Rename file which returns no parameters except an error
var source = rename('file1.txt', 'file2.txt');

var subscription = source.subscribe(
	function () { console.log('onNext: success'); },
	function (e) { console.log('onError: ' + e.message); },
	function () { console.log('onCompleted'); });

// => onNext: success!
// => onCompleted
```

## Converting Promises to Observable Sequences ##

Callbacks aren't the only asynchronous feature that can be converted to an observable sequence.  It's quite simple to convert a Promise object which conforms to the [Promises A+ Spec](http://promises-aplus.github.io/promises-spec/) where the behavior is uniform across implementations.  To support this, we provide the [`Rx.Observable.fromPromise`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefrompromisepromise) method which calls the `then` method of the promise to handle both success and error cases.

In the following example, we create promise objects using [RSVP](https://github.com/tildeio/rsvp.js) library.

```js
// Create a promise which resolves 42
var promise1 = new RSVP.Promise(function (resolve, reject) {
    resolve(42);
});

var source1 = Rx.Observable.fromPromise(promise);

var subscription1 = source1.subscribe(
	function (x) { console.log('onNext: ' + x); },
	function (e) { console.log('onError: ' + e.message); },
	function () { console.log('onCompleted'); });

// => onNext: 42
// => onCompleted

// Create a promise which rejects with an error
var promise2 = new RSVP.Promise(function (resolve, reject) {
    reject(new Error('reason'));
});

var source2 = Rx.Observable.fromPromise(promise);

var subscription2 = source2.subscribe(
	function (x) { console.log('onNext: ' + x); },
	function (e) { console.log('onError: ' + e.message); },
	function () { console.log('onCompleted'); });

// => onError: reject
```
