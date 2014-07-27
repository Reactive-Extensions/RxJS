# Observable object #

The Observable object represents a push based collection.

The Observer and Objects interfaces provide a generalized mechanism for push-based notification, also known as the observer design pattern. The Observable object represents the object that sends notifications (the provider); the Observer object represents the class that receives them (the observer). 

<!-- div -->

## `Observable Methods`
- [`amb`](operators/amb.md)
- [`case | switchCase`](operators/case.md)
- [`catch | catchException`](operators/catch.md)
- [`combineLatest`](operators/combinelatest.md)
- [`concat`](operators/concat.md)
- [`create`](operators/create.md)
- [`defer`](operators/defer.md)
- [`empty`](operators/empty.md)
- [`for | forIn`](operators/for.md)
- [`forkJoin`](operators/forkjoin.md)
- [`from`](operators/from.md)
- [`fromArray`](operators/fromarray.md)
- [`fromCallback`](operators/fromcallback.md)
- [`fromEvent`](operators/fromevent.md)
- [`fromEventPattern`](operators/fromeventpattern.md)
- [`fromNodeCallback`](operators/fromnodecallback.md)
- [`fromPromise`](operators/frompromise.md)
- [`generate`](operators/generate.md)
- [`generateWithAbsoluteTime`](operators/generatewithabsolutetime.md)
- [`generateWithRelativeTime`](operators/generatewithrelativetime.md)
- [`if | ifThen`](operators/if.md)
- [`interval`](operators/interval.md)
- [`just`](operators/return.md)
- [`merge`](operators/merge.md)
- [`never`](operators/never.md)
- [`of`](operators/of.md)
- [`ofWithScheduler`](operators/ofwithscheduler.md)
- [`onErrorResumeNext`](operators/onerrorresumenext.md)
- [`range`](operators/range.md)
- [`repeat`](operators/repeat.md)
- [`return | returnValue`](operators/return.md)
- [`start`](operators/start.md)
- [`startAsync`](operators/startasync.md)
- [`throw | throwException`](operators/throw.md)
- [`timer`](operators/timer.md)
- [`toAsync`](operators/toasync.md)
- [`using`](operators/using.md)
- [`when`](operators/when.md)
- [`while | whileDo`](operators/while.md)
- [`zip`](operators/zip.md)
- [`zipArray`](operators/ziparray.md)

<!-- div -->


<!-- div -->

## `Observable Instance Methods`
- [`aggregate`](operators/aggregate.md)
- [`all`](operators/all.md)
- [`amb`](operators/ambproto.md)
- [`and`](operators/and.md)
- [`any`](operators/any.md)
- [`asObservable`](operators/asobservable.md)
- [`average`](operators/average.md)
- [`buffer`](operators/buffer.md)
- [`bufferWithCount`](operators/bufferwithcount.md)
- [`bufferWithTime`](operators/bufferwithtime.md)
- [`bufferWithTimeOrCount`](operators/bufferwithtimeorcount.md)
- [`catch | catchException`](operators/catchproto.md)
- [`combineLatest`](operators/combinelatestproto.md)
- [`concat`](operators/concatproto.md)
- [`concatAll`](operators/concatall.md)
- [`concatMap`](operators/concatmap.md)
- [`connect`](operators/connect.md)
- [`contains`](operators/contains.md)
- [`controlled`](operators/controlled.md)
- [`count`](operators/count.md)
- [`defaultIfEmpty`](operators/defaultifempty.md)
- [`delay`](operators/delay.md)
- [`delayWithSelector`](operators/delaywithselector.md)
- [`dematerialize`](operators/dematerialize.md)
- [`distinct`](operators/distinct.md)
- [`distinctUntilChanged`](operators/distinctuntilchanged.md)
- [`do | doAction`](operators/do.md)
- [`doWhile`](operators/dowhile.md)
- [`elementAt`](operators/elementat.md)
- [`elementAtOrDefault`](operators/elementatordefault.md)
- [`every`](operators/all.md)
- [`expand`](operators/expand.md)
- [`filter`](operators/where.md)
- [`finally | finallyAction`](operators/finally.md)
- [`find`](operators/find.md)
- [`findIndex`](operators/findindex.md)
- [`first`](operators/first.md)
- [`firstOrDefault`](operators/firstordefault.md)
- [`flatMap`](operators/selectmany.md)
- [`flatMapLatest`](operators/flatmaplatest.md)
- [`forkJoin`](operators/forkjoinproto.md)
- [`groupBy`](operators/groupby.md)
- [`groupByUntil`](operators/groupbyuntil.md)
- [`groupJoin`](operators/groupjoin.md)
- [`ignoreElements`](operators/ignoreelements.md)
- [`isEmpty`](operators/isempty.md)
- [`join`](operators/join.md)
- [`last`](operators/last.md)
- [`lastOrDefault`](operators/lastordefault.md)
- [`let | letBind`](operators/let.md)
- [`manySelect`](operators/manyselect.md)
- [`map`](operators/select.md)
- [`max`](operators/max.md)
- [`maxBy`](operators/maxby.md)
- [`merge`](operators/mergeproto.md)
- [`mergeAll`](operators/mergeall.md)
- [`min`](operators/min.md)
- [`minBy`](operators/minby.md)
- [`multicast`](operators/multicast.md)
- [`observeOn`](operators/observeon.md)
- [`onErrorResumeNext`](operators/onerrorresumenextproto.md)
- [`pairwise`](operators/pairwise.md)
- [`partition`](operators/partition.md)
- [`pausable`](operators/pausable.md)
- [`pausableBuffered`](operators/pausablebuffered.md)
- [`pluck`](operators/pluck.md)
- [`publish`](operators/publish.md)
- [`publishLast`](operators/publishlast.md)
- [`publishValue`](operators/publishvalue.md)
- [`share`](operators/share.md)
- [`shareReplay`](operators/sharereplay.md)
- [`shareValue`](operators/sharevalue.md)
- [`refCount`](operators/refcount.md)
- [`reduce`](operators/reduce.md)
- [`repeat`](operators/repeatproto.md)
- [`replay`](operators/replay.md)
- [`retry`](operators/retry.md)
- [`sample`](operators/sample.md)
- [`scan`](operators/scan.md)
- [`select`](operators/select.md)
- [`selectConcat`](operators/concatmap.md)
- [`selectMany`](operators/selectmany.md)
- [`selectSwitch`](operators/flatmaplatest.md)
- [`sequenceEqual`](operators/sequenceequal.md)
- [`single`](operators/single.md)
- [`singleOrDefault`](operators/singleordefault.md)
- [`skip`](operators/skip.md)
- [`skipLast`](operators/skiplast.md)
- [`skipLastWithTime`](operators/skiplastwithtime.md)
- [`skipUntil`](operators/skipuntil.md)
- [`skipUntilWithTime`](operators/skipuntilwithtime.md)
- [`skipWhile`](operators/skipwhile.md)
- [`some`](operators/any.md)
- [`startWith`](operators/startwith.md)
- [`subscribe`](operators/subscribe.md)
- [`subscribeOn`](operators/subscribeon.md)
- [`sum`](operators/sum.md)
- [`switch | switchLatest`](operators/switch.md)
- [`take`](operators/take.md)
- [`takeLast`](operators/takelast.md)
- [`takeLastBuffer`](operators/takelastbuffer.md)
- [`takeLastBufferWithTime`](operators/takelastbufferwithtime.md)
- [`takeLastWithTime`](operators/takelastwithtime.md)
- [`takeUntil`](operators/takeuntil.md)
- [`takeUntilWithTime`](operators/takeuntilwithtime.md)
- [`takeWhile`](operators/takewhile.md)
- [`tap`](operators/do.md)
- [`throttle`](operators/throttle.md)
- [`throttleWithSelector`](operators/throttlewithselector.md)
- [`timeInterval`](operators/timeinterval.md)
- [`timeout`](operators/timeout.md)
- [`timeoutWithSelector`](operators/timeoutwithselector.md)
- [`timestamp`](operators/timestamp.md)
- [`toArray`](operators/toarray.md)
- [`where`](operators/where.md)
- [`window`](operators/window.md)
- [`windowWithCount`](operators/windowwithcount.md)
- [`windowWithTime`](operators/windowwithtime.md)
- [`windowWithTimeOrCount`](operators/windowwithtimeorcount.md)
- [`zip`](operators/zipproto.md)

## _Observable Instance Methods_ ##

### <a id="rxobservableprototypeletfunc"></a>`Rx.Observable.prototype.let(func)`
<a href="#rxobservableprototypeletfunc">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L76-L78 "View in source") 

Returns an observable sequence that is the result of invoking the selector on the source sequence, without sharing subscriptions.

This operator allows for a fluent style of writing queries that use the same sequence multiple times.  There is an alias of `letBind` for browsers older than IE 9.

#### Arguments
1. `func` *(`Function`)*: Selector function which can use the source sequence as many times as needed, without sharing subscriptions to the source sequence.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.

#### Example
```js
var obs = Rx.Observable.range(1, 3);

var source = obs.let(function (o) { return o.concat(o); });

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
// => Next: 1 
// => Next: 2 
// => Next: 3 
// => Completed 
```

#### Location

