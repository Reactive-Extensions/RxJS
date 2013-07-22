# Rx.js <sup>v2.1.5</sup>

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