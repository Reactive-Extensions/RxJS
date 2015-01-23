# Bridging to Callbacks #

Besides events, other asynchronous data sources exist in the the web and server-side world. One of them is the the simple callback pattern which is frequently used in Node.js. In this design pattern, the arguments are passed to the function, and then a callback is usually the last parameter, which when executed, passes control to the inner scope with the data.  Node.js has a standard way of doing callbacks in which the the callback is called with the `Error` object first if there is an error, else null, and then the additional parameters from the callback.

## Converting Callbacks to Observable Sequences ##

Many asynchronous methods in Node.js and the many JavaScript APIs are written in such a way that it has a callback as the last parameter. These standard callbacks are executed with the data passed to it once it is available.  We can use the [`Rx.Observable.fromCallback`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/fromcallback.md) to wrap these kinds of callbacks.  Note that this does not cover the Node.js style of callbacks where the `Error` parameter is first.  For that operation, we provide the [`Rx.Observable.fromNodeCallback`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/fromnodecallback.md) which we will cover below.

In the following example, we will convert the Node.js [`fs.exists`](http://nodejs.org/api/fs.html#fs_fs_exists_path_callback) function.  This function takes a path and returns a `true` or `false` value whether the file exists, in this case we will check if 'file.txt' exists.  The arguments returned when wrapped in `Rx.Observable.fromCallback` will return an array containing the arguments passed to the callback.

```js
var Rx = require('rx'),
	fs = require('fs');

// Wrap the exists method
var exists = Rx.Observable.fromCallback(fs.exists);

var source = exists('file.txt');

// Get the first argument only which is true/false
var subscription = source.subscribe(
	function (x) { console.log('onNext: %s', x); },
	function (e) { console.log('onError: %s', e); },
	function ()  { console.log('onCompleted'); });

// => onNext: true
// => onCompleted
```

## Converting Node.js Style Callbacks to Observable Sequences ##

Node.js has adopted a convention in many of the callbacks where an error may occur, such as File I/O, Network requests, etc.  RxJS supports this through the [`Rx.Observable.fromNodeCallback`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/fromnodecallback.md) method in which the error, if present, is captured and the `onError` notification is sent.  Otherwise, the `onNext` is sent with the rest of the callback arguments, followed by an `onCompleted` notification.

In the following example, we will convert the Node.js [`fs.rename`](http://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback) function to an Observable sequence.

```js
var fs = require('fs'),
    Rx = require('rx');

// Wrap fs.rename
var rename = Rx.Observable.fromNodeCallback(fs.rename);

// Rename file which returns no parameters except an error
var source = rename('file1.txt', 'file2.txt');

var subscription = source.subscribe(
	function (x) { console.log('onNext: success!'); },
	function (e) { console.log('onError: %s', e); },
	function ()  { console.log('onCompleted'); });

// => onNext: success!
// => onCompleted
```

## Converting Observable sequences to Callbacks ##

We can easily go in another direction and convert an observable sequence to a callback.  This of course requires the observable sequence to yield only one value for this to make sense.  Let's convert using the [`timer`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/timer.md) method to wait for a certain amount of time.  The implementation of `toCallback` could look like the following.  Note that it is not included in RxJS but you can easily add it if needed.

```js
Rx.Observable.prototype.toCallback = function (cb) {
  var source = this;
  return function () {
    var val, hasVal = false;
    source.subscribe(
      function (x) { hasVal = true; val = x; },
      function (e) { throw e; }, // Default error handling
      function ()  { hasVal && cb(val); }
    );
  };
};
```

Then we could execute our command simply like the following:

```js
function cb (x) { console.log('hi!'); }

setTimeout(
  Rx.Observable.timer(5000)
    .toCallback(cb)
  , 500);
```

## Converting Observable sequences to Node.js Style Callbacks ##

The same could also apply to Node.js style callbacks should you desire that behavior.  Once again the same restrictions apply with regards to having a single value and an end much like above.  The implementation of `toNodeCallback` could look like the following.  Note that it is not included in RxJS but you can easily add it if needed.

```js
Rx.Observable.prototype.toNodeCallback = function (cb) {
  var source = this;
  return function () {
    var val, hasVal = false;
    source.subscribe(
      function (x) { hasVal = true; val = x; },
      function (e) { cb(e); },
      function ()  { hasVal && cb(null, val); }
    );
  };
};
```

We could then take this and for example if we had an observable sequence which gets a value from a REST call and then convert it to Node.js style.

```
getData().toNodeCallback(function (err, data) {
	if (err) { throw err; }
	// Do something with the data
});
```