- [`rx`](https://www.npmjs.org/package/rx).experimental.js

* * *

### <a id="rxobservableprototypemanyselectselector-scheduler"></a>`Rx.Observable.prototype.manySelect(selector, [scheduler])`
<a href="#rxobservableprototypemanyselectselector-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L634-L639 "View in source") 

Comonadic bind operator.

#### Arguments
1. `selector` *(`Function`)*: A transform function to apply to each element.
2. `[scheduler=Rx.Scheduler.immediate]` *(`Scheduler`)*: Scheduler used to execute the operation. If not specified, defaults to the `Rx.Scheduler.immediate` scheduler.
 
#### Returns
*(`Observable`)*: An observable sequence which results from the comonadic bind operation.

#### Example
```js
var source = Rx.Observable.range(0, 3)
    .manySelect(function (ys) { return ys.first(); })
    .mergeAll();

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

- [`rx`](https://www.npmjs.org/package/rx).experimental.js

* * *

### <a id="rxobservableprototypemapselector-thisarg"></a>`Rx.Observable.prototype.map(selector, [thisArg])`
<a href="#rxobservableprototypemapselector-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js#L4311-L4326 "View in source") 

Projects each element of an observable sequence into a new form by incorporating the element's index.  This is an alias for the `select` method.

#### Arguments
1. `selector` *(`Function`)*:  Transform function to apply to each source element.  The selector is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(`Any`)*: Object to use as `this` when executing the predicate.
 
#### Returns
*(`Observable`)*: An observable sequence which results from the comonadic bind operation.

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

- [`rx`](https://www.npmjs.org/package/rx)

* * *

### <a id="rxobservableprototypemaxcomparer"></a>`Rx.Observable.prototype.max([comparer])`
<a href="#rxobservableprototypemaxcomparer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/max.js "View in source") 

Returns the maximum value in an observable sequence according to the specified comparer.

#### Arguments
1. `[comparer]` *(`Function`)*:  Comparer used to compare elements.
 
#### Returns
*(`Observable`)*: An observable sequence containing a single element with the maximum element in the source sequence.

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

### Location

File:
- [`/src/core/observable/max.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/max.js)

Dist:
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js)

Prerequisites:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/max.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/max.js)

* * *

### <a id="rxobservableprototypemaxbykeyselector-comparer"></a>`Rx.Observable.prototype.maxBy(keySelector, [comparer])`
<a href="#rxobservableprototypemaxbykeyselector-comparer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/maxby.js "View in source") 

Returns the maximum value in an observable sequence according to the specified comparer.

#### Arguments
1. `keySelector` *(`Function`)*: Key selector function.
2. `[comparer]` *(`Function`)*:  Comparer used to compare elements.
 
#### Returns
*(`Observable`)*: An observable sequence containing a list of zero or more elements that have a maximum key value.
 
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

### Location

File:
- [`/src/core/observable/maxby.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/maxby.js)

Dist:
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js)

Prerequisites:
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/maxby.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/maxby.js)

* * *

### <a id="rxobservableprototypemergemaxconcurrent--other"></a>`Rx.Observable.prototype.merge(maxConcurrent | other)`
<a href="#rxobservableprototypemergemaxconcurrent--other">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/mergeproto.js "View in source") 

Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
Or merges two observable sequences into a single observable sequence.

#### Arguments
1. `maxConcurrent` *(`Function`)*: Maximum number of inner observable sequences being subscribed to concurrently.
1. `other` *(`Observable`)*:  The second observable sequence to merge into the first.
 
#### Returns
*(`Observable`)*: The observable sequence that merges the elements of the inner sequences. 
 
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

### Location

File:
- [`/src/core/observable/mergeproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/mergeproto.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/mergeproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/mergeproto.js)

* * *

### <a id="rxobservableprototypemergeall"></a>`Rx.Observable.prototype.mergeAll()`
<a href="#rxobservableprototypemergeall">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/mergeobservable.js "View in source") 

Merges an observable sequence of observable sequences into an observable sequence.

#### Returns
*(`Observable`)*: The observable sequence that merges the elements of the inner sequences. 
 
#### Example
```js
var source = Rx.Observable.range(0, 3)
    .map(function (x) { return Rx.Observable.range(x, 3); })
    .mergeAll();

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

### Location

File:
- [`/src/core/observable/mergeobservable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/mergeobservable.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/mergeobservable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/mergeobservable.js)

* * *

### <a id="rxobservableprototypemincomparer"></a>`Rx.Observable.prototype.min([comparer])`
<a href="#rxobservableprototypemincomparer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/min.js "View in source") 

Returns the minimum element in an observable sequence according to the optional comparer else a default greater than less than check.

#### Arguments
1. `[comparer]` *(`Function`)*:  Comparer used to compare elements.
 
#### Returns
*(`Observable`)*: An observable sequence containing a single element with the minimum element in the source sequence.
 
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

### Location

File:
- [`/src/core/observable/min.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/min.js)

Dist:
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js)

Prerequisites:
- If using [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
  - [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/min.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/min.js)

* * *

### <a id="rxobservableprototypeminbykeyselector-comparer"></a>`Rx.Observable.prototype.minBy(keySelector, [comparer])`
<a href="#rxobservableprototypeminbykeyselector-comparer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/minby.js "View in source") 

Returns the elements in an observable sequence with the minimum key value according to the specified comparer.

#### Arguments
1. `keySelector` *(`Function`)*: Key selector function.
2. `[comparer]` *(`Function`)*:  Comparer used to compare elements.
 
#### Returns
*(`Observable`)*: An observable sequence containing a list of zero or more elements that have a minimum key value.

#### Example
```js
/* Without comparer */
var source = Rx.Observable.fromArray([1,3,5,7,9,2,4,6,8,1])
    .minBy(function (x) { return x; });

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

### Location

File:
- [`/src/core/observable/minby.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/minby.js)

Dist:
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js)

Prerequisites:
- If using [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
  - [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/min.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/min.js)

* * *

### <a id="rxobservableprototypemulticastsubject--subjectselector-selector"></a>`Rx.Observable.prototype.multicast(subject | subjectSelector, [selector])`
<a href="#rxobservableprototypemulticastsubject--subjectselector-selector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/multicast.js "View in source") 

Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
invocation. For specializations with fixed subject types, see `publish`, `share`, `publishValue`, `shareValue`, `publishLast`, `replay`, and `shareReplay`.

#### Arguments
1. `subjectSelector` *(`Function`)*:  Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
1. `subject` *(Subject)*: Subject to push source elements into.
2. `[selector]` *(`Function`)*: Optional selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if `subjectSelector` is provided.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
 
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

### Location

File:
- [`/src/core/observable/multicast.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/multicast.js)

Dist:
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) 
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
  - [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/multicast.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/multicast.js)

* * *

### <a id="rxobservableprototypeobserveonscheduler"></a>`Rx.Observable.prototype.observeOn(scheduler)`
<a href="#rxobservableprototypeobserveonscheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/return.js "View in source") 

Wraps the source sequence in order to run its observer callbacks on the specified scheduler.

This only invokes observer callbacks on a scheduler. In case the subscription and/or unsubscription actions have side-effects that require to be run on a scheduler, use subscribeOn.

#### Arguments
1. `scheduler` *(`Scheduler`)*:  Scheduler to notify observers on.

#### Returns
*(`Observable`)*: The source sequence whose observations happen on the specified scheduler. 
 
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

### Location

File:
- [`/src/core/observable/return.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/return.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) 
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) 
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/return.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/return.js)

* * *

### <a id="rxobservableprototypeonerrorresumenextsecond"></a>`Rx.Observable.prototype.onErrorResumeNext(second)`
<a href="#rxobservableprototypeonerrorresumenextsecond">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/onerrorresumenext.js "View in source") 

Continues an observable sequence that is terminated normally or by an exception with the next observable sequence or Promise.

#### Arguments
1. `second` *(`Observable` | `Promise`)*:  Second observable sequence used to produce results after the first sequence terminates.

#### Returns
*(`Observable`)*: An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.

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

### Location

File:
- [`/src/core/observable/onerrorresumenext.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/onerrorresumenext.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) 
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) 
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/onerrorresumenext.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/onerrorresumenext.js)

* * *

### <a id="rxobservableprototypepausablepauser"></a>`Rx.Observable.prototype.pausable(pauser)`
<a href="#rxobservableprototypepausablepauser">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/backpressure/pausable.js "View in source") 

Pauses the underlying observable sequence based upon the observable sequence which yields true/false.  Note that this only works on hot observables.

#### Arguments
1. `pauser` *(Rx.Subject)*: The observable sequence used to pause the underlying sequence.

#### Returns
*(`Observable`)*: The observable sequence which is paused based upon the pauser.

#### Example
```js
var pauser = new Rx.Subject();
var source = Rx.Observable.fromEvent(document, 'mousemove').pausable(pauser);
    
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

// To begin the flow
pauser.onNext(true);

// To pause the flow at any point
pauser.onNext(false);
```

### Location

File:
- [/src/core/backpressure/pausable.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/backpressure/pausable.js)

Dist:
- [rx.backpressure.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.backpressure.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.backpressure.js`
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
    - [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-BackPressure`](http://www.nuget.org/packages/RxJS-BackPressure/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/pausable.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/pausable.js)

* * *

### <a id="rxobservableprototypepausablebufferedpauser"></a>`Rx.Observable.prototype.pausableBuffered(pauser)`
<a href="#rxobservableprototypepausablebufferedpauser">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/backpressure/pausablebuffered.js "View in source") 

Pauses the underlying observable sequence based upon the observable sequence which yields true/false, and yields the values that were buffered while paused. Note that this only works on hot observables.

#### Arguments
1. `pauser` *(Rx.Subject)*: The observable sequence used to pause the underlying sequence.

#### Returns
*(`Observable`)*: The observable sequence which is paused based upon the pauser.

#### Example
```js
var pauser = new Rx.Subject();
var source = Rx.Observable.interval(1000).pausableBuffered(pauser);
    
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

// To begin the flow
pauser.onNext(true);

// To pause the flow at any point
pauser.onNext(false);

// Resume the flow which empties the queue from when you last paused
pauser.onNext(true);
```
### Location

File:
- [/src/core/backpressure/pausablebuffered.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/backpressure/pausablebuffered.js)

Dist:
- [rx.backpressure.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.backpressure.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.backpressure.js`
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
    - [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-BackPressure`](http://www.nuget.org/packages/RxJS-BackPressure/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/pausablebuffered.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/pausablebuffered.js)

* * *

### <a id="rxobservableprototypepluckproperty"></a>`Rx.Observable.prototype.pluck(property)`
<a href="#rxobservableprototypepluckproperty">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/pluck.js "View in source") 

Projects each element of an observable sequence into a new form by incorporating the element's index.  This is an alias for the `select` method.

#### Arguments
1. `property` *(`String`)*: The property to pluck.
 
#### Returns
*(`Observable`)*: Returns a new Observable sequence of property values.

#### Example
```js
var source = Rx.Observable
    .fromArray([
        { value: 0 },
        { value: 1 },
        { value: 2 }
    ])
    .pluck('value');

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

File:
- [`/src/core/observable/pluck.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/pluck.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) 
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)

