# RxJS for Async.js Users #

[Async.js](https://github.com/caolan/async) is a popular utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript. Async provides around 20 functions that include the usual 'functional' suspects (map, reduce, filter, each...) as well as some common patterns for asynchronous control flow (parallel, series, waterfall...). All these functions assume you follow the node.js convention of providing a single callback as the last argument of your async function.

Many of these concepts in the library map directly to RxJS concepts.  We'll go operator by operator on how each map to existing functionality in RxJS.

## Collection Methods
 - [`async.each`](#asynceach)
 - [`async.map`](#asyncmap)
 - [`async.filter`](#asyncfilter)
 - [`async.reject`](#asyncreject)
 - [`async.reduce`](#asyncreduce)
 - [`async.detect`](#asyncdetect)
 - [`async.some`](#asyncsome)
 - [`async.every`](#asyncevery)
 - [`async.concat`](#asynconcat)

 ## Control Flow
 - [`async.whilst`](#asyncwhilst)

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
	// if any of the saves produced an error, err would equal that error
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
	.for(files, stat)
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

The `async.filter` method returns a new array of all the values which pass an async truth test. The callback for each iterator call only accepts a single argument of true or false, it does not accept an error argument first! This is in-line with the way node libraries work with truth tests like fs.exists.

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

Using RxJS, we can achieve the same results of an array of all of our values by wrapping the `fs.exists` method using our `Rx.Observable.fromCallback` as it only has one result, a `true` or `false` value instead of the usual callback with error and result.  Then we'll iterate using the `Rx.Observable.for` method, filter the existing files and finally, calling `.toArray()` to get our results as an entire array.

```js
var Rx = require('rx'),
	fs = require('fs');

var exists = Rx.Observable.fromCallback(fs.exists);

Rx.Observable
	.for(files, exists)
	.where(function (x) { return x; })
	.toArray()
	.subscribe(
		function (results) {
			results.forEach(function (result) {
				console.log('exists: ' + result);
			});
		}
	);
```

* * *

## `async.reject` ##

The `async.reject` method is the opposite of filter. Removes values that pass an async truth test.
 
#### async version ####

In this example, we'll determine whether the file exists by calling `fs.exists` for each file given and have the results returned as an array.

```js
var async = require('async'),
	fs = require('fs');

var files = ['file1.txt', 'file2.txt', 'file3.txt'];

async.reject(files, fs.exists, function (err, results) {
	results.forEach(function (result) {
		console.log('exists: ' + result);
	});
});
```

#### RxJS version ####

Using RxJS, we can achieve the same results of an array of all of our values by wrapping the `fs.exists` method using our `Rx.Observable.fromCallback` as it only has one result, a `true` or `false` value instead of the usual callback with error and result.  Then we'll iterate using the `Rx.Observable.for` method, filter the existing files using `filter` and finally, calling `.toArray()` to get our results as an entire array.

```js
var Rx = require('rx'),
	fs = require('fs');

var exists = Rx.Observable.fromCallback(fs.exists);

Rx.Observable
	.for(files, exists)
	.where(function (x) { return !x; })
	.toArray()
	.subscribe(
		function (results) {
			results.forEach(function (result) {
				console.log('exists: ' + result);
			});
		}
	);
```

* * *

## `async.reduce` ##

The `async.reduce` method reduces a list of values into a single value using an async iterator to return each successive step. Memo is the initial state of the reduction. This function only operates in series. For performance reasons, it may make sense to split a call to this function into a parallel map, then use the normal `Array.prototype.reduce` on the results. This function is for situations where each step in the reduction needs to be async, if you can get the data before reducing it then it's probably a good idea to do so.
 
#### async version ####

In this example, we'll determine whether the file exists by calling `fs.exists` for each file given and have the results returned as an array.

```js
var async = require('async'),
	fs = require('fs');

function reduction (acc, x, cb) {
	process.nextTick(function () {
		cb(null, acc + x);
	});
}

async.reduce([1,2,3], 0, fs.reduction, function (err, results) {
    console.log(results);
});

// => 6
```

#### RxJS version ####

In RxJS, we have a number of ways of doing this including using `Rx.Observable.fromArray` to turn an array into observable sequence, then we can call `reduce` to add the numbers.  To ensure that it is indeed async, we can switch to the `Rx.Scheduler.timeout` to ensure that it is done via a callback.

```js
var Rx = require('rx'),
	fs = require('fs');

Rx.Observable
	.fromArray([1,2,3], Rx.Scheduler.timeout)
	.reduce(function (acc, x) { return acc + x; }, 0)
	.subscribe(
		function (results) {
			console.log(results);
		});
// => 6
```

* * *

## `async.detect` ##

The `async.detect` method returns the first value in a list that passes an async truth test. The iterator is applied in parallel, meaning the first iterator to return true will fire the detect callback with that result. 
 
#### async version ####

In this example, we'll get the first file that matches.

```js
var async = require('async'),
	fs = require('fs');

var files = ['file1','file2','file3'];

async.detect(files, fs.exists, function (result){
    // result now equals the first file in the list that exists
});
```

#### RxJS version ####

In RxJS, we can iterate over the files as above using `Rx.Observable.for` and then calling `first` to get the first matching file project forward the file name and whether the file exists.

```js
var Rx = require('rx'),
	fs = require('fs');

var files = ['file1','file2','file3'];

var exists = Rx.Observable.fromCallback(fs.exists);

Rx.Observable
	.for(files, function (file) {
		return { file: file, exists: exists(file) };
	})
	.first(function (x) { return x.exists; })
	.subscribe(
		function (result) {
			// result now equals the first file in the list that exists
		});
```

* * *

## `async.some` ##

The `async.some` method returns `true` if at least one element in the array satisfies an async test. The callback for each iterator call only accepts a single argument of true or false, it does not accept an error argument first! This is in-line with the way node libraries work with truth tests like fs.exists. Once any iterator call returns true, the main callback is immediately called.
 
#### async version ####

In this example, we'll determine whether the file exists by calling `fs.exists` for each file given and have the results returned as an array.

```js
var async = require('async'),
	fs = require('fs');

var files = ['file1.txt', 'file2.txt', 'file3.txt'];

async.some(files, fs.exists, function (result){
    // if result is true then at least one of the files exists
});
```

#### RxJS version ####

Using RxJS, we can achieve the same results of an array of all of our values by wrapping the `fs.exists` method using our `Rx.Observable.fromCallback` as it only has one result, a `true` or `false` value instead of the usual callback with error and result.  Then we'll iterate using the `Rx.Observable.for` method, then call `some` to determine whether any match.

```js
var Rx = require('rx'),
	fs = require('fs');

var exists = Rx.Observable.fromCallback(fs.exists);

Rx.Observable
	.for(files, exists)
	.some()
	.subscribe(
		function (results) {
			// if result is true then at least one of the files exists
		});
```

* * *

## `async.every` ##

The `async.every` method returns `true` if every element in the array satisfies an async test. The callback for each iterator call only accepts a single argument of true or false, it does not accept an error argument first! This is in-line with the way node libraries work with truth tests like fs.exists.
 
#### async version ####

In this example, we'll determine whether the file exists by calling `fs.exists` for each file given and have the results returned as an array.

```js
var async = require('async'),
	fs = require('fs');

var files = ['file1.txt', 'file2.txt', 'file3.txt'];

async.every(files, fs.exists, function (result) {
    // if result is true then every file exists
});
```

#### RxJS version ####

Using RxJS, we can achieve the same results of an array of all of our values by wrapping the `fs.exists` method using our `Rx.Observable.fromCallback` as it only has one result, a `true` or `false` value instead of the usual callback with error and result.  Then we'll iterate using the `Rx.Observable.for` method, then call `every` to determine whether all match.

```js
var Rx = require('rx'),
	fs = require('fs');

var files = ['file1.txt', 'file2.txt', 'file3.txt'];

var exists = Rx.Observable.fromCallback(fs.exists);

Rx.Observable
	.for(files, exists)
	.every()
	.subscribe(
		function (results) {
			// if result is true then every file exists
		});
```

* * *

## `async.concat` ##

The `async.concat` method applies an iterator to each item in a list, concatenating the results. Returns the concatenated list. The iterators are called in parallel, and the results are concatenated as they return.
 
#### async version ####

In this example, we'll determine whether the file exists by calling `fs.exists` for each file given and have the results returned as an array.

```js
var async = require('async'),
	fs = require('fs');

var directories = ['dir1', 'dir2', 'dir3'];

async.concat(files, fs.readdir, function (err, files) {
    // files is now a list of filenames that exist in the 3 directories
});
```

#### RxJS version ####

Using RxJS, we can achieve the same results of an array of all of our values by wrapping the `fs.readdir` method using our `Rx.Observable.fromNodeCallback`.  Then we'll iterate using the `Rx.Observable.for` method, then call `reduce` to add each item to the item to the overall list.

```js
var Rx = require('rx'),
	fs = require('fs');

var readdir = Rx.Observable.fromNodeCallback(fs.readdir);

Rx.Observable
	.for(files, readdir)
	.reduce(function (acc, x) { acc.push(x); return acc; }, [])
	.subscribe(
		function (files) {
			// files is now a list of filenames that exist in the 3 directories
		},
		function (err) {
			// handle error
		});
```

* * *

## `async.whilst` ##

The `async.whilst` method repeatedly call function, while test returns true. Calls the callback when stopped, or an error occurs.
 
#### async version ####

In this example, we'll determine whether the file exists by calling `fs.exists` for each file given and have the results returned as an array.

```js
var async = require('async');

var count = 0;

async.whilst(
    function () { return count < 5; },
    function (callback) {
        count++;
        setTimeout(callback, 1000);
    },
    function (err) {
        // 5 seconds have passed
    }
);
```

#### RxJS version ####

We can achieve the same kind of functionality by using the `Rx.Observable.while` method which takes a condition and an observable sequence that we created by calling `Rx.Observable.create`.

```js
var Rx = require('rx');

var count = 0;

Rx.Observable.while(
		function () { return count < 5; },
		Rx.Observable.create(function (obs) {
			setTimeout(function () {
				observer.onNext(count++);
			}, 1000)
		}
	)
	.subscribe(
		function (x) { /* do something with each value */ },
		function (err) { /* handle errors */ },
		function () { /* 5 seconds have passed }
	);
```

* * *