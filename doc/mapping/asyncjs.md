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
 - [`async.series`](#asyncseries)
 - [`async.parallel`](#asyncparallel)
 - [`async.whilst`](#asyncwhilst)
 - [`async.doWhilst`](#asyncdowhilst)
 - [`async.nextTick`](#asyncnexttick)
 - [`async.waterfall`](#asyncwaterfall)
 - [`async.compose`](#asynccompose)

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

## `async.series` ##

The `async.series` runs an array of functions in series, each one running once the previous function has completed. If any functions in the series pass an error to its callback, no more functions are run and the callback for the series is immediately called with the value of the error. Once the tasks have completed, the results are passed to the final callback as an array.

It is also possible to use an object instead of an array. Each property will be run as a function and the results will be passed to the final callback as an object instead of an array. This can be a more readable way of handling results from async.series.
 
#### async version ####

In this example we'll run some examples with both an array or an object.

```js
var async = require('async');

async.series([
    function(callback){
        // do some stuff ...
        callback(null, 'one');
    },
    function(callback){
        // do some more stuff ...
        callback(null, 'two');
    }
],
// optional callback
function(err, results){
    // results is now equal to ['one', 'two']
});


// an example using an object instead of an array
async.series({
    one: function(callback){
        setTimeout(function(){
            callback(null, 1);
        }, 200);
    },
    two: function(callback){
        setTimeout(function(){
            callback(null, 2);
        }, 100);
    }
},
function(err, results) {
    // results is now equal to: {one: 1, two: 2}
});
```

#### RxJS version ####

We can achieve the same functionality of `async.series` with an array by simply calling fromArray and calling `flatMap` to give us the observable of the current.  Then we'll call `reduce` to add each item to a new array to return. 

```js
var Rx = require('rx');

function wrapArray (items) {
    return Rx.Observable
        .fromArray(items)
        .flatMap(function (x) { return x; })
        .reduce(function (acc, x) {
            var arr = acc.slice(0);
            arr.push(x);
            return arr;
        }, []);
}

wrapArray([
        Rx.Observable.return('one'),
        Rx.Observable.return('two')
    ])
    .subscribe(
        function (results) {
            console.log(results);
        },
        function (err) {
            console.log('Error: ' + err);
        }
    );

// => ['one', 'two']
```

Using an object literal can also be achieved with a little bit more work, but totally reasonable.  Instead of just returning the observable in `flatMap`, we'll add a property to a new object which will contain our key moving forward. Then, we'll call `reduce` much as before, copying the values to a new object, and then plucking the value from each time it comes through and adding it to our final object.

```js
var Rx = require('rx');

function wrapObject (obj) {
    var keys = Object.keys(obj),
        hasOwnProperty = {}.hasOwnProperty;

    return Rx.Observable
        .fromArray(keys)
        .flatMap(function (key) {

            return obj[key].map(function (x) {
                var newObj = {};
                newObj[key] = x;
                return newObj;
            });
        })
        .reduce(function (acc, x) {
            var newObj = {};
            for (var prop in acc) {
                if(!hasOwnProperty.call(acc)) {
                    newObj[prop] = acc[prop];
                }
            }

            var xKey = Object.keys(x)[0];
            newObj[xKey] = x[xKey];

            return newObj;
        }, {});
}

wrapObject({
        one: Rx.Observable.return(1),
        two: Rx.Observable.return(2)
    })
    .subscribe(
        function (results) {
            console.log(results);
        },
        function (err) {
            console.log('Error: ' + err);
        }
    );

// => { one: 1, two: 2 }
```

* * *

## `async.parallel` ##

The `async.parallel` runs an array of functions in parallel, without waiting until the previous function has completed. If any of the functions pass an error to its callback, the main callback is immediately called with the value of the error. Once the tasks have completed, the results are passed to the final callback as an array.

It is also possible to use an object instead of an array. Each property will be run as a function and the results will be passed to the final callback as an object instead of an array. This can be a more readable way of handling results from async.parallel.
 
#### async version ####

In this example we'll run some examples with both an array or an object.

```js
var async = require('async');

async.parallel([
    function(callback){
        setTimeout(function(){
            callback(null, 'one');
        }, 200);
    },
    function(callback){
        setTimeout(function(){
            callback(null, 'two');
        }, 100);
    }
],

// optional callback
function(err, results){
    // the results array will equal ['one','two'] even though
    // the second function had a shorter timeout.
});



// an example using an object instead of an array
async.parallel({
    one: function(callback){
        setTimeout(function(){
            callback(null, 1);
        }, 200);
    },
    two: function(callback){
        setTimeout(function(){
            callback(null, 2);
        }, 100);
    }
},
function(err, results) {
    // results is now equals to: {one: 1, two: 2}
});
```

#### RxJS version ####

We can achieve the same functionality of `async.series` with an array by calling `Rx.Observable.forkJoin` with our array of observable sequences.  This returns the last value from each sequence in "parallel".

```js
var Rx = require('rx');

function wrapArrayParallel (items) {
    return Rx.Observable.forkJoin.apply(null, items);
}

wrapArrayParallel([
        Rx.Observable.return('one'),
        Rx.Observable.return('two')
    ])
    .subscribe(
        function (results) {
            console.log(results);
        },
        function (err) {
            console.log('Error: ' + err);
        }
    );

// => ['one', 'two']
```

Using an object literal can also be achieved with a little bit more work, but totally reasonable.  Instead of simply calling `forkJoin`, we first need to extract the observable sequences by calling `map` on the keys we obtained by `Object.keys`.  Because the order of observable sequences is deterministic, we can then call `map` to transform the array into an object, by calling `reduce` on the array, turning the array into an object with the appropriate keys.

```js
var Rx = require('rx');

function wrapObjectParallel (obj) {
    var keys = Object.keys(obj);
    var mapped = keys.map(function (key) {
        return obj[key];
    });

    return Rx.Observable.forkJoin.apply(null, mapped)
        .map(function (arr) {
            var idx = 0;
            return arr.reduce(function (acc, x) {
                var key = keys[idx++];

                var newObj = {};
                for (var prop in acc) {
                    if(!hasOwnProperty.call(acc)) {
                        newObj[prop] = acc[prop];
                    }
                }

                newObj[key] = x;

                return newObj;                
            }, {})
        });
}

wrapObjectParallel({
        one: Rx.Observable.return(1),
        two: Rx.Observable.return(2)
    })
    .subscribe(
        function (results) {
            console.log(results);
        },
        function (err) {
            console.log('Error: ' + err);
        }
    );

// => { one: 1, two: 2 }
```

* * *

## `async.whilst` ##

The `async.whilst` method repeatedly call function, while test returns true. Calls the callback when stopped, or an error occurs.
 
#### async version ####

In this example we'll just run a keep calling the callback while the count is less than 5.

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
        function () { /* 5 seconds have passed */ }
    );
```

* * *

## `async.doWhilst` ##

The `async.doWhilst` method is a post check version of `whilst`. To reflect the difference in the order of operations test and fn arguments are switched. `doWhils`t is to `whilst` as `do while` is to `while` in plain JavaScript.
 
#### async version ####

In this example we'll just run a keep calling the callback while the count is less than 5.

```js
var async = require('async');

var count = 0;

async.dowWilst(
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

We can achieve the same kind of functionality by using the `doWhile` on our observable sequence which takes a predicate to determine whether to continue running.

```js
var Rx = require('rx');

var i = 0;

var source = Rx.Observable.return(42).doWhile(
    function () { return ++i < 2; })
    .subscribe(
        function (x) { console.log(x); },
        function (err) { /* handle errors */ },
        function () { console.log('done'); }
    );
```

* * *

## `async.nextTick` ##

The `async.nextTick` method calls the callback on a later loop around the event loop. In node.js this just calls process.nextTick, in the browser it falls back to setImmediate(callback) if available, otherwise setTimeout(callback, 0), which means other higher priority events may precede the execution of the callback.
 
#### async version ####

In this example we'll just run a keep calling the callback while the count is less than 5.

```js
var async = require('async');

var call_order = [];

async.nextTick( function () {
    call_order.push('two');
    // call_order now equals ['one','two']
});

call_order.push('one');
```

#### RxJS version ####

We can achieve the same thing by using the `Rx.Scheduler.timeout` scheduler to schedule an item which will optimize for the runtime, for example, using `process.nextTick` if available, or `setImmediate` if available, or other fallbacks like `MessageChannel`, `postMessage` or even an async script load.

```js
var Rx = require('rx');

var call_order = [];

Rx.Scheduler.timeout.schedule(function () {
    call_order.push('two');
    // call_order now equals ['one','two']
});

call_order.push('one');
```

* * *

## `async.waterfall` ##

The `async.waterfall` method runs an array of functions in series, each passing their results to the next in the array. However, if any of the functions pass an error to the callback, the next function is not executed and the main callback is immediately called with the error.
 
#### async version ####

In this example, we'll check whether a file exists, then rename it and finally return its [stats](http://nodejs.org/api/fs.html#fs_class_fs_stats).

```js
var async = require('async'),
    fs = require('fs'),
    path = require('path');

// Get file and destination
var file = path.join(__dirname, 'file.txt'),
    dest = path.join(__dirname, 'file1.txt');

async.waterfall([
    function (callback) {
        fs.exists(file, function (flag) {
            if (flag) {
                callback(new Error('File does not exist.'))
            } else {
                callback(null);
            }
        });
    },
    function (callback) {
        fs.rename(file, dest, function (err) {
            callback(err);
        });
    },
    function (callback) {
        fs.stat(dest, function (err, fsStat) {
            callback(err, fsStat);
        });
    }
], function (err, fsStat) {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(fsStat));
    }
})
```

#### RxJS version ####

We can easily accomplish the same task as above using our wrappers for `Rx.Observable.fromCallback` and `Rx.Observable.fromNodeCallback`, creating a waterfall-like method.  First, let's implement a `waterfall` method using plain RxJS in which we enumerate the functions and call `flatMapLatest` on each resulting observable sequence to ensure we only get one value.

```js
var Rx = require('rx');

var async = {
    waterfall: function (series) {
        return Rx.Observable.defer(function () {
            var acc = series[0]();
            for (var i = 1, len = series.length; i < len; i++) {

                // Pass in func to deal with closure capture
                (function (func) {

                    // Call flatMapLatest on each function
                    acc = acc.flatMapLatest(function (x) {
                        return func(x);
                    });
                }(series[i]));
            }

            return acc; 
        });
    }
}
```

Once we've defined this method, we can now use it such as the following, wrapping `fs.exists`, `fs.rename` and `fs.stat`.

```js
var Rx = require('rx'),
    fs = require('fs'),
    path = require('path');

var file = path.join(__dirname, 'file.txt'),
    dest = path.join(__dirname, 'file1.txt'),
    exists = Rx.Observable.fromCallback(fs.exists),
    rename = Rx.Observable.fromNodeCallback(fs.rename),
    stat = Rx.Observable.fromNodeCallback(fs.stat);

var obs = async.waterfall([
    function () {
        return exists(file);
    },
    function (flag) {
        // Rename or throw computation
        return flag ?
            rename(file, dest) :
            Rx.Observable.throw(new Error('File does not exist.'));
    },
    function () {
        return stat(dest);
    }
]);

// Now subscribe to get the results or error
obs.subscribe(
    function (fsStat) {
        console.log(JSON.stringify(fsStat));
    },
    function (err) {
        console.log(err);
    }
);
```

* * *

## `async.compose` ##

The [`async.compose`](https://github.com/caolan/async#composefn1-fn2) method creates a function which is a composition of the passed asynchronous functions. Each function consumes the return value of the function that follows. Composing functions f(), g() and h() would produce the result of f(g(h())), only this version uses callbacks to obtain the return values.

Each function is executed with the `this` binding of the composed function.
 
#### async version ####

In this example, we'll chain together two functions, one to add 1 to a supplied argument, and then chain it to another to multiply the result by 3.

```js
var async = require('async');

function add1(n, callback) {
    setTimeout(function () {
        callback(null, n + 1);
    }, 10);
}

function mul3(n, callback) {
    setTimeout(function () {
        callback(null, n * 3);
    }, 10);
}

var add1mul3 = async.compose(mul3, add1);

add1mul3(4, function (err, result) {
   console.log(result);
});

// => 15
```

#### RxJS version ####

Using RxJS, we can accomplish this using the usual composition operator `selectMany` or `flatMap`.  We'll wrap the `setTimeout` with a `wrapTimeout` method and ensure that we do deterministic cleanup via `clearTimeout`.  Then we can compose together our `add1` and `mul3` functions which result in observable sequences.

```js
var Rx = require('rx');

function wrapTimeout (fn, arg) {
    return Rx.Observable.create(function (obs) {

        // Ensure the composition of the this argument
        var id = setTimeout(function () {
            obs.onNext(fn.call(fn, arg));
            obs.onCompleted();
        }, 10);

        // Handle cleanup/early disposal
        return function () {
            clearTimeout(id);
        };
    });
}

function add1 (n) {
    return wrapTimeout(function (x) { return x + 1; }, n);
}

function mul3 (n) {
    return wrapTimeout(function (x) { return x * 3; }, n);
}

add1(4)
    .flatMap(mul3)
    .subscribe(
        function (x) {
            console.log(x);
        },
        function (err) {
            console.log('Error: ' + e);
        });
// => 15
```

* * *