Unit Tests:
- [`/tests/observable/pluck.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/pluck.js)

* * *

### <a id="rxobservableprototypepublishselector"></a>`Rx.Observable.prototype.publish([selector])`
<a href="#rxobservableprototypepublishselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publish.js "View in source") 

Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.

This operator is a specialization of `multicast` using a regular `Rx.Subject`.

#### Arguments
1. `[selector]` *(`Function`)*: Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
  
#### Returns
*(ConnectableObservable)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   
#### Example
```js
/* Without publish */
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .do(function (x) { 
        console.log('Side effect');
    });
 
source.subscribe(createObserver('SourceA'));
source.subscribe(createObserver('SourceB'));
 
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
// => Side effect
// => Next: SourceB0 
// => Side effect
// => Next: SourceA1 
// => Completed
// => Side effect
// => Next: SourceB1 
// => Completed  

/* With publish */
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .doAction(function (x) { 
        console.log('Side effect');
    });
 
var published = source.publish();
 
published.subscribe(createObserver('SourceA'));
published.subscribe(createObserver('SourceB'));
 
var connection = published.connect();

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

### Location

File:
- [`/src/core/observable/publish.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publish.js)

Dist:
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) 
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.binding.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/publish.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/publish.js)

* * *

### <a id="rxobservableprototypeshare"></a>`Rx.Observable.prototype.share()`
<a href="#rxobservableprototypeshare">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publish.js "View in source") 

Returns an observable sequence that shares a single subscription to the underlying sequence. 

This operator is a specialization of `publish` which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
   
#### Example
```js
/* Without share */
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .doAction(function (x) { 
        console.log('Side effect');
    });
 
source.subscribe(createObserver('SourceA'));
source.subscribe(createObserver('SourceB'));
 
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
// => Side effect
// => Next: SourceB0 
// => Side effect
// => Next: SourceA1 
// => Completed
// => Side effect
// => Next: SourceB1 
// => Completed  

/* With share */
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .do(
        function (x) { 
            console.log('Side effect');
        });
 
var published = source.share();
 
// When the number of observers subscribed to published observable goes from 
// 0 to 1, we connect to the underlying observable sequence.
published.subscribe(createObserver('SourceA'));
// When the second subscriber is added, no additional subscriptions are added to the
// underlying observable sequence. As a result the operations that result in side 
// effects are not repeated per subscriber.
published.subscribe(createObserver('SourceB'));

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

### Location

File:
- [`/src/core/observable/publish.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publish.js)

Dist:
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) 
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.binding.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/publish.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/publish.js)

* * *

### <a id="rxobservableprototypepublishlatestselector"></a>`Rx.Observable.prototype.publishLatest([selector])`
<a href="#rxobservableprototypepublishlatestselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publishlatest.js "View in source") 

Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence containing only the last notification.

This operator is a specialization of `multicast` using a `Rx.AsyncSubject`.

#### Arguments
1. `[selector]` *(`Function`)*: Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will only receive the last notification of the source.

#### Returns
*(ConnectableObservable)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
 
#### Example
```js
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .doAction(function (x) { 
        console.log('Side effect');
    });
 
var published = source.publishLatest();
 
published.subscribe(createObserver('SourceA'));
published.subscribe(createObserver('SourceB'));
 
var connection = published.connect();

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
// => Side effect
// => Next: SourceA1 
// => Completed
// => Next: SourceB1 
// => Completed    
```

### Location

File:
- [`/src/core/observable/publishlatest.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publishlatest.js)

Dist:
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) 
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.binding.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/publishlatest.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/publishlatest.js)

* * *

### <a id="rxobservableprototypepublishvalueselector"></a>`Rx.Observable.prototype.publishValue([selector])`
<a href="#rxobservableprototypepublishvalueselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publishvalue.js "View in source") 

Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
   
This operator is a specialization of `multicast` using a `Rx.BehaviorSubject`.

#### Arguments
1. `[selector]` *(`Function`)*: Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive immediately receive the initial value, followed by all notifications of the source from the time of the subscription on.
 
#### Returns
*(ConnectableObservable)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
 
#### Example
```js
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .doAction(function (x) { 
        console.log('Side effect');
    });
 
var published = source.publishValue(42);
 
published.subscribe(createObserver('SourceA'));
published.subscribe(createObserver('SourceB'));
 
var connection = published.connect();

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

// => Next: SourceA42 
// => Next: SourceB42 
// => Side effect
// => Next: SourceA0 
// => Next: SourceB0 
// => Side effect
// => Next: SourceA1 
// => Next: SourceB1 
// => Completed 
// => Completed     
```

### Location

File:
- [`/src/core/observable/publishvalue.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publishvalue.js)

Dist:
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) 
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.binding.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/publishvalue.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/publishvalue.js)

* * *

### <a id="rxobservableprototypesharevalue"></a>`Rx.Observable.prototype.shareValue(value)`
<a href="#rxobservableprototypesharevalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publishvalue.js "View in source") 

Returns an observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
   
This operator is a specialization of `publishValue` which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
 
#### Example
```js
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .doAction(function (x) { 
        console.log('Side effect');
    });
 
var published = source.shareValue(42);
 
published.subscribe(createObserver('SourceA'));
published.subscribe(createObserver('SourceB'));

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

// => Next: SourceA42 
// => Next: SourceB42 
// => Side effect
// => Next: SourceA0 
// => Next: SourceB0 
// => Side effect
// => Next: SourceA1 
// => Next: SourceB1 
// => Completed 
// => Completed     
```

### Location

File:
- [`/src/core/observable/publishvalue.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publishvalue.js)

Dist:
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) 
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.binding.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/publishvalue.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/publishvalue.js)

* * *

### <a id="connectableobservableprototyperefcount"></a>`ConnectableObservable.prototype.refCount()`
<a href="#connectableobservableprototyperefcount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publish.js "View in source") 

Returns an observable sequence that stays connected to the source as long as there is at least one subscription to the observable sequence.
   
#### Returns
*(`Observable`)*: An observable sequence that stays connected to the source as long as there is at least one subscription to the observable sequence.
 
#### Example
```js
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .doAction(function (x) { 
        console.log('Side effect');
    });
 
var published = source.publish().refCount();
 
published.subscribe(createObserver('SourceA'));
published.subscribe(createObserver('SourceB'));

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
// => Completed     
```
### Location

File:
- [`/src/core/observable/publish.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publish.js)

Dist:
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) 
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.binding.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)

Unit Tests:
- [`/tests/observable/publish.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/publish.js)

* * *

### <a id="rxobservableprototypereduceaccumulator-seed"></a>`Rx.Observable.prototype.reduce(accumulator, [seed])`
<a href="#rxobservableprototypereduceaccumulator-seed">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/reduce.js "View in source") 

Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.

For aggregation behavior with incremental intermediate results, see the `scan` method.

#### Arguments
1. `accumulator` *(`Function`)*:  An accumulator function to be invoked on each element.
2. `[seed]` *(`Any`)*: The initial accumulator value.
 
#### Returns
*(`Observable`)*: An observable sequence containing a single element with the final accumulator value.

#### Example
```js
var source = Rx.Observable.range(1, 3)
    .reduce(function (acc, x) {
        return acc * x;
    }, 1)

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

// => Next: 6
// => Completed 
```

### Location

File:
- [`/src/core/observable/reduce.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/reduce.js)

Dist:
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/reduce.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/reduce.js)

* * *

### <a id="rxobservableprototyperepeatrepeatcount"></a>`Rx.Observable.prototype.repeat(repeatCount)`
<a href="#rxobservableprototyperepeatrepeatcount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/repeatproto.js "View in source") 

Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.
 
#### Arguments
1. `repeatCount` *(`Number`)*:  Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.
 
#### Returns
*(`Observable`)*: The observable sequence producing the elements of the given sequence repeatedly.  

#### Example
```js
var source = Rx.Observable.range(1, 3)
    .repeat(2);

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
// => Next: 1 
// => Next: 2 
// => Next: 3 
// => Completed 
```

### Location

File:
- [`/src/core/observable/repeatproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/repeatproto.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/repeatproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/repeatproto.js)

* * *

### <a id="rxobservableprototypereplayselector-buffersize-window-scheduler"></a>`Rx.Observable.prototype.replay([selector], [bufferSize], [window], [scheduler])`
<a href="#rxobservableprototypereplayselector-buffersize-window-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publish.js "View in source") 

Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.

This operator is a specialization of `multicast` using a `Rx.ReplaySubject`.

#### Arguments
1. `[selector]` *(`Function`)*: Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all the notifications of the source subject to the specified replay buffer trimming policy.
2. `[bufferSize]` *(`Number`)*: Maximum element count of the replay buffer.
3. `[window]` *(`Number`)*: Maximum time length of the replay buffer in milliseconds.
4. `[scheduler]` *(`Scheduler`)*: Scheduler where connected observers within the selector function will be invoked on.
 
#### Returns
*(`Observable`)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.

#### Example
```js
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .do(function (x) { 
        console.log('Side effect');
    });
 
var published = source
    .replay(function (x) {
        return x.take(2).repeat(2);    
    }, 3);
 
published.subscribe(createObserver('SourceA'));
published.subscribe(createObserver('SourceB'));

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
// => Side effect 
// => Next: SourceB0 
// => Side effect 
// => Next: SourceA1 
// => Next: SourceA0 
// => Next: SourceA1 
// => Completed 
// => Side effect 
// => Next: SourceB1 
// => Next: SourceB0 
// => Next: SourceB1 
// => Completed 
```

### Location

File:
- [`/src/core/observable/publish.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/publish.js)

Dist:
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.binding.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)

Unit Tests:
- [`/tests/observable/publish.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/publish.js)

* * *

### <a id="rxobservableprototypesharereplay"></a>`Rx.Observable.prototype.shareReplay([bufferSize], [window], [scheduler])`
<a href="#rxobservableprototypesharereplay">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sharereplay.js "View in source") 

Returns an observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.

This operator is a specialization of `replay` that connects to the connectable observable sequence when the number of observers goes from zero to one, and disconnects when there are no more observers.

#### Arguments
1. `[bufferSize]` *(`Number`)*: Maximum element count of the replay buffer.
2. `[window]` *(`Number`)*: Maximum time length of the replay buffer in milliseconds.
3. `[scheduler]` *(`Scheduler`)*: Scheduler where connected observers within the selector function will be invoked on.
 
