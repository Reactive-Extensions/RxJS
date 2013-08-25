# Observable object #

The Observable object represents a push based collection.

The Observer and Objects interfaces provide a generalized mechanism for push-based notification, also known as the observer design pattern. The Observable object represents the object that sends notifications (the provider); the Observer object represents the class that receives them (the observer). 

<!-- div -->

## `Observable Methods`
- [amb](#amb1)
- [catchException](#catchException1)
- [concat](#concat1)
- [create](#create)
- [createWithDisposable](#createWithDisposable)
- [defer](#defer)
- [empty](#empty)
- [for](#for)
- [forkJoin](#forkJoin1)
- [fromArray](#fromArray)
- [generate](#generate)
- [generateWithAbsoluteTime](#generateWithAbsoluteTime)
- [generateWithRelativeTime](#generateWithRelativeTime)
- [if](#if)
- [interval](#interval)
- [merge](#merge1)
- [never](#never)
- [onErrorResumeNext](#onErrorResumeNext1)
- [range](#range)
- [repeat](#repeat1)
- [returnValue](#returnValue)
- [start](#start)
- [switchCase](#switchCase)
- [timer](#timer)
- [toAsync](#toAsync)
- [when](#when)
- [whileDo](#whileDo)


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

### <a id="amb1"></a>`Rx.Observable.amb`
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

* * *

### <a id="catchException1"></a>`Rx.Observable.catchException`
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

* * *

### <a id="concat1"></a>`Rx.Observable.concat`
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

* * *

### <a id="create"></a>`Rx.Observable.create`
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

* * *

### <a id="createWithDisposable"></a>`Rx.Observable.createWithDisposable`
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

* * *

### <a id="defer"></a>`Rx.Observable.defer`
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

* * *

### <a id="empty"></a>`Rx.Observable.empty`
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

* * *

### <a id="for"></a>`Rx.Observable.for`
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

* * *

### <a id="forkJoin"></a>`Rx.Observable.forkJoin`
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

// => 42
// => 9
// => 3
```

* * *

### <a id="fromArray"></a>`Rx.Observable.fromArray`
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

* * *

### <a id="generate"></a>`Rx.Observable.generate`
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

// => 1
// => 2
// => 3
```

* * *

## _Observable Instance Methods_ ##

### <a id="doWhile"></a>`Rx.Observable.prototype.doWhile`
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