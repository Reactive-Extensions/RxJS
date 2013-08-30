# Observable object #

The Observable object represents a push based collection.

The Observer and Objects interfaces provide a generalized mechanism for push-based notification, also known as the observer design pattern. The Observable object represents the object that sends notifications (the provider); the Observer object represents the class that receives them (the observer). 

<!-- div -->

## `Observable Methods`
- [`amb`](#amb1)
- [`case`](#case)
- [`catchException`](#catchException1)
- [`concat`](#concat1)
- [`create`](#create)
- [`createWithDisposable`](#createWithDisposable)
- [`defer`](#defer)
- [`empty`](#empty)
- [`for`](#for)
- [`forkJoin`](#forkJoin1)
- [`fromArray`](#fromArray)
- [`generate`](#generate)
- [`generateWithAbsoluteTime`](#generateWithAbsoluteTime)
- [`generateWithRelativeTime`](#generateWithRelativeTime)
- [`if`](#if)
- [`interval`](#interval)
- [`merge`](#merge1)
- [`never`](#never)
- [`onErrorResumeNext`](#onErrorResumeNext1)
- [`range`](#range)
- [`repeat`](#repeat1)
- [`return`](#return)
- [`start`](#start)
- [`timer`](#timer)
- [`toAsync`](#toAsync)
- [`when`](#when)
- [`while`](#while)


<!-- div -->


<!-- div -->

## `Observable Instance Methods`
- [aggregate](#aggregate)
- [all](#all)
- [amb](#amb2)
- [and](#and)
- [any](#any)
- [asObservable](#asObservable)
- [average](#average)
- [buffer](#buffer)
- [bufferWithCount](#bufferWithCount)
- [bufferWithTime](#bufferWithTime)
- [bufferWithTimeOrCount](#bufferWithTimeOrCount)
- [catchException](#catchException2)
- [combineLatest](#combineLatest)
- [concat](#concat2)
- [contains](#contains)
- [count](#count)
- [defaultIfEmpty](#defaultIfEmpty)
- [delay](#delay)
- [dematerialize](#dematerialize)
- [distinct](#distinct)
- [distinctUntilChanged](#distinctUntilChanged)
- [doAction](#doAction)
- [doWhile](#doWhile)
- [elementAt](#elementAt)
- [elementAtOrDefault](#elementAtOrDefault)
- [empty](#empty)
- [every](#empty)
- [expand](#expand)
- [filter](#filter)
- [finallyAction](#finallyAction)
- [first](#first)
- [firstOrDefault](#firstOrDefault)
- [forkJoin](#forkJoin2)
- [groupBy](#groupBy)
- [groupByUntil](#groupByUntil)
- [groupJoin](#groupJoin)
- [ignoreElements](#ignoreElements)
- [isEmpty](#isEmpty)
- [join](#join)
- [last](#first)
- [lastOrDefault](#lastOrDefault)
- [manySelect](#manySelect)
- [map](#max)
- [max](#max)
- [maxBy](#maxBy)
- [merge](#merge2)
- [mergeObservable](#mergeObservable)
- [min](#min)
- [minBy](#minBy)
- [multicast](#multicast)
- [observeOn](#observeOn)
- [onErrorResumeNext](#onErrorResumeNext2)
- [publish](#publish)
- [publishLast](#publishLast)
- [publishValue](#publishValue)
- [refCount](#refCount)
- [reduce](#reduce)
- [repeat](#repeat2)
- [replay](#replay)
- [retry](#retry)
- [sample](#sample)
- [scan](#scan)
- [select](#select)
- [selectMany](#selectMany)
- [single](#single)
- [singleOrDefault](#singleOrDefault)
- [skip](#skip)
- [skipLast](#skipLast)
- [skipUntil](#skipUntil)
- [skipWhile](#skipWhile)
- [some](#some)
- [startWith](#startWith)
- [subscribe](#subscribe)
- [subscribeOn](#subscribeOn)
- [sum](#sum)
- [switchLatest](#switchLatest)
- [take](#take)
- [takeLast](#takeLast)
- [takeLastBuffer](#takeLastBuffer)
- [takeUntil](#takeUntil)
- [takeWhile](#takeWhile)
- [throttle](#throttle)
- [throwException](#throwException)
- [timeInterval](#timeInterval)
- [timeout](#timeout)
- [toArray](#toArray)
- [using](#using)
- [where](#where)
- [window](#window)
- [windowWithCount](#windowWithCount)
- [windowWithTime](#windowWithTime)
- [windowWithTimeOrCount](#windowWithTimeOrCount)
- [zip](#zip)

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
var obs = Rx.Observable.amb(
	Rx.Observable.timer(500).select(function () { return 'foo'; }),
	Rx.Observable.timer(200).select(function () { return 'bar'; })
);

obs.subscribe( function (x) {
	console.log(x);
});

// => 'bar'
```

### Location

- rx.js

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

* * *

### <a id="catchException1"></a>`Rx.Observable.catchException(...)`
<a href="#catchException1">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2920-L2923 "View in source") [&#x24C9;][1]

Continues an observable sequence that is terminated by an exception with the next observable sequence.

#### Arguments
1. `array` *(Array|arguments)*: Observable sequences to catch exceptions for.

#### Returns
*(Observable)*: An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.

#### Example
```js
var obs1 = Rx.Observable.throwException(new Error('error'));
var obs2 = Rx.Observable.returnValue(42);

var obs3 = Rx.Observable.catchException(obs1, obs2);

obs3.subscribe( function (x) {
    console.log(x);
});

// => 42
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

var obs = Rx.Observable.concat(source1, source2);

obs.subscribe( function (x) {
	console.log(x);
});

// => 42
// => 56
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

var subscription = source.subscribe(function (x) {
	console.log(x);
});

// => 42

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

var subscription = source.subscribe(function (x) {
	console.log(x);
});

// => 42

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

var subscription = source.subscribe(function (x) {
	console.log(x);
});

// => 42
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
	function (x) { console.log('next: ' + x),
	function (err) { console.log('error: ' + err); },
	function () { console.log('completed'); }
);

// => completed
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

var subscription = source.subscribe(function (x) {
	console.log(x);
});

// => 1
// => 2
// => 3
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

var subscription = source.subscribe(function (x) {
	console.log(x);
});

// => [42, 9, 3]
```

### Location

- rx.experimental.js

* * *

### <a id="fromArray"></a>`Rx.Observable.fromArray(array, [scheduler])`
<a href="#fromArray">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") [&#x24C9;][1]

Converts an array to an observable sequence, using an optional scheduler to enumerate the array.

#### Arguments
1. `array` *(Array)*: An array to convert to an Observable sequence.
2. `[scheduler=Rx.Scheduler.currentThread] *(Scheduler)*: Scheduler to run the enumeration of the input sequence on.

#### Returns
*(Observable)*: The observable sequence whose elements are pulled from the given enumerable sequence.

#### Example
```js
var array = [1,2,3];

var source = Rx.Observable.fromArray(array);

var subscription = source.subscribe(function (x) {
	console.log(x);
});

// => 1
// => 2
// => 3
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

var subscription = source.subscribe(function (x) {
	console.log(x);
});

// => 0
// => 1
// => 2
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
);

var subscription = source.timeInterval().subscribe(function (x) {
	console.log(x);
});

// => {value: 1, interval: 100}
// => {value: 2, interval: 200}
// => {value: 3, interval: 300}
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
);

var subscription = source.timeInterval().subscribe(function (x) {
	console.log(x);
});

// => {value: 1, interval: 117}
// => {value: 2, interval: 222}
// => {value: 3, interval: 304}
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

var subscription = source.subscribe(function (x) {
	console.log(x);
});

// => 42

// The next example uses an elseSource
var shouldRun = false;

var source = Rx.Observable.if(
	function () { return shouldRun; },
	Rx.Observable.return(42),
	Rx.Observable.return(56)
);

var subscription = source.subscribe(function (x) {
	console.log(x);
});

//=> 56
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
       console.log(x); 
    });

//=> {value: 0, interval: 501}
//=> {value: 1, interval: 501}
//=> {value: 2, interval: 501} 
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


var subscription = source.take(5).subscribe(
    function (x) {
       console.log(x); 
    });

//=> 100
//=> 150
//=> 100
//=> 150
//=> 100 
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
	function (x) { console.log('Next:' + x); },
	function (err) { console.log('Error: ' + err); },
	function () { console.log('Completed'); }
);
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
	function (x) { console.log('Next' + x); },
	function (err) { console.log('Error'); },
	function () { console.log('Completed'); }
);

//=> Next: 42
//=> Completed 
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

//=> Next: 0 
//=> Next: 1
//=> Next: 2 
//=> Completed 
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
//=> Next: 42
//=> Next: 42
//=> Completed 
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

//=> Next: 42 
//=> Completed 
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

//=> Next: 42 
//=> Completed 
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

//=> Next: 200
//=> Next: 100
//=> Next: 100
Completed 
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

//=> Next: 7
Completed 
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
	Rx.Observable.timer(200).and(Rx.Observable.timer(300)).then(function (x, y) { return Rx.Observable.return('first'); }),
	Rx.Observable.timer(400).and(Rx.Observable.timer(500)).then(function (x, y) { return Rx.Observable.return('second'); }),
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

//=> Next: first
Completed 
```

### Location

- rx.joinpatterns.js

* * *

### <a id="while"></a>`Rx.Observable.while(condition, source)`
<a href="#when">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L126-L128 "View in source") [&#x24C9;][1]

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

//=> Next: 42
//=> Next: 42
//=> Next: 42
Completed 
```

### Location

- rx.joinpatterns.js

* * *

## _Observable Instance Methods_ ##

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

var subscription = source.subscribe(function (x) {
	console.log(x);
});

// => 42
// => 42
```

* * *