#### Returns
*(`Observable`)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.

#### Example
```js
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(4)
    .doAction(function (x) { 
        console.log('Side effect');
    });
 
var published = source
    .shareReplay(3);
 
published.subscribe(createObserver('SourceA'));
published.subscribe(createObserver('SourceB'));

// Creating a third subscription after the previous two subscriptions have 
// completed. Notice that no side effects result from this subscription, 
// because the notifications are cached and replayed. 
Rx.Observable
    .return(true)
    .delay(6000)
    .flatMap(published)
    .subscribe(createObserver('SourceC'));
    
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
// => Side effect
// => Next: SourceA2
// => Next: SourceB2
// => Side effect
// => Next: SourceA3
// => Next: SourceB3
// => Completed
// => Completed
// => Next: SourceC1
// => Next: SourceC2
// => Next: SourceC3
// => Completed 
```

### Location

File:
- [`/src/core/observable/sharereplay.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sharereplay.js)

Dist:
- [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.binding.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Binding`](http://www.nuget.org/packages/RxJS-Binding/)

Unit Tests:
- [`/tests/observable/sharereplay.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/sharereplay.js)

* * *

### <a id="rxobservableprototyperetryretrycount"></a>`Rx.Observable.prototype.retry([retryCount])`
<a href="#rxobservableprototyperetryretrycount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/retry.js "View in source") 

Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
Note if you encounter an error and want it to retry once, then you must use .retry(2).

#### Arguments
1. `[retryCount]` *(`Number`)*:  Number of times to retry the sequence. If not provided, retry the sequence indefinitely.
 
#### Returns
*(`Observable`)*: An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully. 

#### Example
```js
var count = 0;

var source = Rx.Observable.interval(1000)
    .selectMany(function () {
        if (++count < 2) {
            return Rx.Observable.throw(new Error());
        }
        return Rx.Observable.return(42);
    })
    .retry(3)
    .take(1);

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

File:
- [`/src/core/observable/retry.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/retry.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/retry.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/retry.js)

* * *

### <a id="rxobservableprototypesampleinterval--sampleobservable"></a>`Rx.Observable.prototype.sample(interval | sampleObservable)`
<a href="#rxobservableprototypesampleinterval--sampleobservable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sample.js "View in source") 

Samples the observable sequence at each interval.

#### Arguments
1. `[interval]` *(`Number`)*: Interval at which to sample (specified as an integer denoting milliseconds)
2. `[sampleObservable]` *(`Observable`)*: Sampler Observable.
3. `[scheduler=Rx.Scheduler.timeout]` *(`Scheduler`)*: Scheduler to run the sampling timer on. If not specified, the timeout scheduler is used.
 
#### Returns
*(`Observable`)*: Sampled observable sequence.

#### Example
```js
/* With an interval time */
var source = Rx.Observable.interval(1000)
    .sample(5000)
    .take(2);

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

// => Next: 3
// => Next: 8
// => Completed 

/* With a sampler */
var source = Rx.Observable.interval(1000)
    .sample(Rx.Observable.interval(5000))
    .take(2);

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

// => Next: 3
// => Next: 8
// => Completed
```

### Location

File:
- [`/src/core/observable/sample.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sample.js)

Dist:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.time.js`
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/sample.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/sample.js)

* * *

### <a id="rxobservableprototypescanseed-accumulator"></a>`Rx.Observable.prototype.scan([seed], accumulator)`
<a href="#rxobservableprototypescanseed-accumulator">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/scan.js "View in source") 

Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.

For aggregation behavior with no intermediate results, see `Rx.Observable.aggregate`.

#### Arguments
1. `[seed]` *(`Any`)*: The initial accumulator value.
2. `accumulator` *(`Function`)*: An accumulator function to be invoked on each element.
 
#### Returns
*(`Observable`)*: An observable sequence which results from the comonadic bind operation.

#### Example
```js
/* Without a seed */
var source = Rx.Observable.range(1, 3)
    .scan(
        function (acc, x) {
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

// => Next: 1
// => Next: 3
// => Next: 6
// => Completed 

/* With a seed */
var source = Rx.Observable.range(1, 3)
    .scan(
        1,
        function (acc, x) {
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

// => Next: 1
// => Next: 2
// => Next: 6
// => Completed 
```

### Location

File:
- [`/src/core/observable/scan.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/scan.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/scan.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/scan.js)

* * *

### <a id="rxobservableprototypeselectselector-thisarg"></a>`Rx.Observable.prototype.select(selector, [thisArg])`
<a href="#rxobservableprototypeselectselector-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/select.js "View in source") 

Projects each element of an observable sequence into a new form by incorporating the element's index.  This is an alias for the `map` method.

#### Arguments
1. `selector` *(`Function`)*:  Transform function to apply to each source element.  The selector is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(`Any`)*: Object to use as `this` when executing the predicate.
 
#### Returns
*(`Observable`)*: An observable sequence which results from the comonadic bind operation.

#### Example
```js
var source = Rx.Observable.range(1, 3)
    .select(function (x, idx, obs) {
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

### Location

File:
- [`/src/core/observable/select.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/select.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/select.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/select.js)

* * *

### <a id="rxobservableprototypeselectmanyselector-resultselector"></a>`Rx.Observable.prototype.selectMany(selector, [resultSelector])`
<a href="#rxobservableprototypeselectmanyselector-resultselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/selectmany.js "View in source") 

One of the following:

Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences or Promises into one observable sequence.

```js
source.selectMany(function (x, i) { return Rx.Observable.range(0, x); });
source.selectMany(function (x, i) { return Promise.resolve(x + 1}; });
```

Projects each element of an observable sequence or Promise to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.

```js
source.selectMany(function (x, i) { return Rx.Observable.range(0, x); }, function (x, y, i) { return x + y + i; });
source.selectMany(function (x, i) { return Promise.resolve(x + i); }, function (x, y, i) { return x + y + i; });
```

Projects each element of the source observable sequence to the other observable sequence or Promise and merges the resulting observable sequences into one observable sequence.
 
 ```js
source.selectMany(Rx.Observable.fromArray([1,2,3]));
source.selectMany(Promise.resolve(42));
 ```

#### Arguments
1. `selector` *(`Function`)*:  A transform function to apply to each element or an observable sequence to project each element from the source sequence onto.
2. `[resultSelector]` *(`Function`)*: A transform function to apply to each element of the intermediate sequence.
 
#### Returns
*(`Observable`)*: An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.   

#### Example
```js
var source = Rx.Observable
    .range(1, 2)
    .selectMany(function (x) {
        return Rx.Observable.range(x, 2);    
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
// => Next: 2 
// => Next: 3 
// => Completed 

/* Using a promise */
var source = Rx.Observable.fromArray([1,2,3,4])
    .selectMany(function (x, i) {
        return Promise.resolve(x + i);
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

// => Next: 4
// => Next: 4 
// => Next: 4 
// => Next: 4 
// => Completed    
```

### Location

File:
- [/src/core/observable/selectmany.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/observable/selectmany.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/selectmany.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/selectmany.js)

* * *

### <a id="rxobservableprototypeselectconcatselector-resultselector"></a>`Rx.Observable.prototype.selectConcat(selector, [resultSelector])`
<a href="#rxobservableprototypeselectconcatselector-resultselector">#</a> [&#x24C8;]((https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/observable/concatmap.js "View in source") 

This is an alias for the `concatMap` method.  This can be one of the following:

Projects each element of an observable sequence to an observable sequence and concatenates the resulting observable sequences or Promises into one observable sequence.

```js
source.selectConcat(function (x, i) { return Rx.Observable.range(0, x); });
source.selectConcat(function (x, i) { return Promise.resolve(x + 1}; });
```

Projects each element of an observable sequence or Promise to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and concatenates the results into one observable sequence.

```js
source.selectConcat(function (x, i) { return Rx.Observable.range(0, x); }, function (x, y, i) { return x + y + i; });
source.selectConcat(function (x, i) { return Promise.resolve(x + i); }, function (x, y, i) { return x + y + i; });
```

Projects each element of the source observable sequence to the other observable sequence or Promise and merges the resulting observable sequences into one observable sequence.
 
 ```js
source.selectConcat(Rx.Observable.fromArray([1,2,3]));
source.selectConcat(Promise.resolve(42));
 ```

#### Arguments
1. `selector` *(`Function`)*:  A transform function to apply to each element or an observable sequence to project each element from the source sequence onto.
2. `[resultSelector]` *(`Function`)*: A transform function to apply to each element of the intermediate sequence.
 
#### Returns
*(`Observable`)*: An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.   

#### Example
```js
var source = Rx.Observable.range(0, 5)
    .selectConcat(function (x, i) {
        return Rx.Observable
            .interval(100)
            .take(x).map(function() { return i; }); 
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
// => Next: 2 
// => Next: 3 
// => Next: 3 
// => Next: 3 
// => Next: 4 
// => Next: 4 
// => Next: 4 
// => Next: 4 
// => Completed 

/* Using a promise */
var source = Rx.Observable.fromArray([1,2,3,4])
    .selectConcat(function (x, i) {
        return Promise.resolve(x + i);
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

// => Next: 4
// => Next: 4 
// => Next: 4 
// => Next: 4 
// => Completed    
```

### Location

File:
- [/src/core/observable/concatmap.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/observable/concatmap.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete/)
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [/tests/observable/concatmap.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/concatmap.js)

* * *

### <a id="rxobservableprototypeselectswitchaselector-thisArg"></a>`Rx.Observable.prototype.selectSwitch(selector, [thisArg])`
<a href="#rxobservableprototypeselectswitchaselector-thisArg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/selectswitch.js "View in source") 

This is an alias for the `flatMapLatest` method.

 Projects each element of an observable sequence into a new sequence of observable sequences by incorporating the element's index and then transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.

#### Arguments
1. `selector` *(`Function`)*:  A transform function to apply to each source element.  The callback has the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(`Any`)*: Object to use as `this` when executing the predicate.
 
#### Returns
*(`Observable`)*: An observable sequence whose elements are the result of invoking the transform function on each element of source producing an Observable of Observable sequences and that at any point in time produces the elements of the most recent inner observable sequence that has been received.    

#### Example
```js
var source = Rx.Observable
    .range(1, 2)
    .selectSwitch(function (x) {
        return Rx.Observable.range(x, 2);    
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

// => Next: 3 
// => Completed 
```

### Location

File:
- [`/src/core/observable/selectswitch.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/selectswitch.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/selectswitch.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/selectswitch.js)

* * *

## <a id="rxobservableprototypesequenceequalsecond-comparer"></a>`Rx.Observable.prototype.sequenceEqual(second, [comparer])`
<a href="#rxobservableprototypesequenceequalsecond-comparer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sequenceequal.js "View in source") 

Determines whether two sequences are equal by comparing the elements pairwise using a specified equality comparer.

#### Arguments
1. `second` *(`Observable` | `Promise` | `Array`)*:  Second observable sequence, Promise or array to compare.
2. `[comparer]` *(`Function`)*: Comparer used to compare elements of both sequences.
 
#### Returns
*(`Observable`)*: An observable sequence that contains a single element which indicates whether both sequences are of equal length and their corresponding elements are equal according to the specified equality comparer.   

#### Example
```js
var source1 = Rx.Observable.return(42);
var source2 = Rx.Observable.return(42);

var source = source1.sequenceEqual(source2);

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

### Location

File:
- [`/src/core/observable/sequenceequal.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sequenceequal.js)

Dist:
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/sequenceequal.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/sequenceequal.js)

* * *

### <a id="rxobservableprototypesinglepredicate-thisarg"></a>`Rx.Observable.prototype.single([predicate], [thisArg])`
<a href="#rxobservableprototypesinglepredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/single.js "View in source") 

Returns the only element of an observable sequence that satisfies the condition in the optional predicate, and reports an exception if there is not exactly one element in the observable sequence.
 
#### Arguments
1. `[predicate]` *(`Function`)*: A predicate function to evaluate for elements in the source sequence. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(`Any`)*: Object to use as `this` when executing the predicate.

#### Returns
*(`Observable`)*: Sequence containing the single element in the observable sequence that satisfies the condition in the predicate.

#### Example
```js
/* No Match */
var source = Rx.Observable.empty()
    .single();

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
var source = Rx.Observable.return(42)
    .single();

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
    .single(function (x, idx, obs) { return x === 1; });

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

/* More than one match */
var source = Rx.Observable.range(0, 10)
    .single(function (x, idx, obs) { return x % 2 === 0; });

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

// => Error: Error: Sequence contains more than one element'
```

### Location

File:
- [`/src/core/observable/single.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/single.js)

Dist:
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/single.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/single.js)

* * *

### <a id="rxobservableprototypesingleordefaultpredicate-defaultvalue-thisarg"></a>`Rx.Observable.prototype.singleOrDefault(predicate, [defaultValue], [thisArg])`
<a href="#rxobservableprototypesingleordefaultpredicate-defaultvalue-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/singleordefault.js "View in source") 

Returns the first element of an observable sequence that satisfies the condition in the predicate, or a default value if no such element exists.

#### Arguments
1. `predicate` *(`Function`)*: A predicate function to evaluate for elements in the source sequence. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[defaultValue]` *(`Any`)*: The default value if no such element exists.  If not specified, defaults to null.
3. `[thisArg]` *(`Any`)*: Object to use as `this` when executing the predicate.

#### Returns
*(`Observable`)*: An observable sequence that contains elements from the input sequence that satisfy the condition.  

#### Example
```js
/* Without a predicate but default value */
var source = Rx.Observable.empty()
    .singleOrDefault(null, 42);

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
    .singleOrDefault(function (x, idx, obs) { return x ===  1; }, 0);

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

### Location

File:
- [`/src/core/observable/singleordefault.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/singleordefault.js)

Dist:
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/singleordefault.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/singleordefault.js)

* * *

### <a id="rxobservableprototypeskipcount"></a>`Rx.Observable.prototype.skip(count)`
<a href="#rxobservableprototypeskipcount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/skip.js "View in source") 

Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.

#### Arguments
1. `count` *(`Number`)*: The number of elements to skip before returning the remaining elements.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements that occur after the specified index in the input sequence.   

#### Example
```js
var source = Rx.Observable.range(0, 5)
    .skip(3);

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

// => Next: 3
// => Next: 4
// => Completed 
```

### Location

File:
- [`/src/core/observable/skip.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/skip.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/skip.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/skip.js)

* * *

### <a id="rxobservableprototypeskiplastcount"></a>`Rx.Observable.prototype.skipLast(count)`
<a href="#rxobservableprototypeskiplastcount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/skiplast.js "View in source") 

Bypasses a specified number of elements at the end of an observable sequence.

This operator accumulates a queue with a length enough to store the first `count` elements. As more elements are received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed. 

#### Arguments
1. `count` *(`Number`)*: Number of elements to bypass at the end of the source sequence.

#### Returns
*(`Observable`)*: An observable sequence containing the source sequence elements except for the bypassed ones at the end.   
  
#### Example
```js
var source = Rx.Observable.range(0, 5)
    .skipLast(3);

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
// => Completed 
```

### Location

File:
- [`/src/core/observable/skiplast.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/skiplast.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/skiplast.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/skiplast.js)

* * *

### <a id="rxobservableprototypeskiplastwithtimeduration"></a>`Rx.Observable.prototype.skipLastWithTime(duration)`
<a href="#rxobservableprototypeskiplastwithtimeduration">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/skiplastwithtime.js "View in source") 

Bypasses a specified number of elements at the end of an observable sequence.

This operator accumulates a queue with a length enough to store the first `count` elements. As more elements are received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed. 

#### Arguments
1. `duration` *(`Number`)*: Duration for skipping elements from the end of the sequence.
1. `[scheduler=Rx.Scheduler.timeout]` *(`Scheduler`)*: Scheduler to run the timer on. If not specified, defaults to timeout scheduler.

#### Returns
*(`Observable`)*: An observable sequence with the elements skipped during the specified duration from the end of the source sequence.
 
#### Example
```js
var source = Rx.Observable.timer(0, 1000)
    .take(10)
    .skipLastWithTime(5000);
    
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
// => Next: 3
// => Next: 4
// => Completed 
```

### Location

File:
- [`/src/core/observable/skiplastwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/skiplastwithtime.js)

Dist:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.time.js`
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/skiplastwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/skiplastwithtime.js)

* * *

### <a id="rxobservableprototypeskipuntilother"></a>`Rx.Observable.prototype.skipUntil(other)`
<a href="#rxobservableprototypeskipuntilother">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/skipuntil.js "View in source") 

Returns the values from the source observable sequence only after the other observable sequence produces a value.

#### Arguments
1. `other` *(`Observable` | `Promise`)*: The observable sequence or Promise that triggers propagation of elements of the source sequence.

#### Returns
*(`Observable`)*: An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.    

#### Example
```js
var source = Rx.Observable.timer(0, 1000)
    .skipUntil(Rx.Observable.timer(5000));

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

// => Next: 6
// => Next: 7
// => Next: 8
// => Completed 
```

### Location

File:
- [`/src/core/observable/skipuntil.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/skipuntil.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/skipuntil.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/skipuntil.js)

* * *

### <a id="rxobservableprototypeskipuntilstarttime-scheduler"></a>`Rx.Observable.prototype.skipUntilWithTime(startTime, [scheduler])`
<a href="#rxobservableprototypeskipuntilstarttime-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/skipuntil.js "View in source") 

Skips elements from the observable source sequence until the specified start time, using the specified scheduler to run timers.

Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the start time.

#### Arguments
1. `startTime` *(`Date` | `Number`)*: Time to start taking elements from the source sequence. If this value is less than or equal to current time, no elements will be skipped.
2. [`scheduler = Rx.Scheduler.timeout`] *(`Scheduler`)*: Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.

#### Returns
*(`Observable`)*: An observable sequence with the elements skipped until the specified start time.   

#### Example
```js
// Using relative time
var source = Rx.Observable.timer(0, 1000)
    .skipUntilWithTime(5000);

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

// => Next: 6
// => Next: 7
// => Next: 8
// => Completed 
```

### Location

File:
- [`/src/core/observable/skipuntilwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/skipuntilwithtime.js)

Dist:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.time.js`
  - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Time/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/skipuntilwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/skipuntilwithtime.js)

* * *

### <a id="rxobservableprototypeskipwhilepredicate-thisarg"></a>`Rx.Observable.prototype.skipWhile([predicate], [thisArg])`
<a href="#rxobservableprototypeskipwhilepredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/skipwhile.js "View in source") 

Bypasses elements in an observable sequence as long as a specified condition is true and then returns the remaining elements.

#### Arguments
1. `predicate` *(`Function`)*: A function to test each source element for a condition. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(`Any`)*: Object to use as this when executing callback.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.   
 
#### Example
```js
// With a predicate
var source = Rx.Observable.range(1, 5)
    .skipWhile(function (x) { return x < 3; });

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

// => Next: 3
// => Next: 4
// => Next: 5
// => Completed 
```

### Location

File:
- [`/src/core/observable/skipwhile.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/skipwhile.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/skipwhile.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/skipwhile.js)

* * *

### <a id="rxobservableprototypesomepredicate-thisarg"></a>`Rx.Observable.prototype.some([predicate], [thisArg])`
<a href="#rxobservableprototypesomepredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/any.js "View in source") 

Determines whether any element of an observable sequence satisfies a condition if present, else if any items are in the sequence.  There is an alias to this method called `any`.

#### Arguments
1. `predicate` *(`Function`)*: A function to test each source element for a condition. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(`Any`)*: Object to use as this when executing callback.

#### Returns
*(`Observable`)*: An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate. 

#### Example
```js
// With a predicate
var source = Rx.Observable.fromArray([1,2,3,4,5])
    .some(function (x) { return x % 2 === 0; });

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

### Location

File:
- [`/src/core/observable/any.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/any.js)

Dist:
- [`rx.aggregates.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [`/tests/observable/any.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/any.js)

* * *

### <a id="rxobservableprototypestartwithscheduler-args"></a>`Rx.Observable.prototype.startWith([scheduler] ...args)`
<a href="#rxobservableprototypestartwithscheduler-args">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/startwith.js "View in source") 

Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.

#### Arguments
1. `[scheduler]` *(`Scheduler`)*: Scheduler to execute the function.
2. `args` *(arguments)*: Values to prepend to the observable sequence.

#### Returns
*(`Observable`)*: The source sequence prepended with the specified values.

#### Example
```js
var source = Rx.Observable.return(4)
    .startWith(1, 2, 3)

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
// => Next: 4
// => Completed 
```

### Location

File:
- [`/src/core/observable/startwith.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/startwith.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/startwith.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/startwith.js)

* * *

### <a id="rxobservableprototypesubscribeobserver--onnext-onerror-oncompleted"></a>`Rx.Observable.prototype.subscribe([observer] | [onNext], [onError], [onCompleted])`
<a href="#rxobservableprototypesubscribeobserver--onnext-onerror-oncompleted">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/observable.js "View in source") 

Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.

#### Arguments
1. `[observer]` *(Observer)*: The object that is to receive notifications.
1. `[onNext]` *(`Function`)*: Function to invoke for each element in the observable sequence.
2. `[onError]` *(`Function`)*: Function to invoke upon exceptional termination of the observable sequence.
3. `[onCompleted]` *(`Function`)*: Function to invoke upon graceful termination of the observable sequence.

#### Returns
*(Disposable)*:  The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler. 

#### Example
```js
/* With no arguments */
var source = Rx.Observable.range(0, 3)
    .do(function (x) { console.log('Do Next: ' + x); });

var subscription = source.subscribe();

// => Do Next: 0
// => Do Next: 1
// => Do Next: 2

/* With an observer */
var observer = Rx.Observer.create(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

var source = Rx.Observable.range(0, 3)

var subscription = source.subscribe(observer);

// => Next: 0
// => Next: 1
// => Next: 2

/* Using functions */
var source = Rx.Observable.range(0, 3)

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
```

### Location

File:
- [`/src/core/observable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/observable.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)

Unit Tests:
- [`/tests/core/observable.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/core/observable.js)

* * *

### <a id="rxobservableprototypesubscribeonscheduler"></a>`Rx.Observable.prototype.subscribeOn(scheduler)`
<a href="#rxobservableprototypesubscribeonscheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/subscribeon.js "View in source") 

Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler.

This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer callbacks on a scheduler, use `observeOn`.

#### Arguments
1. `scheduler` *(`Scheduler`)*:  Scheduler to notify observers on.

#### Returns
*(`Observable`)*: The source sequence whose observations happen on the specified scheduler. 
 
#### Example
```js
var observable = Rx.Observable.create(function (observer) {
    function handler () {
        observer.onNext(42);
        observer.onCompleted();
    }

    // Change scheduler for here
    var id = setTimeout(handler, 1000);

    return function () {
        // And change scheduler for here
        if (id) clearTimeout(id);
    };
});

// Change the scheduler to timeout for subscribe/unsubscribe
var source = observable.subscribeOn(Rx.Scheduler.timeout);

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

File:
- [`/src/core/observable/subscribeon.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/subscribeon.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)

Unit Tests:
- [`/tests/observable/subscribeon.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/subscribeon.js)

* * *

### <a id="rxobservableprototypesumkeyselector-thisarg"></a>`Rx.Observable.prototype.sum([keySelector], [thisArg])`
<a href="#rxobservableprototypesumkeyselector-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sum.js "View in source") 

Computes the sum of a sequence of values that are obtained by invoking an optional transform function on each element of the input sequence, else if not specified computes the sum on each item in the sequence.

#### Arguments
1. `[keySelector]` *(`Scheduler`)*:  A transform function to apply to each element.  The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed

#### Returns
*(`Observable`)*: An observable sequence containing a single element with the sum of the values in the source sequence.
 
#### Example
```js
/* Without a selector */
var source = Rx.Observable.range(1, 10)
    .sum();

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

/* With a selector */
var array = [
    { value: 1 },
    { value: 2 },
    { value: 3 }
];

var source = Rx.Observable
    .fromArray(array)
    .sum(function (x, idx, obs) {
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

// => Next: 6
// => Completed 
```

### Location

File:
- [/src/core/observable/sum.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/sum.js)

Dist:
- [rx.aggregates.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js)

Prerequisites:
- [`rx`](https://www.npmjs.org/package/rx).aggregates.js
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Aggregates`](http://www.nuget.org/packages/RxJS-Aggregates/)

Unit Tests:
- [/tests/observable/sum.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/sum.js)

* * *

### <a id="rxobservableprototypeswitch"></a>`Rx.Observable.prototype.switch()`
<a href="#rxobservableprototypeswitch">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/switchlatest.js "View in source") 

Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.  There is an alias for this method called `switchLatest` for browsers <IE9.
  
#### Returns
*(`Observable`)*: The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.  
 
#### Example
```js
var source = Rx.Observable.range(0, 3)
    .select(function (x) { return Rx.Observable.range(x, 3); })
    .switch();

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
// => Next: 3
// => Next: 4 
// => Completed    
```

### Location

File:
- [`/src/core/observable/switchlatest.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/switchlatest.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/switchlatest.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/switchlatest.js)

* * *

### <a id="rxobservableprototypetakecount-scheduler"></a>`Rx.Observable.prototype.take(count, [scheduler])`
<a href="#rxobservableprototypetakecount-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/take.js "View in source") 

Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of `take(0)`.
  
#### Arguments
1. `count` *(`Number`)*: The number of elements to return.
2. `[schduler]` *(`Scheduler`)*: Scheduler used to produce an onCompleted message in case `count` is set to 0.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements that occur after the specified index in the input sequence.   

#### Example
```js
var source = Rx.Observable.range(0, 5)
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

// => Next: 0
// => Next: 1
// => Next: 2
// => Completed 
```

### Location

File:
- [`/src/core/observable/take.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/take.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/take.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/take.js)

* * *

### <a id="rxobservableprototypetakelastcount"></a>`Rx.Observable.prototype.takeLast(count)`
<a href="#rxobservableprototypetakelastcount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takelast.js "View in source") 

Returns a specified number of contiguous elements from the end of an observable sequence, using an optional scheduler to drain the queue.
  
This operator accumulates a buffer with a length enough to store elements count elements. Upon completion of the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.

#### Arguments
1. `count` *(`Number`)*: Number of elements to bypass at the end of the source sequence.

#### Returns
*(`Observable`)*: An observable sequence containing the source sequence elements except for the bypassed ones at the end.   
  
#### Example
```js
var source = Rx.Observable.range(0, 5)
    .takeLast(3);

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
// => Next: 3
// => Next: 4
// => Completed 
```

### Location

File:
- [`/src/core/observable/takelast.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takelast.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/takelast.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/takelast.js)

* * *

### <a id="rxobservableprototypetakelastbuffercount"></a>`Rx.Observable.prototype.takeLastBuffer(count)`
<a href="#rxobservableprototypetakelastbuffercount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takelastbuffer.js "View in source") 

Returns an array with the specified number of contiguous elements from the end of an observable sequence.

#### Arguments
1. `count` *(`Number`)*: Number of elements to bypass at the end of the source sequence.

#### Returns
*(`Observable`)*: An observable sequence containing a single array with the specified number of elements from the end of the source sequence.
     
#### Example
```js
var source = Rx.Observable.range(0, 5)
    .takeLastBuffer(3);

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

// => Next: 2,3,4
// => Completed 
```

### Location

File:
- [`/src/core/observable/takelastbuffer.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takelastbuffer.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/takelastbuffer.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/takelastbuffer.js)

* * *

### <a id="rxobservableprototypetakelastbufferwithtimeduration-scheduler"></a>`Rx.Observable.prototype.takeLastBufferWithTime(duration, [scheduler])`
<a href="#rxobservableprototypetakelastbufferwithtimeduration-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takelastbufferwithtime.js "View in source") 

Returns an array with the elements within the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.

This operator accumulates a queue with a length enough to store elements received during the initial duration window. As more elements are received, elements older than the specified duration are taken from the queue and produced on the result sequence. This causes elements to be delayed with duration.  
 
#### Arguments
1. `duration` *(`Number`)*: Duration for taking elements from the end of the sequence.
2. `[scheduler=Rx.Scheduler.timeout]` *(`Scheduler`)*: Scheduler to run the timer on. If not specified, defaults to timeout scheduler.

#### Returns
*(`Observable`)*: An observable sequence containing a single array with the elements taken during the specified duration from the end of the source sequence.
 
#### Example
```js
var source = Rx.Observable
    .timer(0, 1000)
    .take(10)
    .takeLastBufferWithTime(5000);
    
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

// => Next: 5,6,7,8,9
// => Completed 
```

### Location

File:
- [`/src/core/observable/takelastbufferwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takelastbufferwithtime.js)

Dist:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/takelastbufferwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/takelastbufferwithtime.js)

* * *

### <a id="rxobservableprototypetakelastwithtimeduration-timescheduler-loopscheduler"></a>`Rx.Observable.prototype.takeLastWithTime(duration, [timeScheduler], [loopScheduler])`
<a href="#rxobservableprototypetakelastwithtimeduration-timescheduler-loopscheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takelastwithtime.js "View in source") 

Returns elements within the specified duration from the end of the observable source sequence, using the specified schedulers to run timers and to drain the collected elements.

#### Arguments
1. `duration` *(`Number`)*: Duration for taking elements from the end of the sequence.
2. `[timeScheduler=Rx.Scheduler.timeout]` *(`Scheduler`)*: Scheduler to run the timer on. If not specified, defaults to timeout scheduler.
2. `[loopScheduler=Rx.Scheduler.currentThread]` *(`Scheduler`)*: Scheduler to drain the collected elements. If not specified, defaults to current thread scheduler.

#### Returns
*(`Observable`)*: An observable sequence with the elements taken during the specified duration from the end of the source sequence.
    
#### Example
```js
var source = Rx.Observable.timer(0, 1000)
    .take(10)
    .takeLastWithTime(5000);
    
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

// => Next: 5
// => Next: 6
// => Next: 7
// => Next: 8
// => Next: 9
// => Completed 
```

### Location

File:
- [`/src/core/observable/takelastwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takelastwithtime.js)

Dist:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/takelastwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/takelastwithtime.js)

* * *

### <a id="rxobservableprototypetakeuntilother"></a>`Rx.Observable.prototype.takeUntil(other)`
<a href="#rxobservableprototypetakeuntilother">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takeuntil.js "View in source") 

Returns the values from the source observable sequence until the other observable sequence or Promise produces a value.

#### Arguments
1. `other` *(`Observable` | `Promise`)*: Observable sequence or Promise that terminates propagation of elements of the source sequence.

#### Returns
*(`Observable`)*: An observable sequence containing the elements of the source sequence up to the point the other sequence or Promise interrupted further propagation.    

#### Example
```js
var source = Rx.Observable.timer(0, 1000)
    .takeUntil(Rx.Observable.timer(5000));

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
// => Next: 3
// => Next: 4
// => Completed 
```

### Location

File:
- [`/src/core/observable/takeuntil.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takeuntil.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/takeuntil.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/takeuntil.js)

* * *

### <a id="rxobservableprototypetakeuntilwithtimeendtime-scheduler"></a>`Rx.Observable.prototype.takeUntilWithTime(other)`
<a href="#rxobservableprototypetakeuntilwithtimeendtime-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takeuntil.js "View in source") 

Returns the values from the source observable sequence until the other observable sequence produces a value.

#### Arguments
1. `endTime` *(`Date` | `Number`)*: Time to stop taking elements from the source sequence. If this value is less than or equal to the current time, the result stream will complete immediately.
2. [`scheduler`] *(`Scheduler`)*: Scheduler to run the timer on.

#### Returns
*(`Observable`)*: An observable sequence with the elements taken until the specified end time.   

#### Example
```js
var source = Rx.Observable.timer(0, 1000)
    .takeUntilWithTime(5000);

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
// => Next: 3
// => Next: 4
// => Completed 
```

### Location

File:
- [`/src/core/observable/takeuntilwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takeuntilwithtime.js)

Dist:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/takeuntilwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/takeuntilwithtime.js)

* * *

### <a id="rxobservableprototypetakewhilepredicate-thisarg"></a>`Rx.Observable.prototype.takeWhile(predicate, [thisArg])`
<a href="#rxobservableprototypetakewhilepredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takewhile.js "View in source") 

Returns elements from an observable sequence as long as a specified condition is true.

#### Arguments
1. `predicate` *(`Function`)*: A function to test each source element for a condition. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(`Any`)*: Object to use as this when executing callback.

#### Returns
*(`Observable`)*: An observable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.  
    
#### Example
```js
// With a predicate
var source = Rx.Observable.range(1, 5)
    .takeWhile(function (x) { return x < 3; });

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

File:
- [`/src/core/observable/takewhile.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/takewhile.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/takewhile.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/takewhile.js)

* * *

### <a id="rxobservableprototypethrottleduetime-scheduler"></a>`Rx.Observable.prototype.throttle(dueTime, [scheduler])`
<a href="#rxobservableprototypethrottleduetime-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/throttle.js "View in source") 

Ignores values from an observable sequence which are followed by another value before dueTime.

#### Arguments
1. `dueTime` *(`Number`)*: Duration of the throttle period for each value (specified as an integer denoting milliseconds).
2. `[scheduler=Rx.Scheduler.timeout]` *(`Any`)*: Scheduler to run the throttle timers on. If not specified, the timeout scheduler is used.

#### Returns
*(`Observable`)*: The throttled sequence. 
    
#### Example
```js
var times = [
    { value: 0, time: 100 },
    { value: 1, time: 600 },
    { value: 2, time: 400 },
    { value: 3, time: 700 },
    { value: 4, time: 200 }
];

// Delay each item by time and project value;
var source = Rx.Observable.for(
    times, 
    function (item) {
        return Rx.Observable
            .return(item.value)
            .delay(item.time);
    })
    .throttle(500 /* ms */);

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

### Location

File:
- [`/src/core/observable/throttle.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/throttle.js)

