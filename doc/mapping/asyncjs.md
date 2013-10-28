# RxJS for Async.js Users #

[Async.js](https://github.com/caolan/async) is a popular utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript. Async provides around 20 functions that include the usual 'functional' suspects (map, reduce, filter, each...) as well as some common patterns for asynchronous control flow (parallel, series, waterfall...). All these functions assume you follow the node.js convention of providing a single callback as the last argument of your async function.

Many of these concepts in the library map directly to RxJS concepts.  We'll go operator by operator on how each map to existing functionality in RxJS.

## Async Methods
 - ['async.each'](#asynceach)
 - [`async.map`](#asyncmap)
 - [`async.filter`](#asyncfilter)

## `async.each` ##

The [`async.each`](https://github.com/caolan/async#eacharr-iterator-callback) method applies an iterator function to each item in an array, in parallel. The iterator is called with an item from the list and a callback for when it has finished. If the iterator passes an error to this callback, the main callback for the each function is immediately called with the error.

#### async version ####

In this example, we will use `async.each` to iterate an array of files to write some contents and save.

```js
var async = require('async'),
	fs = require('fs');

var files = ['file1.txt', 'file2.txt', 'file3.txt'];

function saveFile (file, cb) {
	fs.writeFile(file, 'Hello Node', function (err) {
		cb(err);
	});
}

async.each(files, saveFile, function (err) {
	if (err) {
		console.log('error: ' + err);
	} else {
		console.log('success!');
	}
});
```

#### RxJS version ####

Using RxJS, you can accomplish this task in a number of ways by using `Rx.Observable.fromNodeCallback` to wrap the `fs.writeFile` function, and then iterate the files by using the `Rx.Observable.for` method.

```js
var Rx = require('rx'),
	fs = require('fs');

var files = ['file1.txt', 'file2.txt', 'file3.txt'];

// wrap the method
var writeFile = Rx.Observable.fromNodeCallback(fs.writeFile);

Rx.Observable
	.for(files, function (file) {
		return writeFile(file, 'Hello Node')
	})
	.subscribe(
		function () {
			console.log('file written!');
		},
		function (err) {
			console.log('err ' + err);
		},
		function () {
			console.log('completed!')
		}
	);
```

* * * 

## `async.map` ##

The `async.map` method produces a new array of values by mapping each value in the given array through the iterator function. The iterator is called with an item from the array and a callback for when it has finished processing. The callback takes 2 arguments, an error and the transformed item from the array. If the iterator passes an error to this callback, the main callback for the map function is immediately called with the error.

#### async version ####

In this example, we'll get the `fs.stat` for each file given and have the results returned as an array.

```js
var async = require('async'),
	fs = require('fs');

var files = ['file1.txt', 'file2.txt', 'file3.txt'];

async.map(files, fs.stat, function (err, results) {
	results.forEach(function (result) {
		console.log('is file: ' + result.isFile());
	});
});
```

#### RxJS version ####

Using RxJS, we can achieve the same results of an array of all of our values by wrapping the `fs.stat` method again using our `Rx.Observable.fromNodeCallback`, then iterate using the `Rx.Observable.for` method, and finally, calling `.toArray()` to get our results as an entire array.

```js
var Rx = require('rx'),
	fs = require('fs');

var stat = Rx.Observable.fromNodeCallback(fs.stat);

var files = ['file1.txt', 'file2.txt', 'file3.txt'];

Rx.Observable
	.for(files, function (file) {
		return stat(file);
	})
	.toArray()
	.subscribe(
		function (results) {
			results.forEach(function (result) {
				console.log('is file: ' + result.isFile());
			});
		},
		function (err) {
			console.log('err ' + err);
		}
	);
```

* * *

## `async.filter` ##

The `async.filter` method Returns a new array of all the values which pass an async truth test. The callback for each iterator call only accepts a single argument of true or false, it does not accept an error argument first! This is in-line with the way node libraries work with truth tests like fs.exists.

#### async version ####

In this example, we'll determine whether the file exists by calling `fs.exists` for each file given and have the results returned as an array.

```js
var async = require('async'),
	fs = require('fs');

var files = ['file1.txt', 'file2.txt', 'file3.txt'];

async.filter(files, fs.exists, function (err, results) {
	results.forEach(function (result) {
		console.log('exists: ' + result);
	});
});
```

#### RxJS version ####

Using RxJS, we can achieve the same results of an array of all of our values by wrapping the `fs.exists` method using our `Rx.Observable.fromCallback` as it only has one result, a `true` or `false` value instead of the usual callback with error and result.  Then we'lliterate using the `Rx.Observable.for` method, filter the existing files and finally, calling `.toArray()` to get our results as an entire array.

```js
var Rx = require('rx'),
	fs = require('fs');

var exists = Rx.Observable.fromCallback(fs.exists);

Rx.Observable
	.for(files, function (file) {
		return exists(file);
	})
	.where(function (x) { return x; })
	.toArray()
	.subscribe(
		function (results) {
			results.forEach(function (result) {
				console.log('exists: ' + result);
			});
		},
		function (err) {
			console.log('err ' + err);
		}
	);
```

* * *