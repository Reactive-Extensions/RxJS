# Rx.js <sup>v2.1.8</sup>

<!-- div -->

# Observable object #

The Observable object represents a push based collection.

The Observer and Objects interfaces provide a generalized mechanism for push-based notification, also known as the observer design pattern. The Observable object represents the object that sends notifications (the provider); the Observer object represents the class that receives them (the observer). 

<!-- div -->

## <a id="Observable1"></a>`Observable Methods`
- [amb](#amb1)
- [catchException](#catchException1)
- [concat](#concat1)
- [create](#create)
- [createWithDisposable](#createWithDisposable)
- [defer](#defer)
- [doWhile](#doWhile)
- [forIn](#forIn)
- [forkJoin](#forkJoin1)
- [fromArray](#fromArray)
- [generate](#generate)
- [generateWithAbsoluteTime](#generateWithAbsoluteTime)
- [generateWithRelativeTime](#generateWithRelativeTime)
- [ifThen](#ifThen)
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

## <a id="Observable2"></a>`Observable Instance Methods`
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
- [expand](#expand)
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
- [repeat](#repeat2)
- [replay](#replay)
- [retry](#retry)
- [sample](#sample)
- [scan](#scan)
- [select](#select)
- [selectMany](#selectMany)
- [single](#single)
- [singleOrDefault](#singleOrDefault)
- [skip](#single)
- [skipLast](#singleOrDefault)
- [skipUntil](#skipUntil)
- [skipWhile](#skipWhile)
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