Dist:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- If using `rx.time.js`
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/throttle.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/throttle.js)

* * *

### <a id="rxobservableprototypethrottlewithselectorthrottleselector"></a>`Rx.Observable.prototype.throttleWithSelector(throttleSelector)`
<a href="#rxobservableprototypethrottlewithselectorthrottleselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/throttlewithselector.js "View in source") 

Ignores values from an observable sequence which are followed by another value before dueTime.

#### Arguments
1. `dueTime` *(`Number`)*: Selector function to retrieve a sequence indicating the throttle duration for each given element.

#### Returns
*(`Observable`)*: The throttled sequence. 
    
#### Example
```js
var array = [
    800,
    700,
    600,
    500
];

var source = Rx.Observable.for(
    array,
    function (x) {
        return Rx.Observable.timer(x)
    })
    .map(function(x, i) { return i; })
    .throttleWithSelector(function (x) {
        return Rx.Observable.timer(700);
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
// => Next: 3
// => Completed 
```

### Location

File:
- [`/src/core/observable/throttlewithselector.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/throttlewithselector.js)

Dist:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/throttlewithselector.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/throttlewithselector.js)

* * *

### <a id="rxobservableprototypetimeintervalscheduler"></a>`Rx.Observable.prototype.timeInterval([scheduler])`
<a href="#rxobservableprototypetimeintervalscheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timeinterval.js "View in source") 

Records the time interval between consecutive values in an observable sequence.

#### Arguments
1. `[scheduler=Rx.Observable.timeout]` *(`Scheduler`)*: Scheduler used to compute time intervals. If not specified, the timeout scheduler is used.

#### Returns
*(`Observable`)*: An observable sequence with time interval information on values.

#### Example
```js
var source = Rx.Observable.timer(0, 1000)
    .timeInterval()
    .map(function (x) { return x.value + ':' + x.interval; })
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

// => Next: 0:0
// => Next: 1:1000
// => Next: 2:1000
// => Next: 3:1000
// => Next: 4:1000
// => Completed    
```

### Location

File:
- [`/src/core/observable/timeinterval.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timeinterval.js)

