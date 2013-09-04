# Observable object #

The Observable object represents a push based collection.

The Observer and Objects interfaces provide a generalized mechanism for push-based notification, also known as the observer design pattern. The Observable object represents the object that sends notifications (the provider); the Observer object represents the class that receives them (the observer). 

<!-- div -->

## `Observable Methods`
- [`amb`](#amb1)
- [`case | switchCase`](#case)
- [`catch | catchException`](#catch1)
- [`concat`](#concat1)
- [`create`](#create)
- [`createWithDisposable`](#createWithDisposable)
- [`defer`](#defer)
- [`empty`](#empty)
- [`for | forIn`](#for)
- [`forkJoin`](#forkJoin1)
- [`fromArray`](#fromArray)
- [`generate`](#generate)
- [`generateWithAbsoluteTime`](#generateWithAbsoluteTime)
- [`generateWithRelativeTime`](#generateWithRelativeTime)
- [`if | ifThen`](#if)
- [`interval`](#interval)
- [`merge`](#merge1)
- [`never`](#never)
- [`onErrorResumeNext`](#onErrorResumeNext1)
- [`range`](#range)
- [`repeat`](#repeat1)
- [`return | returnValue`](#return)
- [`start`](#start)
- [`timer`](#timer)
- [`toAsync`](#toAsync)
- [`when`](#when)
- [`while | whileDo`](#while)


<!-- div -->


<!-- div -->

## `Observable Instance Methods`
- [`aggregate`](#aggregate)
- [`all`](#all)
- [`amb`](#amb2)
- [`and`](#and)
- [`any`](#any)
- [`asObservable`](#asObservable)
- [`average`](#average)
- [`buffer`](#buffer)
- [`bufferWithCount`](#bufferWithCount)
- [`bufferWithTime`](#bufferWithTime)
- [`bufferWithTimeOrCount`](#bufferWithTimeOrCount)
- [`catch | catchException`](#catch2)
- [`combineLatest`](#combineLatest)
- [`concat`](#concat2)
- [`contains`](#contains)
- [`count`](#count)
- [`defaultIfEmpty`](#defaultIfEmpty)
- [`delay`](#delay)
- [`dematerialize`](#dematerialize)
- [`distinct`](#distinct)
- [`distinctUntilChanged`](#distinctUntilChanged)
- [`do | doAction`](#do)
- [`doWhile`](#doWhile)
- [`elementAt`](#elementAt)
- [`elementAtOrDefault`](#elementAtOrDefault)
- [`every`](#every)
- [`expand`](#expand)
- [`filter`](#filter)
- [`finally | finallyAction`](#finally)
- [`first`](#first)
- [`firstOrDefault`](#firstOrDefault)
- [`forkJoin`](#forkJoin2)
- [`groupBy`](#groupBy)
- [`groupByUntil`](#groupByUntil)
- [`groupJoin`](#groupJoin)
- [`ignoreElements`](#ignoreElements)
- [`isEmpty`](#isEmpty)
- [`join`](#join)
- [`last`](#first)
- [`lastOrDefault`](#lastOrDefault)
- [`manySelect`](#manySelect)
- [`map`](#max)
- [`max`](#max)
- [`maxBy`](#maxBy)
- [`merge`](#merge2)
- [`mergeObservable`](#mergeObservable)
- [`min`](#min)
- [`minBy`](#minBy)
- [`multicast`](#multicast)
- [`observeOn`](#observeOn)
- [`onErrorResumeNext`](#onErrorResumeNext2)
- [`publish`](#publish)
- [`publishLast`](#publishLast)
- [`publishValue`](#publishValue)
- [`refCount`](#refCount)
- [`reduce`](#reduce)
- [`repeat`](#repeat2)
- [`replay`](#replay)
- [`retry`](#retry)
- [`sample`](#sample)
- [`scan`](#scan)
- [`select`](#select)
- [`selectMany`](#selectMany)
- [`single`](#single)
- [`singleOrDefault`](#singleOrDefault)
- [`skip`](#skip)
- [`skipLast`](#skipLast)
- [`skipUntil`](#skipUntil)
- [`skipWhile`](#skipWhile)
- [`some`](#some)
- [`startWith`](#startWith)
- [`subscribe`](#subscribe)
- [`subscribeOn`](#subscribeOn)
- [`sum`](#sum)
- [`switch`](#switch)
- [`take`](#take)
- [`takeLast`](#takeLast)
- [`takeLastBuffer`](#takeLastBuffer)
- [`takeUntil`](#takeUntil)
- [`takeWhile`](#takeWhile)
- [`throttle`](#throttle)
- [`throwException`](#throwException)
- [`timeInterval`](#timeInterval)
- [`timeout`](#timeout)
- [`toArray`](#toArray)
- [`using`](#using)
- [`where`](#where)
- [`window`](#window)
- [`windowWithCount`](#windowWithCount)
- [`windowWithTime`](#windowWithTime)
- [`windowWithTimeOrCount`](#windowWithTimeOrCount)
- [`zip`](#zip)

## _Observable Methods_ ##

### <a id="amb1"></a>`Rx.Observable.amb(...)`
<a href="#amb1">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2862-L2872 "View in source") [&#x24C9;][1]

Propagates the observable sequence that reacts first.

#### Arguments
1. `array` *(Array|arguments)*: Observable sources competing to react first either as an array or arguments.

#### Returns
*(Observable)*: An observable sequence that surfaces any of the given sequences, whichever reacted first.

#### Example
```js
var source = Rx.Observable.amb(
	Rx.Observable.timer(500).select(function () { return 'foo'; }),
	Rx.Observable.timer(200).select(function () { return 'bar'; })
);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: bar
// => Completed
```

### Location

- rx.js

* * *

### <a id="case"></a>`Rx.Observable.case(selector, sources, [elseSource|scheduler])`
<a href="#case">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L159-L169 "View in source") [&#x24C9;][1]

Uses selector to determine which source in sources to use.  There is an alias 'switchCase' for browsers <IE9.

### Arguments
1. `selector` *(Function)*: The function which extracts the value for to test in a case statement.
2. `sources` *(Object)*: A object which has keys which correspond to the case statement labels.
3. `[elseSource|scheduler]` *(Observable|Scheduler)*: The observable sequence that will be run if the sources are not matched. If this is not provided, it defaults to `Rx.Observabe.empty` with the specified scheduler.

#### Returns
*(Observable)*: An observable sequence which is determined by a case statement. 

#### Example
```js
var sources = {
	'foo': Rx.Observable.return(42),
	'bar': Rx.Observable.return(56)
};

var defaultSource = Rx.Observable.empty();

var source = Rx.Observable.case(
	function () {
		return 'foo';
	},
	sources,
	defaultSource);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

//=> Next: 42 
//=> Completed 
```

### Location

- rx.experimental.js

* * *

### <a id="catch1"></a>`Rx.Observable.catch(...)`
<a href="#catch1">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2920-L2923 "View in source") [&#x24C9;][1]

Continues an observable sequence that is terminated by an exception with the next observable sequence.  There is an alias for this method `catchException` for browsers <IE9

#### Arguments
1. `array` *(Array|arguments)*: Observable sequences to catch exceptions for.

#### Returns
*(Observable)*: An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.

#### Example
```js
var obs1 = Rx.Observable.throw(new Error('error'));
var obs2 = Rx.Observable.return(42);

var source = Rx.Observable.catc(obs1, obs2);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Completed
```

### Location

- rx.js

* * *

### <a id="concat1"></a>`Rx.Observable.concat(...)`
<a href="#concat1">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3035-L3038 "View in source") [&#x24C9;][1]

Concatenates all of the specified observable sequences, as long as the previous observable sequence terminated successfully.

#### Arguments
1. `array` *(Array|arguments)*: Observable sequences to concatenate.

#### Returns
*(Observable)*: An observable sequence that contains the elements of each given sequence, in sequential order.

#### Example
```js
var source1 = Rx.Observable.returnValue(42);
var source2 = Rx.Observable.returnValue(56);

var source = Rx.Observable.concat(source1, source2);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Next: 56
// => Completed
```

### Location

- rx.js

* * *

### <a id="create"></a>`Rx.Observable.create(subscribe)`
<a href="#create">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2519-L2523 "View in source") [&#x24C9;][1]

Creates an observable sequence from a specified subscribe method implementation.

#### Arguments
1. `subscribe` *(Function)*: Implementation of the resulting observable sequence's subscribe method, optionally returning a function that will be wrapped in a disposable object.

#### Returns
*(Observable)*: The observable sequence with the specified implementation for the subscribe method.

#### Example
```js
var source = Rx.Observable.create(function (observer) {
	observer.onNext(42);
	observer.onCompleted();

	// Note that this is optional, you do not have to return this if you require no cleanup
	return function () {
		console.log('disposed');
	};
});

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Completed

subscription.dispose();

// => disposed
```

### Location

- rx.js

* * *

### <a id="createWithDisposable"></a>`Rx.Observable.createWithDisposable(subscribe)`
<a href="#createWithDisposable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2535-L2537 "View in source") [&#x24C9;][1]

Creates an observable sequence from a specified Subscribe method implementation.

#### Arguments
1. `subscribe` *(Function)*: Implementation of the resulting observable sequence's subscribe method.

#### Returns
*(Observable)*: The observable sequence with the specified implementation for the subscribe method.

#### Example
```js
var source = Rx.Observable.createWithDisposable(function (observer) {
	observer.onNext(42);
	observer.onCompleted();

	return Rx.Disposable.create(function () {
		// Any cleanup that is required
		console.log('disposed');
	});
});

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Completed

subscription.dispose();

// => disposed
```

### Location

- rx.js

* * *

### <a id="defer"></a>`Rx.Observable.defer(observableFactory)`
<a href="#defer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2549-L2559 "View in source") [&#x24C9;][1]

Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.

#### Arguments
1. `observableFactory` *(Function)*: Observable factory function to invoke for each observer that subscribes to the resulting sequence.

#### Returns
*(Observable)*: An observable sequence whose observers trigger an invocation of the given observable factory function.

#### Example
```js
var source = Rx.Observable.defer(function () {
	return Rx.Observable.returnValue(42);
});

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Completed
```

### Location

- rx.js

* * *

### <a id="empty"></a>`Rx.Observable.empty([scheduler])`
<a href="#empty">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2549-L2559 "View in source") [&#x24C9;][1]

Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.

#### Arguments
1. `[scheduler=Rx.Scheduler.immediate]` *(Scheduler)*: Scheduler to send the termination call on.

#### Returns
*(Observable)*: An observable sequence with no elements.

#### Example
```js
var source = Rx.Observable.empty();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Completed
```

### Location

- rx.js

* * *

### <a id="for"></a>`Rx.Observable.for(sources, resultSelector)`
<a href="#for">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2549-L2559 "View in source") [&#x24C9;][1]

Concatenates the observable sequences obtained by running the specified result selector for each element in source.
There is an alias for this method called `forIn` for browsers <IE9

#### Arguments
1. `sources` *(Array)*: An array of values to turn into an observable sequence.
2. `resultSelector` *(Function)*: A function to apply to each item in the sources array to turn it into an observable sequence.

#### Returns
*(Observable)*: An observable sequence from the concatenated observable sequences.  

#### Example
```js
var array = [1, 2, 3];

var source = Rx.Observable.for(
	array,
	function (x) {
		return Rx.Observable.returnValue(x);
	});

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 1
// => Next: 2
// => Next: 3
// => Completed
```

### Location

- rx.experimental.js

* * *

### <a id="forkJoin"></a>`Rx.Observable.forkJoin(...)`
<a href="#for">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") [&#x24C9;][1]

Runs all observable sequences in parallel and collect their last elements.

#### Arguments
1. `sources` *(Array)*: An array or arguments of Observable sequences to collect the last elements for.

#### Returns
*(Observable)*: An observable sequence with an array collecting the last elements of all the input sequences.

#### Example
```js
var source = Rx.Observable.forkJoin(
	Rx.Observable.return(42),
	Rx.Observable.range(0, 10),
	Rx.Observable.fromArray([1,2,3])
);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: [42, 9, 3]
// => Completed
```

### Location

- rx.experimental.js

* * *

### <a id="fromArray"></a>`Rx.Observable.fromArray(array, [scheduler])`
<a href="#fromArray">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") [&#x24C9;][1]

Converts an array to an observable sequence, using an optional scheduler to enumerate the array.

#### Arguments
1. `array` *(Array)*: An array to convert to an Observable sequence.
2. `[scheduler=Rx.Scheduler.currentThread]` *(Scheduler)*: Scheduler to run the enumeration of the input sequence on.

#### Returns
*(Observable)*: The observable sequence whose elements are pulled from the given enumerable sequence.

#### Example
```js
var array = [1,2,3];

var source = Rx.Observable.fromArray(array);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 1
// => Next: 2
// => Next: 3
// => Completed
```

### Location

- rx.js

* * *

### <a id="generate"></a>`Rx.Observable.generate(initialState, condition, iterate, resultSelector, [scheduler])`
<a href="#generate">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") [&#x24C9;][1]

Converts an array to an observable sequence, using an optional scheduler to enumerate the array.

#### Arguments
1. `initialState` *(Any)*: Initial state.
2. `condition` *(Function)*: Condition to terminate generation (upon returning false).
3. `iterate` *(Function)*: Iteration step function.
4. `resultSelector` *(Function)*: Selector function for results produced in the sequence.
5. `[scheduler=Rx.Scheduler.currentThread]` *(Scheduler)*: Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.currentThread.

#### Returns
*(Observable)*: The generated sequence.

#### Example
```js
var source = Rx.Observable.generate(
	0,
	function (x) { return x < 3; },
	function (x) { return x + 1; },
	function (x) { return x; }
);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0
// => Next: 1
// => Next: 2
// => Completed
```

### Location

- rx.js

* * *

### <a id="generateWithAbsoluteTime"></a>`Rx.Observable.generateWithAbsoluteTime(initialState, condition, iterate, resultSelector, timeSelector, [scheduler])`
<a href="#generate">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") [&#x24C9;][1]

Generates an observable sequence by iterating a state from an initial state until the condition fails.

#### Arguments
1. `initialState` *(Any)*: Initial state.
2. `condition` *(Function)*: Condition to terminate generation (upon returning false).
3. `iterate` *(Function)*: Iteration step function.
4. `resultSelector` *(Function)*: Selector function for results produced in the sequence.
5. `timeSelector` *(Function)*: Time selector function to control the speed of values being produced each iteration, returning Date values.
6. `[scheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.timeout.

#### Returns
*(Observable)*: The generated sequence.

#### Example
```js
// Generate a value with an absolute time with an offset of 100ms multipled by value 
var source = Rx.Observable.generate(
	1,
	function (x) { return x < 4; },
	function (x) { return x + 1; },
	function (x) { return x; },
	function (x) { return Date.now() + (100 * x); }
).timeInterval();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: {value: 1, interval: 100}
// => Next: {value: 2, interval: 200}
// => Next: {value: 3, interval: 300}
// => Completed
```

### Location

- rx.time.js

* * *

### <a id="generateWithRelativeTime"></a>`Rx.Observable.generateWithRelativeTime(initialState, condition, iterate, resultSelector, timeSelector, [scheduler])`
<a href="#generate">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") [&#x24C9;][1]

Generates an observable sequence by iterating a state from an initial state until the condition fails.

#### Arguments
1. `initialState` *(Any)*: Initial state.
2. `condition` *(Function)*: Condition to terminate generation (upon returning false).
3. `iterate` *(Function)*: Iteration step function.
4. `resultSelector` *(Function)*: Selector function for results produced in the sequence.
5. `timeSelector` *(Function)*: Time selector function to control the speed of values being produced each iteration, returning integer values denoting milliseconds.
6. `[scheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.timeout.

#### Returns
*(Observable)*: The generated sequence.

#### Example
```js
// Generate a value with an absolute time with an offset of 100ms multipled by value 
var source = Rx.Observable.generate(
	1,
	function (x) { return x < 4; },
	function (x) { return x + 1; },
	function (x) { return x; },
	function (x) { return 100 * x; }
).timeInterval();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: {value: 1, interval: 100}
// => Next: {value: 2, interval: 200}
// => Next: {value: 3, interval: 300}
// => Completed
```

### Location

- rx.time.js

* * *

### <a id="if"></a>`Rx.Observable.if(condition, thenSource, [elseSource])`
<a href="#if">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") [&#x24C9;][1]

Determines whether an observable collection contains values. There is an alias for this method called `ifThen` for browsers <IE9

#### Arguments
1. `condition` *(Function)*: The condition which determines if the thenSource or elseSource will be run.
2. `thenSource` *(Observable)*: thenSource The observable sequence that will be run if the condition function returns true.
3. `[elseSource]` *(Observable|Scheduler)*: The observable sequence that will be run if the condition function returns false. If this is not provided, it defaults to Rx.Observabe.Empty with the specified scheduler.

#### Returns
*(Observable)*: The generated sequence.

#### Example
```js
// This uses and only then source
var shouldRun = true;

var source = Rx.Observable.if(
	function () { return shouldRun; },
	Rx.Observable.return(42)
);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Completed

// The next example uses an elseSource
var shouldRun = false;

var source = Rx.Observable.if(
	function () { return shouldRun; },
	Rx.Observable.return(42),
	Rx.Observable.return(56)
);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 56
// => Completed
```

### Location

- rx.experimental.js

* * *

### <a id="interval"></a>`Rx.Observable.interval(period, [scheduler])`
<a href="#interval">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") [&#x24C9;][1]

Returns an observable sequence that produces a value after each period.

#### Arguments
1. `period` *(Number)*: Period for producing the values in the resulting sequence (specified as an integer denoting milliseconds).
2. `[scheduler]` *(Scheduler=Rx.Scheduler.timeout)*: Scheduler to run the timer on. If not specified, Rx.Scheduler.timeout is used.

#### Returns
*(Observable)*: An observable sequence that produces a value after each period.

#### Example
```js
var source = Rx.Observable
    .interval(500 /* ms */)
    .timeInterval()
    .take(3);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: {value: 0, interval: 500}
// => Next: {value: 1, interval: 500}
// => Next: {value: 2, interval: 500} 
// => Completed
```

### Location

- rx.time.js

* * *

### <a id="merge1"></a>`Rx.Observable.merge([scheduler], ...)`
<a href="#merge1">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") [&#x24C9;][1]

Merges all the observable sequences into a single observable sequence.  

#### Arguments
1. `[scheduler]` *(Scheduler=Rx.Scheduler.timeout)*: Scheduler to run the timer on. If not specified, Rx.Scheduler.immediate is used.
1. `sources` *(Array|arguments)*: Observable sequences to merge into a single sequence.

#### Returns
*(Observable)*: An observable sequence that produces a value after each period.

#### Example
```js
var source1 = Rx.Observable.interval(100)
    .timeInterval()
    .pluck('interval');
var source2 = Rx.Observable.interval(150)
    .timeInterval()
    .pluck('interval');

var source = Rx.Observable.merge(
    source1,
    source2);


var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 100
// => Next: 150
// => Next: 100
// => Next: 150
// => Next: 100 
// => Completed
```

### Location

- rx.js

* * *

### <a id="never"></a>`Rx.Observable.never()`
<a href="#never">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") [&#x24C9;][1]

Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins). 

#### Returns
*(Observable)*: An observable sequence whose observers will never get called.

#### Example
```js
// This will never produce a value, hence never calling any of the callbacks
var source = Rx.Observable.never();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });
```

### Location

- rx.js

* * *

### <a id="onErrorResumeNext"></a>`Rx.Observable.onErrorResumeNext(...)`
<a href="#onErrorResumeNext">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") [&#x24C9;][1]

Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.

### Arguments
1. `array` *(Array|arguments)*: Observable sequences to concatenate.

#### Returns
*(Observable)*: An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally. 

#### Example
```js
var source1 = Rx.Observable.throw(new Error('error 1'));
var source2 = Rx.Observable.throw(new Error('error 2'));
var source3 = Rx.Observable.return(42);

var source = Rx.Observable.onErrorResumeNext(source1, source2, source3);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Completed 
```

### Location

- rx.js

* * *

### <a id="range"></a>`Rx.Observable.range(start, count, [scheduler])`
<a href="#range">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") [&#x24C9;][1]

Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.

### Arguments
1. `start` *(Number)*: The value of the first integer in the sequence.
2. `count` *(Number)*: The number of sequential integers to generate.
3. `[scheduler=Rx.Scheduler.currentThread]` *(Scheduler)*: Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.

#### Returns
*(Observable)*: An observable sequence that contains a range of sequential integral numbers. 

#### Example
```js
var source = Rx.Observable.range(0, 3);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0 
// => Next: 1
// => Next: 2 
// => Completed 
```

### Location

- rx.js

* * *

### <a id="repeat"></a>`Rx.Observable.repeat(value, [repeatCount], [scheduler])`
<a href="#repeat">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") [&#x24C9;][1]

Generates an observable sequence that repeats the given element the specified number of times, using the specified scheduler to send out observer messages.

### Arguments
1. `value` *(Any)*: Element to repeat.
2. `[repeatCount=-1]` *(Number)*:Number of times to repeat the element. If not specified, repeats indefinitely.
3. `[scheduler=Rx.Scheduler.immediate]` *(Scheduler)*: Scheduler to run the producer loop on. If not specified, defaults to Scheduler.immediate.

#### Returns
*(Observable)*: An observable sequence that repeats the given element the specified number of times.

#### Example
```js
var source = Rx.Observable.repeat(42, 3);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

//=> Next: 42 
// => Next: 42
// => Next: 42
// => Completed 
```

### Location

- rx.js

* * *

### <a id="return"></a>`Rx.Observable.return(value, [scheduler])`
<a href="#return">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") [&#x24C9;][1]

Returns an observable sequence that contains a single element, using the specified scheduler to send out observer messages.
There is an alias called `returnValue` for browsers <IE9.

### Arguments
1. `value` *(Any)*: Single element in the resulting observable sequence.
2. `[scheduler=Rx.Scheduler.immediate]` *(Scheduler)*: Scheduler to send the single element on. If not specified, defaults to Scheduler.immediate.

#### Returns
*(Observable)*: An observable sequence that repeats the given element the specified number of times.

#### Example
```js
var source = Rx.Observable.return(42);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42 
// => Completed 
```

### Location

- rx.js

* * *

### <a id="start"></a>`Rx.Observable.start(func, [scheduler], [context])`
<a href="#start">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2639-L2641 "View in source") [&#x24C9;][1]

Invokes the specified function asynchronously on the specified scheduler, surfacing the result through an observable sequence.

### Arguments
1. `func` *(Function)*: Function to run asynchronously.
2. `[scheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
3. `[context]` *(Any)*: The context for the func parameter to be executed.  If not specified, defaults to undefined.

#### Returns
*(Observable)*: An observable sequence exposing the function's result value, or an exception.

#### Example
```js
var context = { value: 42 };

var source = Rx.Observable.start(
	function () {
		return this.value; 
	}, 
	Rx.Scheduler.timeout, 
	context
);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42 
// => Completed 
```

### Location

- rx.js

* * *

### <a id="timer"></a>`Rx.Observable.timer(dueTime, [period], [scheduler])`
<a href="#timer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L133-L152 "View in source") [&#x24C9;][1]

Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.

### Arguments
1. `dueTime` *(Date|Number)*: Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
2. `[period|scheduler=Rx.Scheduler.timeout]` *(Number|Scheduler)*: Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
3. `[scheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler to run the timer on. If not specified, the timeout scheduler is used.

#### Returns
*(Observable)*: An observable sequence that produces a value after due time has elapsed and then each period.

#### Example
```js
var source = Rx.Observable.timer(200, 100)
	.pluck('interval')
	.take(3);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 200
// => Next: 100
// => Next: 100
// => Completed 
```

### Location

- rx.time.js

* * *

### <a id="toAsync"></a>`Rx.Observable.toAsync(func, [scheduler], [context])`
<a href="#timer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2656-L2673 "View in source") [&#x24C9;][1]

Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.

### Arguments
1. `func` *(Function)*: Function to convert to an asynchronous function.
2. `[scheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
3. `[context]` *(Any)*: The context for the func parameter to be executed.  If not specified, defaults to undefined.

#### Returns
*(Function)*: Asynchronous function.

#### Example
```js
var func = Rx.Observable.async(function (x, y) {
	return x + y;
});

// Execute function with 3 and 4
var source = func(3, 4);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 7
// => Completed 
```

### Location

- rx.js

* * *

### <a id="when"></a>`Rx.Observable.when(...)`
<a href="#when">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.joinpatterns.js#L366-L152 "View in source") [&#x24C9;][1]

A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.

### Arguments
1. `plans` *(arguments|Array)*: A series of plans (specified as an Array of as a series of arguments) created by use of the then operator on patterns.

#### Returns
*(Observable)*: Observable sequence with the results form matching several patterns. 

#### Example
```js
// Choice of either plan, the first set of timers or second set
var source = Rx.Observable.when(
	Rx.Observable.timer(200).and(Rx.Observable.timer(300)).then(function (x, y) { return 'first'; }),
	Rx.Observable.timer(400).and(Rx.Observable.timer(500)).then(function (x, y) { return 'second'; }),
);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: first
// => Completed 
```

### Location

- rx.joinpatterns.js

* * *

### <a id="while"></a>`Rx.Observable.while(condition, source)`
<a href="#while">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L126-L128 "View in source") [&#x24C9;][1]

Repeats source as long as condition holds emulating a while loop.  There is an alias for this method called 'whileDo' for browsers <IE9.

### Arguments
1. `condition` *(Function)*: The condition which determines if the source will be repeated.
2. `source` *(Observable)*: The observable sequence that will be run if the condition function returns true.

#### Returns
*(Observable)*: An observable sequence which is repeated as long as the condition holds. 

#### Example
```js
var i = 0;

// Repeat until condition no longer holds
var source = Rx.Observable.while(
	function () { ++i < 3 },
	Rx.Observable.return(42)
);


var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Next: 42
// => Next: 42
// => Completed 
```

### Location

- rx.joinpatterns.js

* * *

## _Observable Instance Methods_ ##

### <a id="aggregate"></a>`Rx.Observable.prototype.aggregate([seed], accumulator)`
<a href="#aggregate">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L102-L112 "View in source") [&#x24C9;][1]

 Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
 For aggregation behavior with incremental intermediate results, see Observable.scan.

#### Arguments
1. `[seed]` *(Mixed)*: The initial accumulator value.
2. `accumulator` *(Function)*: accumulator An accumulator function to be invoked on each element.

#### Returns
*(Observable)*: An observable sequence containing a single element with the final accumulator value.

#### Example
```js
// Using a seed for the accumulate
var source = Rx.Observable.range(1, 10).aggregate(1, function (acc, x) {
	return acc * x;
});

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 3628800
// => Completed 

// Without a seed
var source = Rx.Observable.range(1, 10).aggregate(function (acc, x) {
	return acc + x;
});

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 55
// => Completed     
```

#### Location

- rx.aggregates.js

* * *

### <a id="all"></a>`Rx.Observable.prototype.all(predicate, [thisArg])`
<a href="#all">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L179-L185 "View in source") [&#x24C9;][1]

Determines whether all elements of an observable sequence satisfy a condition.  There is an alias for this method called `every`.

#### Arguments
1. `predicate` *(Function)*: A function to test each element for a condition.
2. `[thisArg]` *(Function)*: Object to use as this when executing callback.

#### Returns
*(Observable)*: An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.

#### Example
```js
var source = Rx.Observable.fromArray([1,2,3,4,5])
	.all(function (x) {
		return x < 6;
	});

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: true
// => Completed    
```

#### Location

- rx.aggregates.js

* * *

### <a id="amb"></a>`Rx.Observable.prototype.amb(rightSource)`
<a href="#amb">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2996-L3055 "View in source") [&#x24C9;][1]

Propagates the observable sequence that reacts first.

#### Arguments
1. `rightSource` *(Observable)*: Second observable sequence.

#### Returns
*(Observable)*: An observable sequence that surfaces either of the given sequences, whichever reacted first.

#### Example
```js
var first = Rx.Observable.timer(300).map(function () { return 'first'; });
var second = Rx.Observable.timer(500).map(function () { return 'second'; });

var source = first.amb(second);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: first
// => Completed    
```

#### Location

- rx.js

* * *

### <a id="and"></a>`Rx.Observable.prototype.and(rightSource)`
<a href="#and">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.joinpatterns.js#L346-L348 "View in source") [&#x24C9;][1]

Propagates the observable sequence that reacts first.

#### Arguments
1. `right` *(Observable)*: Observable sequence to match with the current sequence.

#### Returns
*(Pattern)*: Pattern object that matches when both observable sequences have an available value.  

#### Example
```js
// Choice of either plan, the first set of timers or second set
var source = Rx.Observable.when(
	Rx.Observable.timer(200).and(Rx.Observable.timer(300)).then(function (x, y) { return 'first'; }),
	Rx.Observable.timer(400).and(Rx.Observable.timer(500)).then(function (x, y) { return 'second'; }),
);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: first
// => Completed 
```

#### Location

- rx.joinpatterns.js

* * *

### <a id="any"></a>`Rx.Observable.prototype.any([predicate], [thisArg])`
<a href="#any">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L144-L157 "View in source") [&#x24C9;][1]

Determines whether any element of an observable sequence satisfies a condition if present, else if any items are in the sequence.

#### Arguments
1. `[predicate]` *(Function)*: A function to test each element for a condition.
2. `[thisArg]` *(Any)*: Object to use as this when executing callback.

#### Returns
*(Observable)*: An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate. 

#### Example
```js
// Without a predicate
var source = Rx.Observable.empty().any();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: false
// => Completed 

// With a predicate
var source = Rx.Observable.fromArray([1,2,3,4,5])
	.any(function (x) { return x % 2 === 0; });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: true
// => Completed 
```

#### Location

- rx.aggregates.js

* * *

### <a id="asObservable"></a>`Rx.Observable.prototype.asObservable()`
<a href="#asObservable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3675-L3680 "View in source") [&#x24C9;][1]

Hides the identity of an observable sequence.

#### Returns
*(Observable)*: An observable sequence that hides the identity of the source sequence.  

#### Example
```js
// Create subject
var subject = new Rx.AsyncSubject();

// Send a value
subject.onNext(42);
subject.onCompleted();

// Hide its type
var source = subject.asObservable();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Completed 
```

#### Location

- rx.js

* * *

### <a id="average"></a>`Rx.Observable.prototype.average([selector])`
<a href="#asObservable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L313-L327 "View in source") [&#x24C9;][1]

Computes the average of an observable sequence of values that are in the sequence or obtained by invoking a transform function on each element of the input sequence if present.

#### Arguments
1. `[selector]` *(Function)*: A transform function to apply to each element.

#### Returns
*(Observable)*: An observable sequence containing a single element with the average of the sequence of values.

#### Example
```js
// Without a selector
var source = Rx.Observable.range(0, 9).average();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 4
// => Completed 

// With a selector
var arr = [
	{ value: 1 },
	{ value: 2 },
	{ value: 3 }
];

var source = Rx.Observable.fromArray(arr).average(function (x) {
	return x.value;
});

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 2
// => Completed 
```

#### Location

- rx.js

* * *

### <a id="buffer"></a>`Rx.Observable.prototype.buffer(bufferOpenings | closingSelector, bufferClosingSelector)`
<a href="#buffer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.coincidence.js#L572-L585 "View in source") [&#x24C9;][1]

Projects each element of an observable sequence into zero or more buffers.

#### Arguments
1. `bufferOpenings` *(Observable)*: Observable sequence whose elements denote the creation of new windows.
1 `closingSelector` *(Function)*: A function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
2. `[bufferClosingSelector]` *(Function)*: A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.

#### Returns
*(Observable)*: An observable sequence of windows. 

#### Example
```js
/* Using an openings */
var openings = Rx.Observable.interval(500);

var source = Rx.Observable.interval(100)
    .buffer(openings)
    .take(3);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0,1,2,3 
// => Next: 4,5,6,7,8
// => Next: 9,10,11,12,13
// => Completed 

/* Using a closing selector */
var win = 0;

var source = Rx.Observable.interval(50)
    .buffer(function () { return Rx.Observable.timer((win++) * 100); })
    .take(3);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0 
// => Next: 1,2,3,4
// => Next: 5,6,7,8,9,10 
// => Completed 

/* Using Openings and Closing Selector */
var openings = Rx.Observable.interval(200);

var source = Rx.Observable.interval(50)
    .buffer(openings, function (x) { return Rx.Observable.interval(x + 100); })
    .take(3);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 3,4 
// => Next: 7,8 
// => Next: 11,12 
// => Completed 
```
#### Location

- rx.coincidence.js

* * *

### <a id="bufferWithCount"></a>`Rx.Observable.prototype.bufferWithCount(count, [skip])`
<a href="#bufferWithCount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3694-L3703 "View in source") [&#x24C9;][1]

Projects each element of an observable sequence into zero or more buffers which are produced based on element count information.

#### Arguments
1. `count` *(Function)*: Length of each buffer.
2. `[skip]` *(Function)*: Number of elements to skip between creation of consecutive buffers. If not provided, defaults to the count.

#### Returns
*(Observable)*: An observable sequence of buffers. 

#### Example
```js
/* Without a skip */
var source = Rx.Observable.range(1, 6)
    .bufferWithCount(2);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 1,2 
// => Next: 3,4 
// => Next: 5,6 
// => Completed 

/* Using a skip */
var source = Rx.Observable.range(1, 6)
    .bufferWithCount(2, 1);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 1,2 
// => Next: 2,3 
// => Next: 3,4 
// => Next: 4,5 
// => Next: 5,6 
// => Next: 6 
// => Completed 
```
#### Location

- rx.js

* * *

### <a id="bufferWithTime"></a>`Rx.Observable.prototype.bufferWithTime(timeSpan, [timeShift | scheduler], [scheduler])`
<a href="#bufferWithTime">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L483-L498 "View in source") [&#x24C9;][1]

Projects each element of an observable sequence into zero or more buffers which are produced based on timing information.

#### Arguments
1. `timeSpan` *(Number)*: Length of each buffer (specified as an integer denoting milliseconds).
2. `[timeShift]` *(Number)*: Interval between creation of consecutive buffers (specified as an integer denoting milliseconds).
3. `[scheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler to run buffer timers on. If not specified, the timeout scheduler is used.

#### Returns
*(Observable)*: An observable sequence of buffers. 

#### Example
```js
/* Without a skip */
var source = Rx.Observable.interval(100)
    .bufferWithTime(500)
    .take(3);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0,1,2,3 
// => Next: 4,5,6,7,8 
// => Next: 9,10,11,12,13 
// => Completed 

/* Using a skip */
var source = Rx.Observable.interval(100)
    .bufferWithTime(500, 100)
    .take(3);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0,1,2,3,4 
// => Next: 0,1,2,3,4,5 
// => Next: 2,3,4,5,6 
// => Completed 
```
#### Location

- rx.time.js

* * *

### <a id="bufferWithTimeOrCount"></a>`Rx.Observable.prototype.bufferWithTimeOrCount(timeSpan, count, [scheduler])`
<a href="#bufferWithTimeOrCount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L513-L518 "View in source") [&#x24C9;][1]

Projects each element of an observable sequence into a buffer that is completed when either it's full or a given amount of time has elapsed.

#### Arguments
1. `timeSpan` *(Number)*: Maximum time length of a buffer.
2. `count` *(Number)*: Maximum element count of a buffer.
3. `[scheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler to run buffer timers on. If not specified, the timeout scheduler is used.

#### Returns
*(Observable)*: An observable sequence of buffers. 

#### Example
```js
/* Hitting the count buffer first */
var source = Rx.Observable.interval(100)
    .bufferWithTimeOrCount(500, 3)
    .take(3);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0,1,2 
// => Next: 3,4,5 
// => Next: 6,7,8 
// => Completed 
```
#### Location

- rx.time.js

* * *

### <a id="catch2"></a>`Rx.Observable.prototype.catch(second | handler)`
<a href="#catch2">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3107-L3112 "View in source") [&#x24C9;][1]

Continues an observable sequence that is terminated by an exception with the next observable sequence.  There is an alias for this method `catchException` for browsers <IE9

#### Arguments
1. `second` *(Observable)*: A second observable sequence used to produce results when an error occurred in the first sequence.
1. `handler` *(Function)*: Exception handler function that returns an observable sequence given the error that occurred in the first sequence

#### Returns
*(Observable)*: An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.

#### Example
```js
/* Using a second observable */
var source = Rx.Observable.throw(new Error())
	.catch(Rx.Observable.return(42));

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Completed 

/* Using a handler function */
var source = Rx.Observable.throw(new Error())
	.catch(function (e) {
		return Rx.Observable.return(e instanceof Error);
	});

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: true
// => Completed     
```
#### Location

- rx.js

* * *

### <a id="combineLatest"></a>`Rx.Observable.prototype.combineLatest(...)`
<a href="#combineLatest">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3139-L3147 "View in source") [&#x24C9;][1]

Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences produces an element.  This can be in the form of an argument list of observables or an array.

#### Arguments
1. `sources` *(arguments | Array)*: An array or arguments of Observable sequences.
1. `resultSelector` *(Function)*: Function to invoke whenever either of the sources produces an element.

#### Returns
*(Observable)*: An observable sequence containing the result of combining elements of the sources using the specified result selector function. 

#### Example
```js
/* Have staggering intervals */
var source1 = Rx.Observable.interval(100)
    .map(function (i) { return 'First: ' + i; });

var source2 = Rx.Observable.interval(150)
    .map(function (i) { return 'Second: ' + i; });

// Combine latest of source1 and source2 whenever either gives a value
var source = source1.combineLatest(
    source2,
    function (s1, s2) { return s1 + ', ' + s2; }
    ).take(4);
    
var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: First: 0, Second: 0 
// => Next: First: 1, Second: 0 
// => Next: First: 1, Second: 1 
// => Next: First: 2, Second: 1 
// => Completed 
```
#### Location

- rx.js

* * *

### <a id="concat"></a>`Rx.Observable.prototype.concat(...)`
<a href="#concat">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3223-L3227 "View in source") [&#x24C9;][1]

Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.

#### Arguments
1. `sources` *(arguments | Array)*: An array or arguments of Observable sequences.

#### Returns
*(Observable)*: An observable sequence that contains the elements of each given sequence, in sequential order. 

#### Example
```js
var source = Rx.Observable
	.return(42)
	.concat(Rx.Observable.return(56), Rx.Observable.return(72));
    
var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Next: 56
// => Next: 72
// => Completed 
```
#### Location

- rx.js

* * *

### <a id="contains"></a>`Rx.Observable.prototype.contains(value, [comparer])`
<a href="#contains">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L198-L203 "View in source") [&#x24C9;][1]

Determines whether an observable sequence contains a specified element with an optional equality comparer.

#### Arguments
1. `value` *(Any)*: The value to locate in the source sequence.
2. `[comparer]` *(Function)*: An equality comparer function to compare elements.

#### Returns
*(Observable)*: An observable sequence containing a single element determining whether the source sequence contains an element that has the specified value.

#### Example
```js
/* Without a comparer */
var source = Rx.Observable.return(42)
	.contains(42);
    
var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: true
// => Completed 

/* With a comparer */
var source = Rx.Observable.return({ value: 42 })
	.contains(
		{ value: 42}, 
		function (x, y) { return x.value === y.value; }
	);
    
var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: true
// => Completed 
```
#### Location

- rx.aggregates.js

* * *

### <a id="count"></a>`Rx.Observable.prototype.count([predicate])`
<a href="#count">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L214-L220 "View in source") [&#x24C9;][1]

Returns an observable sequence containing a value that represents how many elements in the specified observable sequence satisfy a condition if provided, else the count of items.

#### Arguments
1. `[predicate]` *(Any)*: A function to test each element for a condition.

#### Returns
*(Observable)*: An observable sequence containing a single element with a number that represents how many elements in the input sequence satisfy the condition in the predicate function if provided, else the count of items in the sequence.

#### Example
```js
/* Without a predicate */
var source = Rx.Observable.range(0, 10).count();
    
var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 10
// => Completed 

/* With a predicate */
var source = Rx.Observable.range(0, 10)
	.count(function (x) { return x % 2 === 0; });
    
var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 5
// => Completed 
```
#### Location

- rx.aggregates.js

* * *

### <a id="defaultIfEmpty"></a>`Rx.Observable.prototype.defaultIfEmpty([defaultValue])`
<a href="#defaultIfEmpty">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4111-L4128 "View in source") [&#x24C9;][1]

Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.

#### Arguments
1. `[defaultValue=null]` *(Any)*: The value to return if the sequence is empty. If not provided, this defaults to null.

#### Returns
*(Observable)*: An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself. 
  
#### Example
```js
/* Without a default value */
var source = Rx.Observable.empty().defaultValue();
    
var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: null
// => Completed 

/* With a defaultValue */
var source = Rx.Observable.empty().defaultValue(false);
    
var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: false
// => Completed 
```
#### Location

- rx.js

* * *

### <a id="delay"></a>`Rx.Observable.prototype.delay(dueTime, [scheduler])`
<a href="#delay">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4111-L4128 "View in source") [&#x24C9;][1]

Time shifts the observable sequence by dueTime. The relative time intervals between the values are preserved.

#### Arguments
1. `dueTime` *(Date | Number)*: Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
2. `[scheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.

#### Returns
*(Observable)*: Time-shifted sequence.
  
#### Example
```js
/* Using an absolute time to delay by a second */
var source = Rx.Observable.range(0, 3)
	.delay(new Date(Date.now() + 1000));
    
var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0 
// => Next: 1 
// => Next: 2 
// => Completed

/* Using an relatove time to delay by a second */
var source = Rx.Observable.range(0, 3)
	.delay(1000);
    
var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: false
// => Completed 
```
#### Location

- rx.time.js

* * *

### <a id="dematerialize"></a>`Rx.Observable.prototype.dematerialize()`
<a href="#delay">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3711-L3718 "View in source") [&#x24C9;][1]

Dematerializes the explicit notification values of an observable sequence as implicit notifications.

#### Returns
*(Observable)*: An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.
  
#### Example
```js
var source = Rx.Observable
    .fromArray([
        Rx.Notification.createOnNext(42),
        Rx.Notification.createOnError(new Error('woops'))
    ])
    .dematerialize();
    
var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Error: Error: woops 
```
#### Location

- rx.js

* * *

### <a id="distinct"></a>`Rx.Observable.prototype.distinct([keySelector], [keySerializer])`
<a href="#distinct">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4144-L4171 "View in source") [&#x24C9;][1]

Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer. Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large. 

#### Arguments
1. `[keySelector]` *(Function)*: A function to compute the comparison key for each element.
2. `[keySerializer]` *(Function)*: Used to serialize the given object into a string for object comparison.

#### Returns
*(Observable)*: An observable sequence only containing the distinct elements, based on a computed key value, from the source sequence.

#### Example
```js
/* Without key selector */
var source = Rx.Observable.fromArray([
		42, 24, 42, 24
	])
	.distinct();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Next: 24
// => Completed 

/* With key selector */
var source = Rx.Observable.fromArray([
		{value: 42}, {value: 24}, {value: 42}, {value: 24}
	])
	.distinct(function (x) { return x.value; });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: { value: 42 }
// => Next: { value: 24 }
// => Completed 
```
#### Location

- rx.js

* * *

### <a id="distinctUntilChanged"></a>`Rx.Observable.prototype.distinctUntilChanged([keySelector], [comparer])`
<a href="#distinctUntilChanged">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4144-L4171 "View in source") [&#x24C9;][1]

Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer. Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large. 

#### Arguments
1. `[keySelector]` *(Function)*: A function to compute the comparison key for each element.
2. `[keySerializer]` *(Function)*: Used to serialize the given object into a string for object comparison.

#### Returns
*(Observable)*: An observable sequence only containing the distinct elements, based on a computed key value, from the source sequence.

#### Example
```js
/* Without key selector */
var source = Rx.Observable.fromArray([
		42, 42, 24, 24
	])
	.distinct();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Next: 24
// => Completed 

/* With key selector */
var source = Rx.Observable.fromArray([
		{value: 42}, {value: 24}, {value: 42}, {value: 24}
	])
	.distinct(function (x) { return x.value; });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: { value: 42 }
// => Next: { value: 24 }
// => Completed 
```
#### Location

- rx.js

* * *

### <a id="do"></a>`Rx.Observable.prototype.do(observer | [onNext], [onError], [onCompleted])`
<a href="#do">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3779-L3820 "View in source") [&#x24C9;][1]

Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
There is an alias to this method `doAction` for browsers <IE9.

#### Arguments
1. `observer` *(Observer)*: An observer to invoke for each element in the observable sequence.
1. `[onNext]` *(Function)*: Function to invoke for each element in the observable sequence.
2. `[onError]` *(Function)*: Function to invoke upon exceptional termination of the observable sequence. Used if only the first parameter is also a function.
3. `[oncompleted]` *(Function)*: Function to invoke upon graceful termination of the observable sequence. Used if only the first parameter is also a function.

#### Returns
*(Observable)*: An observable sequence whose observers trigger an invocation of the given observable factory function.

#### Example
```js
/* Using a function */
var source = Rx.Observable.range(0, 3)
    .do(
        function (x) { console.log('Do Next: ' + x; ); },
        function (err) { console.log('Do Error: ' + x; ); },
        function () { console.log('Do Completed'); }
    );

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Do Next: 0
// => Next: 0
// => Do Next: 1
// => Next: 1
// => Do Next: 2
// => Next: 2
// => Do Completed
// => Completed 

/* Using an observer */
var observer = Rx.Observer.create(
    function (x) { console.log('Do Next: ' + x; ); },
    function (err) { console.log('Do Error: ' + x; ); },
    function () { console.log('Do Completed'); }
);

var source = Rx.Observable.range(0, 3)
    .do(observer);


var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Do Next: 0
// => Next: 0
// => Do Next: 1
// => Next: 1
// => Do Next: 2
// => Next: 2
// => Do Completed
// => Completed 
```
#### Location

- rx.js

* * *

### <a id="doWhile"></a>`Rx.Observable.prototype.doWhile(condition, source)`
<a href="#doWhile">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2549-L2559 "View in source") [&#x24C9;][1]

Repeats source as long as condition holds emulating a do while loop.

#### Arguments
1. `condition` *(Function)*: The condition which determines if the source will be repeated.
2. `source` *(Function)*: The observable sequence that will be run if the condition function returns true.

#### Returns
*(Observable)*: An observable sequence whose observers trigger an invocation of the given observable factory function.

#### Example
```js
var i = 0;

var source = Rx.Observable.return(42).doWhile(
	function (x) { return ++i < 2; });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Next: 42
// => Completed 
```
#### Location

- rx.experimental.js

* * *

### <a id="elementAt"></a>`Rx.Observable.prototype.elementAt(index)`
<a href="#elementAt">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L474-L476 "View in source") [&#x24C9;][1]

Returns the element at a specified index in a sequence.

#### Arguments
1. `index` *(Function)*: The zero-based index of the element to retrieve.

#### Returns
*(Observable)*: An observable sequence that produces the element at the specified position in the source sequence.

#### Example
```js
/* Finds an index */
var source = Rx.Observable.fromArray([1,2,3,4])
    .elementAt(1);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 2
// => Completed 

/* Not found */
var source = Rx.Observable.fromArray([1,2,3,4])
    .elementAt(4);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Error: Error: Argument out of range
```
#### Location

- rx.aggregates.js

* * *

### <a id="elementAtOrDefault"></a>`Rx.Observable.prototype.elementAt(index, [defaultValue])`
<a href="#elementAtOrDefault">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L489-L491 "View in source") [&#x24C9;][1]

Returns the element at a specified index in a sequence.

#### Arguments
1. `index` *(Function)*: The zero-based index of the element to retrieve.
2. `[defaultValue = null]` *(Any)*: The default value if the index is outside the bounds of the source sequence.

#### Returns
*(Observable)*: An observable sequence that produces the element at the specified position in the source sequence, or a default value if the index is outside the bounds of the source sequence.

#### Example
```js
/* Finds an index */
var source = Rx.Observable.fromArray([1,2,3,4])
    .elementAt(1);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 2
// => Completed 

/* Not found */
var source = Rx.Observable.fromArray([1,2,3,4])
    .elementAt(4, 0);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0
// => Completed 
```
#### Location

- rx.aggregates.js

* * *

### <a id="every"></a>`Rx.Observable.prototype.every(predicate, [thisArg])`
<a href="#every">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L179-L185 "View in source") [&#x24C9;][1]

Determines whether all elements of an observable sequence satisfy a condition.  This is an alias to `all`.

#### Arguments
1. `predicate` *(Function)*: A function to test each element for a condition.
2. `[thisArg]` *(Function)*: Object to use as this when executing callback.

#### Returns
*(Observable)*: An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.

#### Example
```js
var source = Rx.Observable.fromArray([1,2,3,4,5])
    .all(function (x) {
        return x < 6;
    });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: true
// => Completed    
```

#### Location

- rx.aggregates.js

* * *

### <a id="expand"></a>`Rx.Observable.prototype.expand(selector, [scheduler])`
<a href="#expand">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L179-L234 "View in source") [&#x24C9;][1]

Expands an observable sequence by recursively invoking selector.

#### Arguments
1. `selector` *(Function)*: Selector function to invoke for each produced element, resulting in another sequence to which the selector will be invoked recursively again.
2. `[scheduler=Rx.Scheduler.immediate]` *(Scheduler)*: Scheduler on which to perform the expansion. If not provided, this defaults to the immediate scheduler.

#### Returns
*(Observable)*: An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.

#### Example
```js
var source = Rx.Observable.return(42)
    .expand(function (x) { return Rx.Observable.return(42 + x); })
    .take(5);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42 
// => Next: 84 
// => Next: 126 
// => Next: 168 
// => Next: 210 
// => Completed    
```

#### Location

- rx.experimental.js

* * *

### <a id="expand"></a>`Rx.Observable.prototype.expand(selector, [scheduler])`
<a href="#expand">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L179-L234 "View in source") [&#x24C9;][1]

Expands an observable sequence by recursively invoking selector.

#### Arguments
1. `selector` *(Function)*: Selector function to invoke for each produced element, resulting in another sequence to which the selector will be invoked recursively again.
2. `[scheduler=Rx.Scheduler.immediate]` *(Scheduler)*: Scheduler on which to perform the expansion. If not provided, this defaults to the immediate scheduler.

#### Returns
*(Observable)*: An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.

#### Example
```js
var source = Rx.Observable.return(42)
    .expand(function (x) { return Rx.Observable.return(42 + x); })
    .take(5);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42 
// => Next: 84 
// => Next: 126 
// => Next: 168 
// => Next: 210 
// => Completed    
```

#### Location

- rx.experimental.js

* * *

### <a id="filter"></a>`Rx.Observable.prototype.filter(predicate, [thisArg])`
<a href="#filter">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4513-L4530 "View in source") [&#x24C9;][1]

Filters the elements of an observable sequence based on a predicate.  This is an alias for the `where` method.

#### Arguments
1. `predicate` *(Function)*: A function to test each source element for a condition. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as `this` when executing the predicate.

#### Returns
*(Observable)*: An observable sequence that contains elements from the input sequence that satisfy the condition.  

#### Example
```js
var source = Rx.Observable.range(0, 5)
    .filter(function (x, idx, obs) {
        return x % 2 === 0;
    });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0 
// => Next: 2 
// => Next: 4 
// => Completed    
```

#### Location

- rx.js

* * *

### <a id="finally"></a>`Rx.Observable.prototype.finally(action)`
<a href="#finally">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3832-L3846 "View in source") [&#x24C9;][1]

Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.  There is an alias called `finallyAction` for browsers <IE9

#### Arguments
1. `predicate` *(Function)*: A function to test each source element for a condition;  The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as `this` when executing the predicate.

#### Returns
*(Observable)*: An observable sequence that contains elements from the input sequence that satisfy the condition.  

#### Example
```js
/* Terminated by error still fires function */
var source = Rx.Observable.throw(new Error())
    .finally(function () {
        console.log('Finally');
    });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Error: Error
// => Finally   
```

#### Location

- rx.js

* * *

### <a id="first"></a>`Rx.Observable.prototype.first([predicate], [thisArg])`
<a href="#first">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L577-L582 "View in source") [&#x24C9;][1]

Returns the first element of an observable sequence that satisfies the condition in the predicate if present else the first item in the sequence.

#### Arguments
1. `predicate` *(Function)*: A predicate function to evaluate for elements in the source sequence. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as `this` when executing the predicate.

#### Returns
*(Observable)*: An observable sequence that contains elements from the input sequence that satisfy the condition.  

#### Example
```js
/* No Match */
var source = Rx.Observable.empty()
    .first();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Error: Error: Sequence contains no elements.    

/* Without a predicate */
var source = Rx.Observable.range(0, 10)
    .first();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0
// => Completed

/* With a predicate */
var source = Rx.Observable.range(0, 10)
    .first(function (x, idx, obs) { return x % 2 === 1; });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 1
// => Completed  
```

#### Location

- rx.aggregates.js

* * *

### <a id="firstOrDefault"></a>`Rx.Observable.prototype.firstOrDefault(predicate, [defaultValue], [thisArg])`
<a href="#firstOrDefault">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L577-L582 "View in source") [&#x24C9;][1]

Returns the first element of an observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.

#### Arguments
1. `predicate` *(Function)*: A predicate function to evaluate for elements in the source sequence. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[defaultValue]` *(Any)*: The default value if no such element exists.  If not specified, defaults to null.
3. `[thisArg]` *(Any)*: Object to use as `this` when executing the predicate.

#### Returns
*(Observable)*: An observable sequence that contains elements from the input sequence that satisfy the condition.  

#### Example
```js
/* Without a predicate but default value */
var source = Rx.Observable.range(0, 10)
    .firstOrDefault(null, 42);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Completed

/* With a predicate */
var source = Rx.Observable.range(0, 10)
    .firstOrDefault(function (x, idx, obs) { return x % 2 === 1; }, 0);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 1
// => Completed  
```

#### Location

- rx.aggregates.js

* * *

### <a id="forkJoin2"></a>`Rx.Observable.prototype.forkJoin(second, resultSelector)`
<a href="#forkJoin2">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L304-L373 "View in source") [&#x24C9;][1]

Runs two observable sequences in parallel and combines their last elements.

#### Arguments
1. `second` *(Observable)*: Second observable sequence.
2. `resultSelector` *(Any)*: The default value if no such element exists.  If not specified, defaults to null.

#### Returns
*(Observable)*: An observable sequence that contains elements from the input sequence that satisfy the condition.  

#### Example
```js
var source1 = Rx.Observable.return(42);
var source2 = Rx.Observable.range(0, 3);

var source = source1.forkJoin(source2, function (s1, s2) {
    return s1 + s2; 
});

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 44
// => Completed
```

#### Location

- rx.experimental.js

* * *

### <a id="groupBy"></a>`Rx.Observable.prototype.groupBy(keySelector, [elementSelector], [keySerializer])`
<a href="#groupBy">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4187-L4191 "View in source") [&#x24C9;][1]

Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.

#### Arguments
1. `keySelector` *(Function)*: A function to extract the key for each element.
2. `[elementSelector]` *(Function)*: A function to map each source element to an element in an observable group.
3. `[keySerializer]` *(Any)*: Used to serialize the given object into a string for object comparison.

#### Returns
*(Observable)*: A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.    

#### Example
```js
var codes = [
    { keyCode: 38}, // up
    { keyCode: 38}, // up
    { keyCode: 40}, // down
    { keyCode: 40}, // down
    { keyCode: 37}, // left
    { keyCode: 39}, // right
    { keyCode: 37}, // left
    { keyCode: 39}, // right
    { keyCode: 66}, // b
    { keyCode: 65}  // a
];

var source = Rx.Observable.fromArray(codes)
	.groupBy(
		function (x) { return x.keyCode; },
		function (x) { return x.keyCode; });

var subscription = source.subscribe(
    function (obs) {
        // Print the count
        obs.count().subscribe(function (x) { 
        	console.log('Count: ' + x); 
    	});
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Count: 2 
// => Count: 2 
// => Count: 2 
// => Count: 2 
// => Count: 1 
// => Count: 1 
// => Completed 
```

#### Location

- rx.js

* * *

### <a id="groupByUntil"></a>`Rx.Observable.prototype.groupBy(keySelector, [elementSelector], durationSelector, [keySerializer])`
<a href="#groupByUntil">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4212-L4301 "View in source") [&#x24C9;][1]

Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.

#### Arguments
1. `keySelector` *(Function)*: A function to extract the key for each element.
2. `[elementSelector]` *(Function)*: A function to map each source element to an element in an observable group.
3. `durationSelector` *(Function)*: A function to signal the expiration of a group.
4. `[keySerializer]` *(Any)*: Used to serialize the given object into a string for object comparison.

#### Returns
*(Observable)*: A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.  

If a group's lifetime expires, a new group with the same key value can be created once an element with such a key value is encoutered.

#### Example
```js
var codes = [
    { keyCode: 38}, // up
    { keyCode: 38}, // up
    { keyCode: 40}, // down
    { keyCode: 40}, // down
    { keyCode: 37}, // left
    { keyCode: 39}, // right
    { keyCode: 37}, // left
    { keyCode: 39}, // right
    { keyCode: 66}, // b
    { keyCode: 65}  // a
];

var source = Rx.Observable
	.for(codes, function (x) { return Rx.Observable.return(x).delay(1000); })
	.groupByUntil(
		function (x) { return x.keyCode; },
		function (x) { return x.keyCode; },
        function (x) { return Rx.Observable.timer(2000); });

var subscription = source.subscribe(
    function (obs) {
        // Print the count
        obs.count().subscribe(function (x) { console.log('Count: ' + x); });
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Count: 2 
// => Count: 2 
// => Count: 1 
// => Count: 1 
// => Count: 1 
// => Count: 1 
// => Count: 1 
// => Count: 1 
// => Completed 
```

#### Location

- rx.js

* * *

### <a id="groupJoin"></a>`Rx.Observable.prototype.groupJoin(right, leftDurationSelector, rightDurationSelector, resultSelector)`
<a href="#groupJoin">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.coincidence.js#L431-L563 "View in source") [&#x24C9;][1]

Correlates the elements of two sequences based on overlapping durations, and groups the results.

#### Arguments
1. `right` *(Observable)*: The right observable sequence to join elements for.
2. `leftDurationSelector` *(Function)*: A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
3. `rightDurationSelector` *(Function)*: A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
4. `resultSelector` *(Any)*: A function invoked to compute a result element for any element of the left sequence with overlapping elements from the right observable sequence. It has the following arguments
	1. *(Any)* An element of the left sequence. 
	2. *(Observable)* An observable sequence with elements from the right sequence that overlap with the left sequence's element.

#### Returns
*(Observable)*: An observable sequence that contains result elements computed from source elements that have an overlapping duration.

#### Example
```js
var xs = Rx.Observable.interval(100)
	.map(function (x) { return 'first' + x; });

var ys = Rx.Observable.interval(100)
	.map(function (x) { return 'second' + x; });

var source = xs.groupJoin(
    ys,
    function () { return Rx.Observable.timer(0); },
    function () { return Rx.Observable.timer(0); },
    function (x, yy) { 
        return yy.select(function (y) { 
            return x + y; 
        })
    }).mergeObservable().take(5);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: first0second0 
// => Next: first1second1 
// => Next: first2second2 
// => Next: first3second3 
// => Next: first4second4 
// => Completed  
```

#### Location

- rx.js

* * *

### <a id="ignoreElements"></a>`Rx.Observable.prototype.ignoreElements()`
<a href="#ignoreElements">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3854-L3859 "View in source") [&#x24C9;][1]

Ignores all elements in an observable sequence leaving only the termination messages.

#### Returns
*(Observable)*: An empty observable sequence that signals termination, successful or exceptional, of the source sequence.    

#### Example
```js
var source = Rx.Observable.range(0, 10)
	.ignoreElements();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Completed
```

#### Location

- rx.js

* * *

### <a id="isEmpty"></a>`Rx.Observable.prototype.isEmpty()`
<a href="#isEmpty">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L166-L168 "View in source") [&#x24C9;][1]

Determines whether an observable sequence is empty.

#### Returns
*(Observable)*: An observable sequence containing a single element determining whether the source sequence is empty.

#### Example
```js
/* Not empty */
var source = Rx.Observable.range(0, 5)
	.isEmpty()

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: false
// => Completed    

/* Empty */
var source = Rx.Observable.empty()
	.isEmpty()

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: true
// => Completed  
```

#### Location

- rx.aggregates.js

* * *

### <a id="join"></a>`Rx.Observable.prototype.join(right, leftDurationSelector, rightDurationSelector, resultSelector)`
<a href="#join">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.coincidence.js#L332-L420 "View in source") [&#x24C9;][1]

Correlates the elements of two sequences based on overlapping durations.

#### Arguments
1. `right` *(Observable)*: The right observable sequence to join elements for.
2. `leftDurationSelector` *(Function)*: A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
3. `rightDurationSelector` *(Function)*: A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
4. `resultSelector` *(Any)*: A function invoked to compute a result element for any two overlapping elements of the left and right observable sequences. The parameters are as follows:
    1. *(Any)* Element from the left source for which the overlap occurs.
    2. *(Any)* Element from the right source for which the overlap occurs.

#### Returns
*(Observable)*: An observable sequence that contains result elements computed from source elements that have an overlapping duration.
 
#### Example
```js
var xs = Rx.Observable.interval(100)
    .map(function (x) { return 'first' + x; });

var ys = Rx.Observable.interval(100)
    .map(function (x) { return 'second' + x; });

var source = xs
    .join(
        ys,
        function () { return Rx.Observable.timer(0); },
        function () { return Rx.Observable.timer(0); },
        function (x, y) { return x + y; }
    )
    .take(5);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: first0second0 
// => Next: first1second1 
// => Next: first2second2 
// => Next: first3second3 
// => Next: first4second4 
// => Completed  
```

#### Location

- rx.coincidence.js

* * *

### <a id="last"></a>`Rx.Observable.prototype.last([predicate], [thisArg])`
<a href="#last">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L634-L639 "View in source") [&#x24C9;][1]

Returns the last element of an observable sequence that satisfies the condition in the predicate if specified, else the last element.

#### Arguments
1. `predicate` *(Function)*: A predicate function to evaluate for elements in the source sequence. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as `this` when executing the predicate.

#### Returns
*(Observable)*: Sequence containing the last element in the observable sequence that satisfies the condition in the predicate.

#### Example
```js
/* No Match */
var source = Rx.Observable.empty()
    .last();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Error: Error: Sequence contains no elements.

/* Without predicate */
var source = Rx.Observable.range(0, 10)
    .last();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 9
// => Completed  

/* Without predicate */
var source = Rx.Observable.range(0, 10)
    .last(function (x, idx, obs) {
        return x % 2 === 0;
    });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 8
// => Completed 
```

#### Location

- rx.aggregates.js

* * *

### <a id="lastOrDefault"></a>`Rx.Observable.prototype.lastOrDefault([predicate], [defaultValue], [thisArg])`
<a href="#lastOrDefault">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L634-L639 "View in source") [&#x24C9;][1]

Returns the last element of an observable sequence that satisfies the condition in the predicate if specified, else the last element.

#### Arguments
1. `predicate` *(Function)*: A predicate function to evaluate for elements in the source sequence. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[defaultValue]` *(Any)*: The default value if no such element exists.  If not specified, defaults to null.
3. `[thisArg]` *(Any)*: Object to use as `this` when executing the predicate.

#### Returns
*(Observable)*: Sequence containing the last element in the observable sequence that satisfies the condition in the predicate.

#### Example
```js
/* No Match */
var source = Rx.Observable.empty()
    .lastOrDefault(null, 0);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0
// => Completed

/* Without predicate */
var source = Rx.Observable.range(0, 10)
    .lastOrDefault();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 9
// => Completed  

/* Without predicate */
var source = Rx.Observable.range(0, 10)
    .lastOrDefault(function (x, idx, obs) {
        return x % 2 === 0;
    });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 8
// => Completed 
```

#### Location

- rx.aggregates.js

* * *

### <a id="manySelect"></a>`Rx.Observable.prototype.manySelect(selector, [scheduler])`
<a href="#manySelect">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L634-L639 "View in source") [&#x24C9;][1]

Comonadic bind operator.

#### Arguments
1. `selector` *(Function)*: A transform function to apply to each element.
2. `[scheduler=Rx.Scheduler.immediate]` *(Scheduler)*: Scheduler used to execute the operation. If not specified, defaults to the `Rx.Scheduler.immediate` scheduler.
 
#### Returns
*(Observable)*: An observable sequence which results from the comonadic bind operation.

#### Example
```js
var source = Rx.Observable.range(0, 3)
    .manySelect(function (ys) { return ys.first(); })
    .mergeObservable();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0
// => Next: 1
// => Next: 2
// => Completed 
```

#### Location

- rx.experimental.js

* * *

### <a id="map"></a>`Rx.Observable.prototype.map(selector, [thisArg])`
<a href="#map">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4311-L4326 "View in source") [&#x24C9;][1]

Projects each element of an observable sequence into a new form by incorporating the element's index.  This is an alias for the `select` method.

#### Arguments
1. `selector` *(Function)*:  Transform function to apply to each source element.  The selector is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as `this` when executing the predicate.
 
#### Returns
*(Observable)*: An observable sequence which results from the comonadic bind operation.

#### Example
```js
var source = Rx.Observable.range(1, 3)
    .map(function (x, idx, obs) {
        return x * x;
    });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 1
// => Next: 4
// => Next: 9
// => Completed 
```

#### Location

- rx.js

* * *

### <a id="max"></a>`Rx.Observable.prototype.max([comparer])`
<a href="#max">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L297-L301 "View in source") [&#x24C9;][1]

Returns the maximum value in an observable sequence according to the specified comparer.

#### Arguments
1. `[comparer]` *(Function)*:  Comparer used to compare elements.
 
#### Returns
*(Observable)*: An observable sequence containing a single element with the maximum element in the source sequence.

#### Example
```js
/* Without comparer */
var source = Rx.Observable.fromArray([1,3,5,7,9,2,4,6,8])
    .max();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 9
// => Completed 

/* With a comparer */
function comparer (x, y) {
    if (x > y) {
        return 1;
    } else if (x < y) {
        return -1;
    }
    return 0;
}

var source = Rx.Observable.fromArray([1,3,5,7,9,2,4,6,8])
    .max(comparer);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 9
// => Completed 
```

#### Location

- rx.aggregates.js

* * *

### <a id="maxBy"></a>`Rx.Observable.prototype.maxBy(keySelector, [comparer])`
<a href="#maxBy">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L282-L285 "View in source") [&#x24C9;][1]

Returns the maximum value in an observable sequence according to the specified comparer.

#### Arguments
1. `keySelector` *(Function)*: Key selector function.
2. `[comparer]` *(Function)*:  Comparer used to compare elements.
 
#### Returns
*(Observable)*: An observable sequence containing a list of zero or more elements that have a maximum key value.
 
#### Example
```js
/* Without comparer */
var source = Rx.Observable.fromArray([1,3,5,7,9,2,4,6,8,9])
    .maxBy(function (x) { return x; });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 9,9
// => Completed 
```

#### Location

- rx.aggregates.js

* * *

### <a id="merge2"></a>`Rx.Observable.prototype.merge(maxConcurrent | other)`
<a href="#merge2">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3265-L3307 "View in source") [&#x24C9;][1]

Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
Or merges two observable sequences into a single observable sequence.

#### Arguments
1. `maxConcurrent` *(Function)*: Maximum number of inner observable sequences being subscribed to concurrently.
1. `other` *(Observable)*:  The second observable sequence to merge into the first.
 
#### Returns
*(Observable)*: The observable sequence that merges the elements of the inner sequences. 
 
#### Example
```js
/* Merge two sequences */
var source1 = Rx.Observable.interval(100)
    .map(function (x) { return 'First: ' + x; });

var source2 = Rx.Observable.interval(50)
    .map(function (x) { return 'Second: ' + x; });

var source = source1
    .merge(source2)
    .take(5);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: Second: 0 
// => Next: First: 0 
// => Next: Second: 1 
// => Next: Second: 2 
// => Next: First: 1 
// => Completed 

/* Use max concurrency */
var source = Rx.Observable.range(0, 3)
    .map(function (x) { return Rx.Observable.range(x, 3); })
    .merge(1);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0 
// => Next: 1 
// => Next: 2 
// => Next: 1 
// => Next: 2 
// => Next: 3 
// => Next: 2 
// => Next: 3 
// => Next: 4 
// => Completed     
```

#### Location

- rx.js

* * *

### <a id="mergeObservable"></a>`Rx.Observable.prototype.mergeObservable()`
<a href="#mergeObservable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3347-L3373 "View in source") [&#x24C9;][1]

Merges an observable sequence of observable sequences into an observable sequence.

#### Returns
*(Observable)*: The observable sequence that merges the elements of the inner sequences. 
 
#### Example
```js
var source = Rx.Observable.range(0, 3)
    .map(function (x) { return Rx.Observable.range(x, 3); })
    .mergeObservable();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0 
// => Next: 1 
// => Next: 1 
// => Next: 2 
// => Next: 2 
// => Next: 2 
// => Next: 3 
// => Next: 3 
// => Next: 4 
// => Completed     
```

#### Location

- rx.js

* * *

### <a id="min"></a>`Rx.Observable.prototype.min([comparer])`
<a href="#min">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L265-L269 "View in source") [&#x24C9;][1]

Returns the minimum element in an observable sequence according to the optional comparer else a default greater than less than check.

#### Arguments
1. `[comparer]` *(Function)*:  Comparer used to compare elements.
 
#### Returns
*(Observable)*: An observable sequence containing a single element with the minimum element in the source sequence.
 
#### Example
```js
/* Without comparer */
var source = Rx.Observable.fromArray([1,3,5,7,9,2,4,6,8])
    .min();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 1
// => Completed 

/* With a comparer */
function comparer (x, y) {
    if (x > y) {
        return 1;
    } else if (x < y) {
        return -1;
    }
    return 0;
}

var source = Rx.Observable.fromArray([1,3,5,7,9,2,4,6,8])
    .min(comparer);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 1
// => Completed 
```

#### Location

- rx.aggregates.js

* * *

### <a id="minBy"></a>`Rx.Observable.prototype.minBy(keySelector, [comparer])`
<a href="#minBy">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L249-L254 "View in source") [&#x24C9;][1]

Returns the elements in an observable sequence with the minimum key value according to the specified comparer.

#### Arguments
1. `keySelector` *(Function)*: Key selector function.
2. `[comparer]` *(Function)*:  Comparer used to compare elements.
 
#### Returns
*(Observable)*: An observable sequence containing a list of zero or more elements that have a minimum key value.

#### Example
```js
/* Without comparer */
var source = Rx.Observable.fromArray([1,3,5,7,9,2,4,6,8,1])
    .maxBy(function (x) { return x; });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 1,1
// => Completed 
```

#### Location

- rx.aggregates.js

* * *

### <a id="multicast"></a>`Rx.Observable.prototype.multicast(subject | subjectSelector, [selector])`
<a href="#multicast">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js#L63-L71 "View in source") [&#x24C9;][1]

Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
invocation. For specializations with fixed subject types, see `publish`, , `publishValue`, `publishLast`, and `replay`.

#### Arguments
1. `subjectSelector` *(Function)*:  Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
1. `subject` *(Subject)*: Subject to push source elements into.
2. `[selector]` *(Function)*: Optional selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if `subjectSelector` is provided.

#### Returns
*(Observable)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
 
#### Example
```js
var subject = new Rx.Subject();
var source = Rx.Observable.range(0, 3)
    .multicast(subject);

var observer = Rx.Observer.create(    
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    }
);

var subscription = source.subscribe(observer);
subject.subscribe(observer);

var connected = source.connect();

subscription.dispose();

// => Next: 0 
// => Next: 0 
// => Next: 1 
// => Next: 1 
// => Next: 2 
// => Next: 2 
// => Completed   
```

#### Location

- rx.binding.js

* * *

### <a id="observeOn"></a>`Rx.Observable.prototype.observeOn(scheduler)`
<a href="#observeOn">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2683-L2688 "View in source") [&#x24C9;][1]

Wraps the source sequence in order to run its observer callbacks on the specified scheduler.

This only invokes observer callbacks on a scheduler. In case the subscription and/or unsubscription actions have side-effects that require to be run on a scheduler, use subscribeOn.

#### Arguments
1. `scheduler` *(Scheduler)*:  Scheduler to notify observers on.

#### Returns
*(Observable)*: The source sequence whose observations happen on the specified scheduler. 
 
#### Example
```js
/* Change from immediate scheduler to timeout */
var source = Rx.Observable.return(42, Rx.Scheduler.immediate)
    .observeOn(Rx.Scheduler.timeout);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Completed   
```

#### Location

- rx.js

* * *

### <a id="onErrorResumeNext2"></a>`Rx.Observable.prototype.onErrorResumeNext(second)`
<a href="#onErrorResumeNext2">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3382-L3387 "View in source") [&#x24C9;][1]

Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.

#### Arguments
1. `second` *(Observable)*:  Second observable sequence used to produce results after the first sequence terminates.

#### Returns
*(Observable)*: An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.

#### Example
```js
var source = Rx.Observable.throw(new Error())
    .onErrorResumeNext(Rx.Observable.return(42));

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 42
// => Completed   
```

#### Location

- rx.js

* * *

### <a id="publish"></a>`Rx.Observable.prototype.publish([selector])`
<a href="#publish">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js#L84-L90 "View in source") [&#x24C9;][1]

Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.

This operator is a specialization of `multicast` using a regular `Rx.Subject`.

#### Arguments
1. `[selector]` *(Function)*: Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
  
#### Returns
*(Observable)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   
#### Example
```js
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .doAction(function (x) { 
        console.log('Side effect');
    });
 
var published = producer.publish();
 
published.subscribe(createObserver('SourceA'));
published.subscribe(createObserver('SourceB'));
 
var connection = producerAbstraction.connect();

function createObserver(tag) {
    return Rx.Observer.create(
        function (x) {
            console.log('Next: ' + tag + x);
        },
        function (err) {
            console.log('Error: ' + err);   
        },
        function () {
            console.log('Completed');   
        });
}

// => Side effect 
// => Next: SourceA0 
// => Next: SourceB0 
// => Side effect 
// => Next: SourceA1 
// => Next: SourceB1
// => Completed    
```

#### Location

- rx.binding.js

* * *

### <a id="select"></a>`Rx.Observable.prototype.select(selector, [thisArg])`
<a href="#select">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4311-L4326 "View in source") [&#x24C9;][1]

Projects each element of an observable sequence into a new form by incorporating the element's index.  This is an alias for the `select` method.

#### Arguments
1. `selector` *(Function)*:  Transform function to apply to each source element.  The selector is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as `this` when executing the predicate.
 
#### Returns
*(Observable)*: An observable sequence which results from the comonadic bind operation.

#### Example
```js
var source = Rx.Observable.range(1, 3)
    .map(function (x, idx, obs) {
        return x * x;
    });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 1
// => Next: 4
// => Next: 9
// => Completed 
```

#### Location

- rx.js

### <a id="where"></a>`Rx.Observable.prototype.where(predicate, [thisArg])`
<a href="#where">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4513-L4530 "View in source") [&#x24C9;][1]

Filters the elements of an observable sequence based on a predicate.  This is an alias for the `filter` method.

#### Arguments
1. `predicate` *(Function)*: A function to test each source element for a condition. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as `this` when executing the predicate.

#### Returns
*(Observable)*: An observable sequence that contains elements from the input sequence that satisfy the condition.  

#### Example
```js
var source = Rx.Observable.range(0, 5)
    .where(function (x, idx, obs) {
        return x % 2 === 0;
    });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: 0 
// => Next: 2 
// => Next: 4 
// => Completed    
```

#### Location

- rx.js

* * *