Dist:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/timeinterval.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/timeinterval.js)

* * *

### <a id="rxobservableprototypetimeoutduetime-other-scheduler"></a>`Rx.Observable.prototype.timeout(dueTime, [other], [scheduler])`
<a href="#rxobservableprototypetimeoutduetime-other-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timeout.js "View in source") 

Returns the source observable sequence or the other observable sequence if dueTime elapses.

#### Arguments
1. `dueTime` *(Date | Number)*: Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) when a timeout occurs.
2. `[other]` *(`Observable`)*: Sequence or Promise to return in case of a timeout. If not specified, a timeout error throwing sequence will be used.
3. `[scheduler=Rx.Observable.timeout]` *(`Scheduler`)*: Scheduler to run the timeout timers on. If not specified, the timeout scheduler is used.

#### Returns
*(`Observable`)*: An observable sequence with time interval information on values.

#### Example
```js
/* With no other */
var source = Rx.Observable
    .return(42)
    .delay(5000)
    .timeout(200);
    
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

// => Error: Error: Timeout

/* With another */
var source = Rx.Observable
    .return(42)
    .delay(5000)
    .timeout(200, Rx.Observable.empty());
    
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

File:
- [`/src/core/observable/timeout.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timeout.js)

Dist:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/timeout.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/timeout.js)

* * *

### <a id="rxobservableprototypetimeoutwithselectorfirsttimeout-timeoutdurationselector-other"></a>`Rx.Observable.prototype.timeoutwithselector([firstTimeout], timeoutDurationSelector, [other])`
<a href="#rxobservableprototypetimeoutwithselectorfirsttimeout-timeoutdurationselector-other">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timeoutwithselector.js "View in source") 

Returns the source observable sequence, switching to the other observable sequence if a timeout is signaled.

#### Arguments
1. `[firstTimeout=Rx.Observable.never()]` *(`Observable`)*: Observable sequence that represents the timeout for the first element. If not provided, this defaults to `Rx.Observable.never()`.
2. `timeoutDurationSelector` *(`Function`)*: Selector to retrieve an observable sequence that represents the timeout between the current element and the next element.
3. `[other=Rx.Observable.throw]` *(`Scheduler`)*:Sequence to return in case of a timeout. If not provided, this is set to `Observable.throw`

#### Returns
*(`Observable`)*: The source sequence switching to the other sequence in case of a timeout.

#### Example
```js
/* without a first timeout */
var array = [
    200,
    300,
    350,
    400
];

var source = Rx.Observable
    .for(array, function (x) {
        return Rx.Observable.timer(x);
    })
    .map(function (x, i) { return i; })
    .timeoutWithSelector(function (x) { 
        return Rx.Observable.timer(400); 
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
// => Next: 1 
// => Next: 2 
// => Error: Error: Timeout 

/* With no other */
var array = [
    200,
    300,
    350,
    400
];

var source = Rx.Observable
    .for(array, function (x) {
        return Rx.Observable.timer(x);
    })
    .map(function (x, i) { return i; })
    .timeoutWithSelector(Rx.Observable.timer(250), function (x) { 
        return Rx.Observable.timer(400); 
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
// => Next: 1 
// => Next: 2 
// => Error: Error: Timeout 

/* With other */
var array = [
    200,
    300,
    350,
    400
];

var source = Rx.Observable
    .for(array, function (x) {
        return Rx.Observable.timer(x);
    })
    .map(function (x, i) { return i; })
    .timeoutWithSelector(Rx.Observable.timer(250), function (x) { 
        return Rx.Observable.timer(400); 
    }, Rx.Observable.return(42));
    
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
// => Next: 42
// => Completed
```

### Location

File:
- [`/src/core/observable/timeoutwithselector.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timeoutwithselector.js)

Dist:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/timeoutwithselector.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/timeoutwithselector.js)

* * *

### <a id="rxobservableprototypetimestampscheduler"></a>`Rx.Observable.prototype.timestamp([scheduler])`
<a href="#rxobservableprototypetimestampscheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timestamp.js "View in source") 

Records the timestamp for each value in an observable sequence.

#### Arguments
1. `[scheduler=Rx.Observable.timeout]` *(`Scheduler`)*: Scheduler used to compute timestamps. If not specified, the timeout scheduler is used.

#### Returns
*(`Observable`)*: An observable sequence with timestamp information on values.

#### Example
```js
var source = Rx.Observable.timer(0, 1000)
    .timestamp()
    .map(function (x) { return x.value + ':' + x.timestamp; })
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

// => Next: 0:1378690776351
// => Next: 1:1378690777313
// => Next: 2:1378690778316
// => Next: 3:1378690779317
// => Next: 4:1378690780319
// => Completed
```

### Location

File:
- [`/src/core/observable/timestamp.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/timestamp.js)

Dist:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/timestamp.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/timestamp.js)

* * *

### <a id="rxobservableprototypetoarray"></a>`Rx.Observable.prototype.toArray()`
<a href="#rxobservableprototypetoarray">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/toarray.js "View in source") 

Creates a list from an observable sequence.

#### Returns
*(`Observable`)*: An observable sequence containing a single element with a list containing all the elements of the source sequence.  

#### Example
```js
var source = Rx.Observable.timer(0, 1000)
    .take(5)
    .toArray();
    
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

// => Next: [0,1,2,3,4]
// => Completed
```

### Location

File:
- [`/src/core/observable/toarray.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/toarray.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/toarray.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/toarray.js)

* * *

### <a id="rxobservableprototypewherepredicate-thisarg"></a>`Rx.Observable.prototype.where(predicate, [thisArg])`
<a href="#rxobservableprototypewherepredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/where.js "View in source") 

Filters the elements of an observable sequence based on a predicate.  This is an alias for the `filter` method.

#### Arguments
1. `predicate` *(`Function`)*: A function to test each source element for a condition. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(`Any`)*: Object to use as `this` when executing the predicate.

#### Returns
*(`Observable`)*: An observable sequence that contains elements from the input sequence that satisfy the condition.  

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

### Location

File:
- [`/src/core/observable/where.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/where.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/where.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/where.js)

* * *

### <a id="rxobservableprototypewindowwindowopenings-windowboundaries-windowclosingselector"></a>`Rx.Observable.prototype.window([windowOpenings], [windowBoundaries], windowClosingSelector)`
<a href="#rxobservableprototypewindowwindowopenings-windowboundaries-windowclosingselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/window.js "View in source") 

Projects each element of an observable sequence into zero or more windows.

```js
// With window closing selector
Rx.Observable.prototype.window(windowClosingSelector);

// With window opening and window closing selector
Rx.Observable.prototype.window(windowOpenings, windowClosingSelector);

// With boundaries
Rx.Observable.prototype.window(windowBoundaries);
```

#### Arguments
1. `[windowOpenings]` *(`Observable`)*: Observable sequence whose elements denote the creation of new windows 
2.`[windowBoundaries]` *(`Observable`)*: Sequence of window boundary markers. The current window is closed and a new window is opened upon receiving a boundary marker. 
3. `windowClosingSelector` *(`Function`)*: A function invoked to define the closing of each produced window.

#### Returns
*(`Observable`)*: An observable sequence of windows.

#### Example
```js
/* With window boundaries */
var openings = Rx.Observable.interval(500);

// Convert the window to an array
var source = Rx.Observable.timer(0, 100)
    .window(openings)
    .take(3)
    .selectMany(function (x) { return x.toArray(); });

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
// => Next: 5,6,7,8,9,10 
// => Next: 11,12,13,14,15 
// => Completed  

/* With window opening and window closing selector */
var win = 0;

var source = Rx.Observable.timer(0, 50)
    .window(function () { return Rx.Observable.timer((++win) * 100); })
    .take(3)
    .selectMany(function (x) { return x.toArray(); });

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
// => Next: 3,4,5,6 
// => Next: 7,8,9,10,11,12 
// => Completed 

/* With openings and closings */
var openings = Rx.Observable.timer(0, 200);

var source = Rx.Observable.timer(0, 50)
    .window(openings, function (x) { return Rx.Observable.timer(x + 100); })
    .take(3)
    .selectMany(function (x) { return x.toArray(); });

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
// => Next: 4,5 
// => Next: 8,9 
// => Completed 
```

### Location

File:
- [`/src/core/observable/window.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/window.js)

Dist:
- [`rx.coincidence.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.coincidence.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Coincidence`](http://www.nuget.org/packages/RxJS-Main/)

Unit Tests:
- [`/tests/observable/window.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/window.js)

* * *

### <a id="rxobservableprototypewindowwithcountcount-skip"></a>`Rx.Observable.prototype.windowWithCount(count, [skip])`
<a href="#rxobservableprototypewindowwithcountcount-skip">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/windowwithcount.js "View in source") 

Projects each element of an observable sequence into zero or more windows which are produced based on element count information.

#### Arguments
1. `count` *(`Function`)*: Length of each buffer.
2. `[skip]` *(`Function`)*: Number of elements to skip between creation of consecutive windows. If not provided, defaults to the count.

#### Returns
*(`Observable`)*: An observable sequence of windows. 

#### Example
```js
/* Without a skip */
var source = Rx.Observable.range(1, 6)
    .windowWithCount(2)
    .selectMany(function (x) { return x.toArray(); });

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
    .windowWithCount(2, 1)
    .selectMany(function (x) { return x.toArray(); });    

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
### Location

File:
- [`/src/core/observable/windowwithcount.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/windowwithcount.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)

Unit Tests:
- [`/tests/observable/windowwithcount.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/windowwithcount.js)

* * *

### <a id="rxobservableprototypewindowwithtimetimespan-timeshift--scheduler"></a>`Rx.Observable.prototype.windowWithTime(timeSpan, [timeShift | scheduler])`
<a href="#rxobservableprototypewindowwithtimetimespan-timeshift--scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/windowwithtime.js "View in source") 

Projects each element of an observable sequence into zero or more buffers which are produced based on timing information.

#### Arguments
1. `timeSpan` *(`Number`)*: Length of each buffer (specified as an integer denoting milliseconds).
2. `[timeShift]` *(`Number`)*: Interval between creation of consecutive buffers (specified as an integer denoting milliseconds).
3. `[scheduler=Rx.Scheduler.timeout]` *(`Scheduler`)*: Scheduler to run buffer timers on. If not specified, the timeout scheduler is used.

#### Returns
*(`Observable`)*: An observable sequence of buffers. 

#### Example
```js
/* Without a skip */
var source = Rx.Observable.interval(100)
    .windowWithTime(500)
    .take(3);

var subscription = source.subscribe(
    function (child) {

        child.toArray().subscribe(
            function (x) {
                console.log('Child Next: ' + x.toString());
            },
            function (err) {
                console.log('Child Error: ' + err);   
            },
            function () {
                console.log('Child Completed');   
            }
        );
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Child Next: 0,1,2,3 
// => Child Completed 
// => Completed 
// => Child Next: 4,5,6,7,8 
// => Child Completed 
// => Child Next: 9,10,11,12,13 
// => Child Completed 

/* Using a skip */
var source = Rx.Observable.interval(100)
    .windowWithTime(500, 100)
    .take(3);

var subscription = source.subscribe(
    function (child) {

        child.toArray().subscribe(
            function (x) {
                console.log('Child Next: ' + x.toString());
            },
            function (err) {
                console.log('Child Error: ' + err);   
            },
            function () {
                console.log('Child Completed');   
            }
        );
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Completed 
// => Child Next: 0,1,2,3,4
// => Child Completed 
// => Child Next: 0,1,2,3,4,5
// => Child Completed 
// => Child Next: 1,2,3,4,5,6
// => Child Completed 
```
### Location

File:
- [`/src/core/observable/windowwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/windowwithtime.js)

Dist:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/windowwithtime.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/windowwithtime.js)

* * *

### <a id="rxobservableprototypewindowwithtimeorcounttimespan-count-scheduler"></a>`Rx.Observable.prototype.windowWithTimeOrCount(timeSpan, count, [scheduler])`
<a href="#rxobservableprototypewindowwithtimeorcounttimespan-count-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/windowwithtimeorcount.js "View in source") 

Projects each element of an observable sequence into a window that is completed when either it's full or a given amount of time has elapsed.

#### Arguments
1. `timeSpan` *(`Number`)*: Maximum time length of a window.
2. `count` *(`Number`)*: Maximum element count of a window.
3. `[scheduler=Rx.Scheduler.timeout]` *(`Scheduler`)*: Scheduler to run windows timers on. If not specified, the timeout scheduler is used.

#### Returns
*(`Observable`)*: An observable sequence of windows. 

#### Example
```js
/* Hitting the count buffer first */
var source = Rx.Observable.interval(100)
    .windowWithTimeOrCount(500, 3)
    .take(3)
    .selectMany(function (x) { return x.toArray(); });

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
### Location

File:
- [`/src/core/observable/windowwithtimeorcount.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/windowwithtimeorcount.js)

Dist:
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/windowwithtimeorcount.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/windowwithtimeorcount.js)

* * *

### <a id="rxobservableprototypezipargs-resultselector"></a>`Rx.Observable.prototype.zip(...args, [resultSelector])`
<a href="#rxobservableprototypezipargs-resultselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/zipproto.js "View in source") 

Merges the specified observable sequences or Promises into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.

The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the sources.

#### Arguments
1. `args` *(`Arguments` | `Array`)*: Arguments or an array of observable sequences.
2. `[resultSelector]` *(`Any`)*: Function to invoke for each series of elements at corresponding indexes in the sources, used only if the first parameter is not an array.

#### Returns
*(`Observable`)*: An observable sequence containing the result of combining elements of the sources using the specified result selector function. 

#### Example
```js
/* Using arguments */
var range = Rx.Observable.range(0, 5);

var source = range.zip(
    range.skip(1), 
    range.skip(2), 
    function (s1, s2, s3) {
        return s1 + ':' + s2 + ':' + s3;
    }
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

// => Next: 0:1:2
// => Next: 1:2:3
// => Next: 2:3:4
// => Completed

/* Using an array */
var array = [3, 4, 5];

var source = Rx.Observable.range(0, 3)
    .zip(
        array,
        function (s1, s2) {
            return s1 + ':' + s2;
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

// => Next: 0:3
// => Next: 1:4
// => Next: 2:5
// => Completed
```

### Location

File:
- [`/src/core/observable/zipproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/zipproto.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/zipproto.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/zipproto.js)

* * *
