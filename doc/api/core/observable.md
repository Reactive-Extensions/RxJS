# Observable object #

The Observable object represents a push based collection.

The Observer and Objects interfaces provide a generalized mechanism for push-based notification, also known as the observer design pattern. The Observable object represents the object that sends notifications (the provider); the Observer object represents the class that receives them (the observer). 

<!-- div -->

## `Observable Methods`
- [`amb`](#rxobservableambargs)
- [`case | switchCase`](#rxobservablecaseselector-sources-elsesourcescheduler)
- [`catch | catchException`](#rxobservablecatchargs)
- [`concat`](#rxobservableconcatargs)
- [`create | createWithDisposable`](#rxobservablecreatesubscribe)
- [`defer`](#rxobservabledeferobservablefactory)
- [`empty`](#rxobservableemptyscheduler)
- [`for | forIn`](#rxobservableforsources-resultselector)
- [`forkJoin`](#rxobservableforkjoinargs)
- [`fromArray`](#rxobservablefromarrayarray-scheduler)
- [`fromCallback`](#rxobservablefromcallbackfunc-scheduler-context-selector)
- [`fromEvent`](#rxobservablefromeventelement-eventname-selector)
- [`fromEventPattern`](#rxobservablefromeventpatternaddhandler-removehandler-selector)
- [`fromNodeCallback`](#rxobservablefromnodecallbackfunc-scheduler-context-selector)
- [`fromPromise`](#rxobservablefrompromisepromise)
- [`generate`](#rxobservablegenerateinitialstate-condition-iterate-resultselector-scheduler)
- [`generateWithAbsoluteTime`](#rxobservablegeneratewithabsolutetimeinitialstate-condition-iterate-resultselector-timeselector-scheduler)
- [`generateWithRelativeTime`](#rxobservablegeneratewithrelativetimeinitialstate-condition-iterate-resultselector-timeselector-scheduler)
- [`if | ifThen`](#rxobservableifcondition-thensource-elsesource)
- [`interval`](#rxobservableintervalperiod-scheduler)
- [`merge`](#rxobservablemergescheduler-args)
- [`never`](#rxobservablenever)
- [`onErrorResumeNext`](#rxobservableonerrorresumenextargs)
- [`range`](#rxobservablerangestart-count-scheduler)
- [`repeat`](#rxobservablerepeatvalue-repeatcount-scheduler)
- [`return | returnValue`](#rxobservablereturnvalue-scheduler)
- [`start`](#rxobservablestartfunc-scheduler-context)
- [`throw | throwException`](#rxobservablethrowexception-scheduler)
- [`timer`](#rxobservabletimerduetime-period-scheduler)
- [`toAsync`](#rxobservabletoasyncfunc-scheduler-context)
- [`using`](#rxobservableusingresourcefactory-observablefactory)
- [`when`](#rxobservablewhenargs)
- [`while | whileDo`](#rxobservablewhilecondition-source)
- [`zip`](#rxobservablezipargs)
- [`zipArray`](#rxobservableziparrayargs)

<!-- div -->


<!-- div -->

## `Observable Instance Methods`
- [`aggregate`](#rxobservableprototypeaggregateseed-accumulator)
- [`all`](#rxobservableprototypeallpredicate-thisarg)
- [`amb`](#rxobservableprototypeambrightsource)
- [`and`](#rxobservableprototypeandrightsource)
- [`any`](#rxobservableprototypeanypredicate-thisarg)
- [`asObservable`](#rxobservableprototypeasobservable)
- [`average`](#rxobservableprototypeaverageselector)
- [`buffer`](#rxobservableprototypebufferbufferopenings-bufferboundaries-bufferclosingselector)
- [`bufferWithCount`](#rxobservableprototypebufferwithcountcount-skip)
- [`bufferWithTime`](#rxobservableprototypebufferwithtimetimespan-timeshift--scheduler-scheduler)
- [`bufferWithTimeOrCount`](#rxobservableprototypebufferwithtimeorcounttimespan-count-scheduler)
- [`catch | catchException`](#rxobservableprototypecatchsecond--handler)
- [`combineLatest`](#rxobservableprototypecombinelatestargs-resultselector)
- [`concat`](#rxobservableprototypeconcatargs)
- [`concatAll`](#rxobservableprototypeconcatallargs)
- [`connect`](#connectableobservableprototypeconnect)
- [`contains`](#rxobservableprototypecontainsvalue-comparer)
- [`count`](#rxobservableprototypecountpredicate)
- [`defaultIfEmpty`](#rxobservableprototypedefaultifemptydefaultvalue)
- [`delay`](#rxobservableprototypedelayduetime-scheduler)
- [`delayWithSelector`](#rxobservabledelaywithselectordelaysubscriptiondelay-delaydurationselector)
- [`dematerialize`](#rxobservableprototypedematerialize)
- [`distinct`](#rxobservableprototypedistinctkeyselector-keyserializer)
- [`distinctUntilChanged`](#rxobservableprototypedistinctuntilchangedkeyselector-comparer)
- [`do | doAction`](#rxobservableprototypedoobserver--onnext-onerror-oncompleted)
- [`doWhile`](#rxobservableprototypedowhilecondition-source)
- [`elementAt`](#rxobservableprototypeelementatindex)
- [`elementAtOrDefault`](#rxobservableprototypeelementatordefaultindex-defaultvalue)
- [`every`](#rxobservableprototypeeverypredicate-thisarg)
- [`expand`](#rxobservableprototypeexpandselector-scheduler)
- [`filter`](#rxobservableprototypefilterpredicate-thisarg)
- [`finally | finallyAction`](#rxobservableprototypefinallyaction)
- [`find`](#rxobservableprototypefindpredicate-thisarg)
- [`findIndex`](#rxobservableprototypefindindexpredicate-thisarg)
- [`first`](#rxobservableprototypefirstpredicate-thisarg)
- [`firstOrDefault`](#rxobservableprototypefirstordefaultpredicate-defaultvalue-thisarg)
- [`flatMap`](#rxobservableprototypeflatmapselector-resultselector)
- [`flatMapLatest`](#rxobservableprototypeflatmaplatestselector-thisarg)
- [`forkJoin`](#rxobservableprototypeforkjoinsecond-resultselector)
- [`groupBy`](#rxobservableprototypegroupbykeyselector-elementselector-keyserializer)
- [`groupByUntil`](#rxobservableprototypegroupbyuntilkeyselector-elementselector-durationselector-keyserializer)
- [`groupJoin`](#rxobservableprototypegroupjoinright-leftdurationselector-rightdurationselector-resultselector)
- [`ignoreElements`](#rxobservableprototypeignoreelements)
- [`isEmpty`](#rxobservableprototypeisempty)
- [`join`](#rxobservableprototypejoinright-leftdurationselector-rightdurationselector-resultselector)
- [`last`](#rxobservableprototypelastpredicate-thisarg)
- [`lastOrDefault`](#rxobservableprototypelastordefaultpredicate-defaultvalue-thisarg)
- [`let | letBind`](#rxobservableprototypeletfunc)
- [`manySelect`](#rxobservableprototypemanyselectselector-scheduler)
- [`map`](#rxobservableprototypemapselector-thisarg)
- [`max`](#rxobservableprototypemaxcomparer)
- [`maxBy`](#rxobservableprototypemaxbykeyselector-comparer)
- [`merge`](#rxobservableprototypemergemaxconcurrent--other)
- [`mergeAll`](#rxobservableprototypemergeobservable)
- [`min`](#rxobservableprototypemincomparer)
- [`minBy`](#rxobservableprototypeminbykeyselector-comparer)
- [`multicast`](#rxobservableprototypemulticastsubject--subjectselector-selector)
- [`observeOn`](#rxobservableprototypeobserveonscheduler)
- [`onErrorResumeNext`](#rxobservableprototypeonerrorresumenextsecond)
- [`pluck`](#rxobservableprototypepluckproperty)
- [`publish`](#rxobservableprototypepublishselector)
- [`publishLast`](#rxobservableprototypepublishlatestselector)
- [`publishValue`](#rxobservableprototypepublishvalueselector)
- [`share`](#rxobservableprototypeshare)
- [`shareReplay`](#rxobservableprototypesharereplay-buffersize-window-scheduler)
- [`shareValue`](#rxobservableprototypesharevalue)
- [`refCount`](#connectableobservableprototyperefcount)
- [`reduce`](#rxobservableprototypereduceaccumulator-seed)
- [`repeat`](#rxobservableprototyperepeatrepeatcount)
- [`replay`](#rxobservableprototypereplayselector-buffersize-window-scheduler)
- [`retry`](#rxobservableprototyperetryretrycount)
- [`sample`](#rxobservableprototypesampleinterval--sampleobservable)
- [`scan`](#rxobservableprototypescanseed-accumulator)
- [`select`](#rxobservableprototypeselectselector-thisarg)
- [`selectMany`](#rxobservableprototypeselectmanyselector-resultselector)
- [`selectSwitch`](#rxobservableprototypeselectswitchselector-thisarg)
- [`sequenceEqual`](#rxobservableprototypesequenceequalsecond-comparer)
- [`single`](#rxobservableprototypesinglepredicate-thisarg)
- [`singleOrDefault`](#rxobservableprototypesingleordefaultpredicate-defaultvalue-thisarg)
- [`skip`](#rxobservableprototypeskipcount)
- [`skipLast`](#rxobservableprototypeskiplastcount)
- [`skipLastWithTime`](#rxobservableprototypeskiplastwithtimeduration)
- [`skipUntil`](#rxobservableprototypeskipuntilother)
- [`skipWhile`](#rxobservableprototypeskipwhilepredicate-thisarg)
- [`some`](#rxobservableprototypesomepredicate-thisarg)
- [`startWith`](#rxobservableprototypestartwithscheduler-args)
- [`subscribe`](#rxobservableprototypesubscribeobserver--onnext-onerror-oncompleted)
- [`subscribeOn`](#rxobservableprototypesubscribeonscheduler)
- [`sum`](#rxobservableprototypesumkeyselector-thisarg)
- [`switch | switchLatest`](#rxobservableprototypeswitch)
- [`take`](#rxobservableprototypetakecount-scheduler)
- [`takeLast`](#rxobservableprototypetakelastcount)
- [`takeLastBuffer`](#rxobservableprototypetakelastbuffercount)
- [`takeLastBufferWithTime`](#rxobservableprototypetakelastbufferwithtimeduration-scheduler)
- [`takeLastWithTime`](#rxobservableprototypetakelastwithtimeduration-timescheduler-loopscheduler)
- [`takeUntil`](#rxobservableprototypetakeuntilother)
- [`takeWhile`](#rxobservableprototypetakewhilepredicate-thisarg)
- [`throttle`](#rxobservableprototypethrottleduetime-scheduler)
- [`throttleWithSelector`](#rxobservableprototypethrottlewithselectorthrottleselector)
- [`timeInterval`](#rxobservableprototypetimeintervalscheduler)
- [`timeout`](#rxobservableprototypetimeoutduetime-other-scheduler)
- [`timeoutWithSelector`](#rxobservableprototypetimeoutwithselectorfirsttimeout-timeoutdurationselector-other)
- [`timestamp`](#rxobservableprototypetimestampscheduler)
- [`toArray`](#rxobservableprototypetoarray)
- [`where`](#rxobservableprototypewherepredicate-thisarg)
- [`window`](#rxobservableprototypewindowwindowopenings-windowboundaries-windowclosingselector)
- [`windowWithCount`](#rxobservableprototypewindowwithcountcount-skip)
- [`windowWithTime`](#rxobservableprototypewindowwithtimetimespan-timeshift--scheduler)
- [`windowWithTimeOrCount`](#rxobservableprototypewindowwithtimeorcounttimespan-count-scheduler)
- [`zip`](#rxobservableprototypezipargs-resultselector)

## _Observable Methods_ ##

### <a id="rxobservableambargs"></a>`Rx.Observable.amb(...args)`
<a href="#rxobservableambargs">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/amb.js#L8-L18 "View in source") 

Propagates the observable sequence that reacts first.

#### Arguments
1. `args` *(Array|arguments)*: Observable sources competing to react first either as an array or arguments.

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

File:
- [/src/core/observable/amb.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/amb.js)

Dist:
- [rx.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js)
- [rx.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.compat.js)

Required Files:
- <None>

NPM Packages:
- rx

NuGet Packages:
- RxJS-Main

Unit Tests:
- [/tests/observable/ambproto.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/ambproto.js)

* * *

### <a id="rxobservablecaseselector-sources-elsesourcescheduler"></a>`Rx.Observable.case(selector, sources, [elseSource|scheduler])`
<a href="#rxobservablecaseselector-sources-elsesourcescheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/case.js#L16-L27 "View in source") 

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

File:
- [/src/core/observable/case.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/case.js)

Dist:
- [rx.experimental.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js)

Required Files:
- rx.js | rx.compat.js | rx.lite.js | rx.lite.compat.js

NPM Packages:
- rx

NuGet Packages:
- RxJS-Experimental

Unit Tests:
- [/tests/observable/case.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/case.js)

* * *

### <a id="rxobservablecatchargs"></a>`Rx.Observable.catch(...args)`
<a href="#rxobservablecatchargs">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/catch.js#L9-L12 "View in source") 

Continues an observable sequence that is terminated by an exception with the next observable sequence.  There is an alias for this method `catchException` for browsers <IE9

#### Arguments
1. `args` *(Array|arguments)*: Observable sequences to catch exceptions for.

#### Returns
*(Observable)*: An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.

#### Example
```js
var obs1 = Rx.Observable.throw(new Error('error'));
var obs2 = Rx.Observable.return(42);

var source = Rx.Observable.catch(obs1, obs2);

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
- [/src/core/observable/catch.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/catch.js)

Dist:
- [rx.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js)
- [rx.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.compat.js)
- [rx.lite.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [rx.lite.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Required Files:
- <None>

NPM Packages:
- rx

NuGet Packages:
- RxJS-Main
- RxJS-Lite

Unit Tests:
- [/tests/observable/catchexceptionproto.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/catchexceptionproto.js)

* * *

### <a id="rxobservableconcatargs"></a>`Rx.Observable.concat(...args)`
<a href="#rxobservableconcatargs">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/concat.js#L9-L12 "View in source") 

Concatenates all of the specified observable sequences, as long as the previous observable sequence terminated successfully.

#### Arguments
1. `args` *(Array|arguments)*: Observable sequences to concatenate.

#### Returns
*(Observable)*: An observable sequence that contains the elements of each given sequence, in sequential order.

#### Example
```js
var source1 = Rx.Observable.return(42);
var source2 = Rx.Observable.return(56);

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

File:
- [/src/core/observable/concat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/concat.js)

Dist:
- [rx.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js)
- [rx.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.compat.js)
- [rx.lite.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [rx.lite.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Required Files:
- <None>

NPM Packages:
- rx

NuGet Packages:
- RxJS-Main
- RxJS-Lite

Unit Tests:
- [/tests/observable/concatproto.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/concatproto.js)

* * *

### <a id="rxobservablecreatesubscribe"></a>`Rx.Observable.create(subscribe)`
<a href="#rxobservablecreatesubscribe">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/create.js#L12-L14 "View in source") 

Creates an observable sequence from a specified subscribe method implementation.  This is an alias for the `createWithDisposable` method

#### Arguments
1. `subscribe` *(Function)*: Implementation of the resulting observable sequence's subscribe method, optionally returning a function that will be wrapped in a disposable object.  This could also be a disposable object.

#### Returns
*(Observable)*: The observable sequence with the specified implementation for the subscribe method.

#### Example
```js
/* Using a function */
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

/* Using a disposable */
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
```

### Location

File:
- [/src/core/observable/create.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/create.js)

Dist:
- [rx.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js)
- [rx.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.compat.js)
- [rx.lite.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [rx.lite.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Required Files:
- <None>

NPM Packages:
- rx

NuGet Packages:
- RxJS-Main
- RxJS-Lite

Unit Tests:
- [/tests/observable/create.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/create.js)
- [/tests/observable/createwithdisposable.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/createwithdisposable.js)

* * *

### <a id="rxobservabledeferobservablefactory"></a>`Rx.Observable.defer(observableFactory)`
<a href="#rxobservabledeferobservablefactory">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/defer.js#L9-L19 "View in source") 

Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.

#### Arguments
1. `observableFactory` *(Function)*: Observable factory function to invoke for each observer that subscribes to the resulting sequence.

#### Returns
*(Observable)*: An observable sequence whose observers trigger an invocation of the given observable factory function.

#### Example
```js
var source = Rx.Observable.defer(function () {
    return Rx.Observable.return(42);
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

File:
- [/src/core/observable/defer.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/defer.js)

Dist:
- [rx.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js)
- [rx.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.compat.js)
- [rx.lite.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [rx.lite.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Required Files:
- <None>

NPM Packages:
- rx

NuGet Packages:
- RxJS-Main
- RxJS-Lite

Unit Tests:
- [/tests/observable/defer.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/defer.js)

* * *

### <a id="rxobservableemptyscheduler"></a>`Rx.Observable.empty([scheduler])`
<a href="#rxobservableemptyscheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/empty.js#L10-L17 "View in source") 

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

File:
- [/src/core/observable/empty.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/empty.js)

Dist:
- [rx.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js)
- [rx.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.compat.js)
- [rx.lite.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [rx.lite.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Required Files:
- <None>

NPM Packages:
- rx

NuGet Packages:
- RxJS-Main
- RxJS-Lite

Unit Tests:
- [/tests/observable/empty.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/empty.js)

* * *

### <a id="rxobservableforsources-resultselector"></a>`Rx.Observable.for(sources, resultSelector)`
<a href="#rxobservableforsources-resultselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/for.js#L8-L10 "View in source") 

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

File:
- [/src/core/observable/for.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/for.js)

Dist:
- [rx.experimental.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js)

Required Files:
- rx.js | rx.compat.js | rx.lite.js | rx.lite.compat.js

NPM Packages:
- rx

NuGet Packages:
- RxJS-Experimental

Unit Tests:
- [/tests/observable/for.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/for.js)

* * *

### <a id="rxobservableforkjoinargs"></a>`Rx.Observable.forkJoin(...args)`
<a href="#rxobservableforkjoinargs">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/forkjoin.js#L9-L57 "View in source") 

Runs all observable sequences in parallel and collect their last elements.

#### Arguments
1. `args` *(Arguments | Array)*: An array or arguments of Observable sequences to collect the last elements for.

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

File:
- [/src/core/observable/forkjoin.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/forkjoin.js)

Dist:
- [rx.experimental.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js)

Required Files:
- rx.js | rx.compat.js | rx.lite.js | rx.lite.compat.js

NPM Packages:
- rx

NuGet Packages:
- RxJS-Experimental

Unit Tests:
- [/tests/observable/forkjoin.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/forkjoin.js)

* * *

### <a id="rxobservablefromarrayarray-scheduler"></a>`Rx.Observable.fromArray(array, [scheduler])`
<a href="#rxobservablefromarrayarray-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/fromarray.js#L10-L23 "View in source") 

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

File:
- [/src/core/observable/fromarray.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/fromarray.js)

Dist:
- [rx.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js)
- [rx.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.compat.js)
- [rx.lite.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [rx.lite.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Required Files:
- <None>

NPM Packages:
- rx

NuGet Packages:
- RxJS-Main
- RxJS-Lite

Unit Tests:
- [/tests/observable/fromarray.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/fromarray.js)

* * *

### <a id="rxobservablefromcallbackfunc-scheduler-context-selector"></a>`Rx.Observable.fromCallback(func, [scheduler], [context], [selector])`
<a href="#rxobservablefromcallbackfunc-scheduler-context-selector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/fromcallback.js#L10-L39 "View in source") 

Converts a callback function to an observable sequence. 

#### Arguments
1. `func` *(Function)*: Function with a callback as the last parameter to convert to an Observable sequence.
2. `[scheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler to run the function on. If not specified, defaults to `Rx.Scheduler.timeout`.
3. `[context]` *(Any)*: The context for the func parameter to be executed.  If not specified, defaults to undefined.
4. `[selector]` *(Function)*: A selector which takes the arguments from the callback to produce a single item to yield on next.

#### Returns
*(Function)*: A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array if no selector given, else the object created by the selector function.

#### Example
```js
var fs = require('fs'),
    Rx = require('rx');

// Wrap fs.exists
var exists = Rx.Observable.fromCallback(fs.exists);

// Check if file.txt exists
var source = exists('file.txt', 
    null, /* no scheduler */
    null, /* no context */
    function (arr) {
        return arr[0]; /* return only the true/false */
    });

var subscription = source.subscribe(
    function (x) {
        // Extract value from arguments array
        var result = x[0];

        console.log('Next: ' + result);
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
- [/src/core/observable/fromcallback.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/fromcallback.js)

Dist:
- [rx.async.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.async.js)
- [rx.async.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.async.compat.js)
- [rx.lite.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [rx.lite.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Required Files:
- If using rx.async.js | rx.async.compat.js
    - rx.js | rx.compat.js
    - rx.binding.js

NPM Packages:
- rx

NuGet Packages:
- RxJS-Async
- RxJS-Lite

Unit Tests:
- [/tests/observable/fromcallback.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/fromcallback.js)

* * *

### <a id="rxobservablefromeventelement-eventname-selector"></a>`Rx.Observable.fromEvent(element, eventName, [selector])`
<a href="#rxobservablefromeventelement-eventname-selector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/fromevent.js#L112-L132 "View in source") 

Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList or Node.js EventEmitter.

#### Arguments
1. `element` *(Any)*: The DOMElement, NodeList or EventEmitter to attach a listener.
2. `eventName` *(String)*: The event name to attach the observable sequence.
3. `[selector]` *(Function)*: A selector which takes the arguments from the event handler to produce a single item to yield on next.

#### Returns
*(Observable)*: An observable sequence of events from the specified element and the specified event.

#### Example

Wrapping an event from [jQuery](http://jquery.com)

```js
var input = $('#input');

var source = Rx.Observable.fromEvent(input, 'click');

var subscription = source.subscribe(
    function (x) {
        console.log('Next: Clicked!');
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

input.trigger('click');

// => Next: Clicked!
```

Using in Node.js with using an `EventEmitter` with a selector function (which is not required).

```js
var EventEmtiter = require('events').EventEmitter,
    Rx = require('rx');

var eventEmitter = new EventEmitter();

var source = Rx.Observable.fromEvent(
    eventEmitter,
    'data', 
    function (args) {
        return { foo: args[0], bar: args[1] };
    });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: foo -' x.foo + ', bar -' + x.bar);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

eventEmitter.emit('data', 'baz', 'quux');
// => Next: foo - baz, bar - quux
```

### Location

File:
- [/src/core/observable/fromevent.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/fromevent.js)
- [/src/core/observable/fromevent-modern.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/fromevent-modern.js)

Dist:
- [rx.async.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.async.js)
- [rx.async.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.async.compat.js)
- [rx.lite.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.js)
- [rx.lite.compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.lite.compat.js)

Required Files:
- If using rx.async.js | rx.async.compat.js
    - rx.js | rx.compat.js
    - rx.binding.js

NPM Packages:
- rx

NuGet Packages:
- RxJS-Async
- RxJS-Lite

Unit Tests:
- [/tests/observable/fromevent-compat.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/fromevent-compat.js)
- [/tests/observable/fromevent.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/fromevent.js)

* * *

### <a id="rxobservablefromeventpatternaddhander-removehandler-selector"></a>`Rx.Observable.fromEventPattern(addHandler, removeHandler, [selector])`
<a href="#rxobservablefromeventpatternaddhander-removehandler-selector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/fromeventpattern.js#L8-L30 "View in source") 

Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList or Node.js EventEmitter.

#### Arguments
1. `addHandler` *(Function)*: The DOMElement, NodeList or EventEmitter to attach a listener.
2. `removeHandler` *(Function)*: The event name to attach the observable sequence.
3. `[selector]` *(Function)*: A selector which takes the arguments from the event handler to produce a single item to yield on next.

#### Returns
*(Observable)*: An observable sequence of events from the specified element and the specified event.

#### Example

Wrapping an event from [jQuery](http://jquery.com)

```js
var input = $('#input');

var source = Rx.Observable.fromEventPattern(
    function add (h) {
        input.bind('click', h);
    },
    function remove (h) {
        input.unbind('click', h);
    }
);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: Clicked!');
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

input.trigger('click');

// => Next: Clicked!
```

Wrapping an event from the [Dojo Toolkit](http://dojotoolkit.org)

```js
require(['dojo/on', 'dojo/dom', 'rx', 'rx.async', 'rx.binding'], function (on, dom, rx) {

    var input = dom.byId('input');

    var source = Rx.Observable.fromEventPattern(
        function add (h) {
            return on(input, 'click', h);
        },
        function remove (_, signal) {
            signal.remove();
        }
    );

    var subscription = source.subscribe(
        function (x) {
            console.log('Next: Clicked!');
        },
        function (err) {
            console.log('Error: ' + err);   
        },
        function () {
            console.log('Completed');   
        });

    on.emit(input, 'click');
    // => Next: Clicked!
});
```

Using in Node.js with using an `EventEmitter`.

```js
var EventEmitter = require('events').EventEmitter,
    Rx = require('rx');

var e = new EventEmitter();

// Wrap EventEmitter
var source = Rx.Observable.fromEventPattern(
    function add (h) {
        e.addListener('data', h);
    },
    function remove (h) {
        e.removeListener('data', h);
    },
    function (arr) {
        return arr[0] + ',' + arr[1];
    }
);

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + result);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });


e.emit('data', 'foo', 'bar');
// => Next: foo,bar
```

### Location

File:
- /src/core/observable/fromeventpattern.js

Dist:
- rx.async.js
- rx.async.compat.js

* * *

### <a id="rxobservablefromnodecallbackfunc-scheduler-context-selector"></a>`Rx.Observable.fromNodeCallback(func, [scheduler], [context], [selector])`
<a href="#rxobservablefromnodecallbackfunc-scheduler-context-selector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/fromnodecallback.js#L9-L43 "View in source") 

Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.

#### Arguments
1. `func` *(Function)*: Function with a callback as the last parameter to convert to an Observable sequence.
2. `[scheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler to run the function on. If not specified, defaults to `Rx.Scheduler.timeout`.
3. `[context]` *(Any)*: The context for the func parameter to be executed.  If not specified, defaults to undefined.
4. `[selector]` *(Function)*: A selector which takes the arguments from callback sans the error to produce a single item to yield on next.

#### Returns
*(Function)*: A function which when applied, returns an observable sequence with the callback arguments as an array if no selector given, else the object created by the selector function on success, or an error if the first parameter is not falsy.

#### Example
```js
var fs = require('fs'),
    Rx = require('rx');

// Wrap fs.exists
var rename = Rx.Observable.fromNodeCallback(fs.rename);

// Rename file which returns no parameters except an error
var source = rename('file1.txt', 'file2.txt');

var subscription = source.subscribe(
    function (x) {
        console.log('Next: success!');
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Next: success!
// => Completed
```

### Location

File:
- /src/core/observable/fromnodecallback.js

Dist:
- rx.async.js
- rx.async.compat.js

* * *

### <a id="rxobservablefrompromisepromise"></a>`Rx.Observable.fromPromise(promise)`
<a href="#rxobservablefrompromisepromise">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/frompromise.js#L6-L19 "View in source") 

Converts a Promises/A+ spec compliant Promise to an Observable sequence.

#### Arguments
1. `promise` *(Promise)*: Promises/A+ spec compliant Promise to an Observable sequence.

#### Returns
*(Observable)*: An Observable sequence which wraps the existing promise success and failure.

#### Example
```js

// Create a promise which resolves 42
var promise1 = new RSVP.Promise(function (resolve, reject) {
    resolve(42);
});

var source1 = Rx.Observable.fromPromise(promise);

var subscription1 = source1.subscribe(
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

// Create a promise which rejects with an error
var promise1 = new RSVP.Promise(function (resolve, reject) {
    reject(new Error('reason'));
});

var source1 = Rx.Observable.fromPromise(promise);

var subscription1 = source1.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    });

// => Error: Error: reject
```

### Location

File:
- /src/core/observable/frompromise.js

Dist:
- rx.async.js
- rx.async.compat.js

* * *

### <a id="rxobservablegenerateinitialstate-condition-iterate-resultselector-scheduler"></a>`Rx.Observable.generate(initialState, condition, iterate, resultSelector, [scheduler])`
<a href="#rxobservablegenerateinitialstate-condition-iterate-resultselector-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") 

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

### <a id="rxobservablegeneratewithabsolutetimeinitialstate-condition-iterate-resultselector-timeselector-schedule"></a>`Rx.Observable.generateWithAbsoluteTime(initialState, condition, iterate, resultSelector, timeSelector, [scheduler])`
<a href="#rxobservablegeneratewithabsolutetimeinitialstate-condition-iterate-resultselector-timeselector-schedule">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") 

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

### <a id="rxobservablegeneratewithrelativetimeinitialstate-condition-iterate-resultselector-timeselector-scheduler"></a>`Rx.Observable.generateWithRelativeTime(initialState, condition, iterate, resultSelector, timeSelector, [scheduler])`
<a href="#rxobservablegeneratewithrelativetimeinitialstate-condition-iterate-resultselector-timeselector-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") 

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

### <a id="rxobservableifcondition-thensource-elsesource"></a>`Rx.Observable.if(condition, thenSource, [elseSource])`
<a href="#rxobservableifcondition-thensource-elsesource">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") 

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

### <a id="rxobservableintervalperiod-scheduler"></a>`Rx.Observable.interval(period, [scheduler])`
<a href="#rxobservableintervalperiod-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") 

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

### <a id="rxobservablemergescheduler-args"></a>`Rx.Observable.merge([scheduler], ...args)`
<a href="#rxobservablemergescheduler-args">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") 

Merges all the observable sequences into a single observable sequence.  

#### Arguments
1. `[scheduler]` *(Scheduler=Rx.Scheduler.timeout)*: Scheduler to run the timer on. If not specified, Rx.Scheduler.immediate is used.
1. `args` *(Array|arguments)*: Observable sequences to merge into a single sequence.

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

### <a id="rxobservablenever"></a>`Rx.Observable.never()`
<a href="#rxobservablenever">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") 

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

### <a id="rxobservableonerrorresumenextargs"></a>`Rx.Observable.onErrorResumeNext(...args)`
<a href="#rxobservableonerrorresumenextargs">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") 

Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.

### Arguments
1. `args` *(Array|arguments)*: Observable sequences to concatenate.

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

### <a id="rxobservablerangestart-count-scheduler"></a>`Rx.Observable.range(start, count, [scheduler])`
<a href="#rxobservablerangestart-count-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") 

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

### <a id="rxobservablerepeatvalue-repeatcount-scheduler"></a>`Rx.Observable.repeat(value, [repeatCount], [scheduler])`
<a href="#rxobservablerepeatvalue-repeatcount-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") 

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

### <a id="rxobservablereturnvalue-scheduler"></a>`Rx.Observable.return(value, [scheduler])`
<a href="#rxobservablereturnvalue-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L2549-L2559 "View in source") 

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

### <a id="rxobservablestartfunc-scheduler-context"></a>`Rx.Observable.start(func, [scheduler], [context])`
<a href="#rxobservablestartfunc-scheduler-context">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2639-L2641 "View in source") 

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

### <a id="rxobservablethrowexception-scheduler"></a>`Rx.Observable.throw(exception, [scheduler])`
<a href="#rxobservablethrowexception-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L133-L152 "View in source") 

Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single onError message.
There is an alias to this method called `throwException` for browsers <IE9.

### Arguments
1. `dueTime` *(Any)*: Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
2. `[scheduler=Rx.Scheduler.immediate]` *(Scheduler)*: Scheduler to send the exceptional termination call on. If not specified, defaults to the immediate scheduler.

#### Returns
*(Observable)*: The observable sequence that terminates exceptionally with the specified exception object.
   
#### Example
```js
var source = Rx.Observable.return(42)
    .selectMany(Rx.Observable.throw(new Error('error!')));

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

// => Error: Error: error!
```

### Location

- rx.time.js

* * *

### <a id="rxobservabletimerduetime-period-scheduler"></a>`Rx.Observable.timer(dueTime, [period], [scheduler])`
<a href="#rxobservabletimerduetime-period-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L133-L152 "View in source") 

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

### <a id="rxobservabletoasyncfunc-scheduler-context"></a>`Rx.Observable.toAsync(func, [scheduler], [context])`
<a href="#rxobservabletoasyncfunc-scheduler-context">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2656-L2673 "View in source") 

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

### <a id="rxobservableusingresourcefactory-observablefactory"></a>`Rx.Observable.using(resourceFactory, observableFactory)`
<a href="#rxobservableusingresourcefactory-observablefactory">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2973-L2987 "View in source") 

 Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.

### Arguments
1. `resourceFactory` *(Function)*: Factory function to obtain a resource object.
2. `observableFactory` *(Scheduler)*: Factory function to obtain an observable sequence that depends on the obtained resource.

#### Returns
*(Function)*: An observable sequence whose lifetime controls the lifetime of the dependent resource object.

#### Example
```js
/* Using an AsyncSubject as a resource which supports the .dispose method */
function DisposableResource(value) {
    this.value = null;
    this.disposed = false;
}

DisposableResource.prototype.getValue = function () {
    if (this.disposed) {
        throw new Error('Object is disposed');
    }
    return this.value;
};

DisposableResource.prototype.dispose = function () {
    if (!this.disposed) {
        this.disposed = true;
        this.value = null;
    }
    console.log('Disposed');
};

var source = Rx.Observable.using(
    function () { return new DisposableResource(42); },
    function (resource) {
        var subject = new AsyncSubject();
        s.onNext(resource.getValue());
        s.onCompleted();
        return subject;
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

// => Next: 42
// => Completed 

subscription.dispose();

// => Disposed
```

### Location

- rx.js

* * *

### <a id="rxobservablewhenargs"></a>`Rx.Observable.when(...args)`
<a href="#rxobservablewhenargs">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.joinpatterns.js#L366-L152 "View in source") 

A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.

### Arguments
1. `args` *(arguments|Array)*: A series of plans (specified as an Array of as a series of arguments) created by use of the then operator on patterns.

#### Returns
*(Observable)*: Observable sequence with the results form matching several patterns. 

#### Example
```js
// Fire each plan when both are ready
var source = Rx.Observable.when(
  Rx.Observable.timer(100).and(Rx.Observable.timer(500)).then(function (x, y) { return 'first'; }),
  Rx.Observable.timer(400).and(Rx.Observable.timer(300)).then(function (x, y) { return 'second'; })
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


// => Next: second
// => Next: first
// => Completed 
```

### Location

- rx.joinpatterns.js

* * *

### <a id="rxobservablewhilecondition-source"></a>`Rx.Observable.while(condition, source)`
<a href="#rxobservablewhilecondition-source">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L126-L128 "View in source") 

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

### <a id="rxobservablezipargs"></a>`Rx.Observable.zip(...args)`
<a href="#rxobservablezipargs">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/ziparray.js#L7-L11 "View in source") 

Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.

#### Arguments
1. `args` *(Array|arguments)*: Observable sources.

#### Returns
*(Observable)*: An observable sequence containing the result of combining elements of the sources using the specified result selector function.

#### Example
```js
/* Using arguments */
var range = Rx.Observable.range(0, 5);

var source = Observable.zip(
    range,
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
```

### Location

File:
- /src/core/observable/zip.js

Dist:
- rx.js
- rx.compat.js
- rx.lite.js
- rx.lite.compat.js

* * *

### <a id="rxobservableziparrayargs"></a>`Rx.Observable.zipArray(...args)`
<a href="#rxobservableprototypeziparrayargs">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/ziparray.js#L6-L52 "View in source") 

Merges the specified observable sequences into one observable sequence by emitting a list with the elements of the observable sequences at corresponding indexes.

#### Arguments
1. `args` *(Arguments | Array)*: Observable sources.

#### Returns
*(Observable)*: An observable sequence containing lists of elements at corresponding indexes.

#### Example
```js
var range = Rx.Observable.range(0, 5);

var source = Rx.Observable.zipArray(
    range,
    range.skip(1), 
    range.skip(2)
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

// => Next: 0,1,2 
// => Next: 1,2,3 
// => Next: 2,3,4 
// => Completed 
```

#### Location

File:
- /src/core/observable/ziparray.js

Dist:
- rx.js
- rx.compat.js
- rx.lite.js
- rx.lite.compat.js

* * *

## _Observable Instance Methods_ ##

### <a id="rxobservableprototypeaggregateseed-accumulator"></a>`Rx.Observable.prototype.aggregate([seed], accumulator)`
<a href="#rxobservableprototypeaggregateseed-accumulator">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L102-L112 "View in source") 

 Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
 For aggregation behavior with incremental intermediate results, see `Rx.Observable.scan`.

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

### <a id="rxobservableprototypeallpredicate-thisarg"></a>`Rx.Observable.prototype.all(predicate, [thisArg])`
<a href="#rxobservableprototypeallpredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L179-L185 "View in source") 

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

### <a id="rxobservableprototypeambrightsource"></a>`Rx.Observable.prototype.amb(rightSource)`
<a href="#rxobservableprototypeambrightsource">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2996-L3055 "View in source") 

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

### <a id="rxobservableprototypeandrightsource"></a>`Rx.Observable.prototype.and(rightSource)`
<a href="#rxobservableprototypeandrightsource">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.joinpatterns.js#L346-L348 "View in source") 

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
// => Next: second
// => Completed 
```

#### Location

- rx.joinpatterns.js

* * *

### <a id="rxobservableprototypeanypredicate-thisarg"></a>`Rx.Observable.prototype.any([predicate], [thisArg])`
<a href="#rxobservableprototypeanypredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L144-L157 "View in source") 

Determines whether any element of an observable sequence satisfies a condition if present, else if any items are in the sequence. There is an alias to this function called `some`.

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

### <a id="rxobservableprototypeasobservable"></a>`Rx.Observable.prototype.asObservable()`
<a href="#rxobservableprototypeasobservable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3675-L3680 "View in source") 

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

### <a id="rxobservableprototypeaverageselector"></a>`Rx.Observable.prototype.average([selector])`
<a href="#rxobservableprototypeaverageselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L313-L327 "View in source") 

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

### <a id="rxobservableprototypebufferbufferopenings-bufferboundaries-bufferclosingselector"></a>`Rx.Observable.prototype.buffer([bufferOpenings], [bufferBoundaries], [bufferClosingSelector])`
<a href="#rxobservableprototypebufferbufferopenings-bufferboundaries-bufferclosingselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.coincidence.js#L572-L585 "View in source") 

Projects each element of an observable sequence into zero or more buffers.

```js
// With buffer closing selector
Rx.Observable.prototype.buffer(bufferClosingSelector);

// With buffer opening and window closing selector
Rx.Observable.prototype.buffer(bufferOpenings, bufferClosingSelector);

// With buffer boundaries
Rx.Observable.prototype.buffer(bufferBoundaries);
```

#### Arguments
1. `[bufferOpenings]` *(Observable)*: Observable sequence whose elements denote the creation of new windows.
2. `[bufferBoundaries] *(Observable)*: Sequence of buffer boundary markers. The current buffer is closed and a new buffer is opened upon receiving a boundary marker.
2. `[bufferClosingSelector]` *(Function)*: A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.

#### Returns
*(Observable)*: An observable sequence of windows. 

#### Example
```js
/* Using buffer boundaries */
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

/* Using a buffer closing selector */
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
    .buffer(openings, function (x) { return Rx.Observable.timer(x + 100); })
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

### <a id="rxobservableprototypebufferwithcountcount-skip"></a>`Rx.Observable.prototype.bufferWithCount(count, [skip])`
<a href="#rxobservableprototypebufferwithcountcount-skip">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3694-L3703 "View in source") 

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

### <a id="rxobservableprototypebufferwithtimetimespan-timeshift--scheduler-scheduler"></a>`Rx.Observable.prototype.bufferWithTime(timeSpan, [timeShift | scheduler], [scheduler])`
<a href="#rxobservableprototypebufferwithtimetimespan-timeshift--scheduler-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L483-L498 "View in source") 

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

### <a id="rxobservableprototypebufferwithtimeorcounttimespan-count-scheduler"></a>`Rx.Observable.prototype.bufferWithTimeOrCount(timeSpan, count, [scheduler])`
<a href="#rxobservableprototypebufferwithtimeorcounttimespan-count-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L513-L518 "View in source") 

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

### <a id="rxobservableprototypecatchsecond--handler"></a>`Rx.Observable.prototype.catch(second | handler)`
<a href="#rxobservableprototypecatchsecond--handler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3107-L3112 "View in source") 

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

### <a id="rxobservableprototypecombinelatestargs-resultselector"></a>`Rx.Observable.prototype.combineLatest(...args, resultSelector)`
<a href="#rxobservableprototypecombinelatestargs-resultselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3139-L3147 "View in source") 

Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences produces an element.  This can be in the form of an argument list of observables or an array.

#### Arguments
1. `args` *(arguments | Array)*: An array or arguments of Observable sequences.
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

### <a id="rxobservableprototypeconcatargs"></a>`Rx.Observable.prototype.concat(...args)`
<a href="#rxobservableprototypeconcatargs">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3223-L3227 "View in source") 

Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.

#### Arguments
1. `args` *(arguments | Array)*: An array or arguments of Observable sequences.

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

### <a id="rxobservableprototypeconcatallargs"></a>`Rx.Observable.prototype.concatAll()`
<a href="#rxobservableprototypeconcatallargs">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3223-L3227 "View in source") 

Concatenates a sequence of observable sequences into a single observable sequence.

#### Returns
*(Observable)*: The observable sequence that merges the elements of the inner sequences. 
 
#### Example
```js
var source = Rx.Observable.range(0, 3)
    .map(function (x) { return Rx.Observable.range(x, 3); })
    .concatAll();

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

### <a id="connectableobservableprototypeconnect"></a>`ConnectableObservable.prototype.connect()`
<a href="#connectableobservableprototypeconnect">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js#L504 "View in source") 

Connects the observable wrapper to its source. All subscribed observers will receive values from the underlying observable sequence as long as the connection is established.

#### Returns
*(Disposable)*: Disposable object used to disconnect the observable wrapper from its source, causing subscribed observer to stop receiving values from the underlying observable sequence.
 
#### Example
```js
var interval = Rx.Observable.interval(1000);

var source = interval
    .take(2)
    .do(function (x) { 
        console.log('Side effect');
    });
 
var published = source.publish();
 
published.subscribe(createObserver('SourceA'));
published.subscribe(createObserver('SourceB'));
 
// Connect the source
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
// => Completed     
```

#### Location

- rx.binding.js

* * *

### <a id="rxobservableprototypecontainsvalue-comparer"></a>`Rx.Observable.prototype.contains(value, [comparer])`
<a href="#rxobservableprototypecontainsvalue-comparer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L198-L203 "View in source") 

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

### <a id="rxobservableprototypecountpredicate"></a>`Rx.Observable.prototype.count([predicate])`
<a href="#rxobservableprototypecountpredicate">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L214-L220 "View in source") 

Returns an observable sequence containing a value that represents how many elements in the specified observable sequence satisfy a condition if provided, else the count of items.

#### Arguments
1. `[predicate]` *(Any)*: A function to test each element for a condition.  The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed

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

### <a id="rxobservableprototypedefaultifemptydefaultvalue"></a>`Rx.Observable.prototype.defaultIfEmpty([defaultValue])`
<a href="#rxobservableprototypedefaultifemptydefaultvalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4111-L4128 "View in source") 

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

### <a id="rxobservableprototypedelayduetime-scheduler"></a>`Rx.Observable.prototype.delay(dueTime, [scheduler])`
<a href="#rxobservableprototypedelayduetime-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4111-L4128 "View in source") 

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

### <a id="rxobservabledelaywithselectordelaysubscriptiondelay-delaydurationselector"></a>`Rx.Observable.delayWithSelector.delay([subscriptionDelay], delayDurationSelector)`
<a href="#rxobservabledelaywithselectordelaysubscriptiondelay-delaydurationselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L832-L882 "View in source") 

Time shifts the observable sequence by dueTime. The relative time intervals between the values are preserved.

#### Arguments
1. `[subscriptionDelay]` *(Observable)*: Sequence indicating the delay for the subscription to the source. 
2. `delayDurationSelector` *(Function)*: Selector function to retrieve a sequence indicating the delay for each given element.

#### Returns
*(Observable)*: Time-shifted sequence.
  
#### Example
```js
/* With subscriptionDelay */
var source = Rx.Observable
    .range(0, 3)
    .delayWithSelector(
        Rx.Observable.timer(300), 
        function (x) {
            return Rx.Observable.timer(x * 400);
        }
    )
    .timeInterval()
    .map(function (x) { return x.value + ':' + x.interval; });
    
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

// => Next: 0:300
// => Next: 1:400
// => Next: 2:400
// => Completed

/* Without subscriptionDelay */
var source = Rx.Observable
    .range(0, 3)
    .delayWithSelector(
        function (x) {
            return Rx.Observable.timer(x * 400);
        })
    .timeInterval()
    .map(function (x) { return x.value + ':' + x.interval; });
    
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
// => Next: 1:400
// => Next: 2:400
// => Completed
```
#### Location

- rx.time.js

* * *

### <a id="rxobservableprototypedematerialize"></a>`Rx.Observable.prototype.dematerialize()`
<a href="#rxobservableprototypedematerialize">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3711-L3718 "View in source") 

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

### <a id="rxobservableprototypedistinctkeyselector-keyserializer"></a>`Rx.Observable.prototype.distinct([keySelector], [keySerializer])`
<a href="#rxobservableprototypedistinctkeyselector-keyserializer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4144-L4171 "View in source") 

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

### <a id="rxobservableprototypedistinctuntilchangedkeyselector-comparer"></a>`Rx.Observable.prototype.distinctUntilChanged([keySelector], [comparer])`
<a href="#rxobservableprototypedistinctuntilchangedkeyselector-comparer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4144-L4171 "View in source") 

Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer. Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large. 

#### Arguments
1. `[keySelector]` *(Function)*: A function to compute the comparison key for each element.
2. `[comparer]` *(Function)*: Equality comparer for computed key values. If not provided, defaults to an equality comparer function.

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

### <a id="rxobservableprototypedoobserver--onnext-onerror-oncompleted"></a>`Rx.Observable.prototype.do(observer | [onNext], [onError], [onCompleted])`
<a href="#rxobservableprototypedoobserver--onnext-onerror-oncompleted">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3779-L3820 "View in source") 

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

### <a id="rxobservableprototypedowhilecondition-source"></a>`Rx.Observable.prototype.doWhile(condition, source)`
<a href="#rxobservableprototypedowhilecondition-source">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2549-L2559 "View in source") 

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

### <a id="rxobservableprototypeelementatindex"></a>`Rx.Observable.prototype.elementAt(index)`
<a href="#rxobservableprototypeelementatindex">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L474-L476 "View in source") 

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

### <a id="rxobservableprototypeelementatordefaultindex-defaultvalue"></a>`Rx.Observable.prototype.elementAtOrDefault(index, [defaultValue])`
<a href="#rxobservableprototypeelementatordefaultindex-defaultvalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L489-L491 "View in source") 

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

### <a id="rxobservableprototypeeverypredicate-thisarg"></a>`Rx.Observable.prototype.every(predicate, [thisArg])`
<a href="#rxobservableprototypeeverypredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L179-L185 "View in source") 

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
<a href="#expand">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L179-L234 "View in source") 

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

### <a id="rxobservableprototypefilterpredicate-thisarg"></a>`Rx.Observable.prototype.filter(predicate, [thisArg])`
<a href="#rxobservableprototypefilterpredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4513-L4530 "View in source") 

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

### <a id="rxobservableprototypefinallyaction"></a>`Rx.Observable.prototype.finally(action)`
<a href="#rxobservableprototypefinallyaction">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3832-L3846 "View in source") 

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

### <a id="rxobservableprototypefindpredicate-thisarg"></a>`Rx.Observable.prototype.find(predicate, [thisArg])`
<a href="#rxobservableprototypefindpredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L699-L701 "View in source") 

Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire Observable sequence.
 
#### Arguments
1. `predicate` *(Function)*: A function to test each source element for a condition;  The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as `this` when executing the predicate.

#### Returns
*(Observable)*: An Observable sequence with the first element that matches the conditions defined by the specified predicate, if found; otherwise, undefined.

#### Example
```js
/* Found an element */
var array = [1,2,3,4];

var source = Rx.Observable.fromArray(array)
    .find(function (x, i, obs) {
        return x === 1;
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
// => Completed  

/* Not found */
var array = [1,2,3,4];

var source = Rx.Observable.fromArray(array)
    .find(function (x, i, obs) {
        return x === 5;
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

// => Next: undefined
// => Completed 
```

#### Location

- rx.aggregates.js

* * *

### <a id="rxobservableprototypefindindexpredicate-thisarg"></a>`Rx.Observable.prototype.findIndex(predicate, [thisArg])`
<a href="#rxobservableprototypefindindexpredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L712-L714 "View in source") 

Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire Observable sequence.
 
#### Arguments
1. `predicate` *(Function)*: A function to test each source element for a condition;  The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as `this` when executing the predicate.

#### Returns
*(Observable)*: An Observable sequence with the first element that matches the conditions defined by the specified predicate, if found; otherwise, undefined.

#### Example
```js
/* Found an element */
var array = [1,2,3,4];

var source = Rx.Observable.fromArray(array)
    .findIndex(function (x, i, obs) {
        return x === 1;
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
// => Completed  

/* Not found */
var array = [1,2,3,4];

var source = Rx.Observable.fromArray(array)
    .findIndex(function (x, i, obs) {
        return x === 5;
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

// => Next: -1
// => Completed 
```

#### Location

- rx.aggregates.js

* * *

### <a id="rxobservableprototypefirstpredicate-thisarg"></a>`Rx.Observable.prototype.first([predicate], [thisArg])`
<a href="#rxobservableprototypefirstpredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L577-L582 "View in source") 

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

### <a id="rxobservableprototypefirstordefaultpredicate-defaultvalue-thisarg"></a>`Rx.Observable.prototype.firstOrDefault(predicate, [defaultValue], [thisArg])`
<a href="#rxobservableprototypefirstordefaultpredicate-defaultvalue-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L577-L582 "View in source") 

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

### <a id="rxobservableprototypeflatmpaselector-resultselector"></a>`Rx.Observable.prototype.flatMap(selector, [resultSelector])`
<a href="#rxobservableprototypeflatmapselector-resultselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4311-L4326 "View in source") 

This is an alias for the `selectMany` method.

One of the following:

Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.

```js
source.flatMap(function (x) { return Rx.Observable.range(0, x); });
```

Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.

```js
source.flatMap(function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
```

Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
 
 ```js
source.flatMap(Rx.Observable.fromArray([1,2,3]));
 ```

#### Arguments
1. `selector` *(Function)*:  A transform function to apply to each element or an observable sequence to project each element from the source sequence onto.
2. `[resultSelector]` *(Function)*: A transform function to apply to each element of the intermediate sequence.
 
#### Returns
*(Observable)*: An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.   

#### Example
```js
var source = Rx.Observable
    .range(1, 2)
    .flatMap(function (x) {
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
```

#### Location

- rx.js

* * *

### <a id="rxobservableprototypeflatmplatestaselector-thisArg"></a>`Rx.Observable.prototype.flatMapLatest(selector, [thisArg])`
<a href="#rxobservableprototypeflatmplatestaselector-thisArg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4311-L4326 "View in source") 

This is an alias for the `selectSwitch` method.

 Projects each element of an observable sequence into a new sequence of observable sequences by incorporating the element's index and then transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.

#### Arguments
1. `selector` *(Function)*:  A transform function to apply to each source element.  The callback has the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as `this` when executing the predicate.
 
#### Returns
*(Observable)*: An observable sequence whose elements are the result of invoking the transform function on each element of source producing an Observable of Observable sequences and that at any point in time produces the elements of the most recent inner observable sequence that has been received.    

#### Example
```js
var source = Rx.Observable
    .range(1, 2)
    .flatMapLatest(function (x) {
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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypeforkjoinsecond-resultselector"></a>`Rx.Observable.prototype.forkJoin(second, resultSelector)`
<a href="#rxobservableprototypeforkjoinsecond-resultselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L304-L373 "View in source") 

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

### <a id="rxobservableprototypegroupbykeyselector-elementselector-keyserializer"></a>`Rx.Observable.prototype.groupBy(keySelector, [elementSelector], [keySerializer])`
<a href="#rxobservableprototypegroupbykeyselector-elementselector-keyserializer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4187-L4191 "View in source") 

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

### <a id="rxobservableprototypegroupbyuntilkeyselector-elementselector-durationselector-keyserializer"></a>`Rx.Observable.prototype.groupByUntil(keySelector, [elementSelector], durationSelector, [keySerializer])`
<a href="#rxobservableprototypegroupbyuntilkeyselector-elementselector-durationselector-keyserializer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4212-L4301 "View in source") 

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

### <a id="rxobservableprototypegroupjoinright-leftdurationselector-rightdurationselector-resultselector"></a>`Rx.Observable.prototype.groupJoin(right, leftDurationSelector, rightDurationSelector, resultSelector)`
<a href="#rxobservableprototypegroupjoinright-leftdurationselector-rightdurationselector-resultselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.coincidence.js#L431-L563 "View in source") 

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
    }).mergeAll().take(5);

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

### <a id="rxobservableprototypeignoreelements"></a>`Rx.Observable.prototype.ignoreElements()`
<a href="#rxobservableprototypeignoreelements">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3854-L3859 "View in source") 

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

### <a id="rxobservableprototypeisempty"></a>`Rx.Observable.prototype.isEmpty()`
<a href="#rxobservableprototypeisempty">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L166-L168 "View in source") 

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

### <a id="rxobservableprototypejoinright-leftdurationselector-rightdurationselector-resultselector"></a>`Rx.Observable.prototype.join(right, leftDurationSelector, rightDurationSelector, resultSelector)`
<a href="#rxobservableprototypejoinright-leftdurationselector-rightdurationselector-resultselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.coincidence.js#L332-L420 "View in source") 

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

### <a id="rxobservableprototypelastpredicate-thisarg"></a>`Rx.Observable.prototype.last([predicate], [thisArg])`
<a href="#rxobservableprototypelastpredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L634-L639 "View in source") 

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

### <a id="rxobservableprototypelastordefaultpredicate-defaultvalue-thisarg"></a>`Rx.Observable.prototype.lastOrDefault([predicate], [defaultValue], [thisArg])`
<a href="#rxobservableprototypelastordefaultpredicate-defaultvalue-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L634-L639 "View in source") 

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

- [`let`](#rxobservableprototypeletfunc)

### <a id="rxobservableprototypeletfunc"></a>`Rx.Observable.prototype.let(func)`
<a href="#rxobservableprototypeletfunc">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.experimental.js#L76-L78 "View in source") 

Returns an observable sequence that is the result of invoking the selector on the source sequence, without sharing subscriptions.

This operator allows for a fluent style of writing queries that use the same sequence multiple times.  There is an alias of `letBind` for browsers older than IE 9.

#### Arguments
1. `func` *(Function)*: Selector function which can use the source sequence as many times as needed, without sharing subscriptions to the source sequence.

#### Returns
*(Observable)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.

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

- rx.experimental.js

* * *

### <a id="rxobservableprototypemanyselectselector-scheduler"></a>`Rx.Observable.prototype.manySelect(selector, [scheduler])`
<a href="#rxobservableprototypemanyselectselector-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L634-L639 "View in source") 

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

- rx.experimental.js

* * *

### <a id="rxobservableprototypemapselector-thisarg"></a>`Rx.Observable.prototype.map(selector, [thisArg])`
<a href="#rxobservableprototypemapselector-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4311-L4326 "View in source") 

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

### <a id="rxobservableprototypemaxcomparer"></a>`Rx.Observable.prototype.max([comparer])`
<a href="#rxobservableprototypemaxcomparer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L297-L301 "View in source") 

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

### <a id="rxobservableprototypemaxbykeyselector-comparer"></a>`Rx.Observable.prototype.maxBy(keySelector, [comparer])`
<a href="#rxobservableprototypemaxbykeyselector-comparer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L282-L285 "View in source") 

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

### <a id="rxobservableprototypemergemaxconcurrent--other"></a>`Rx.Observable.prototype.merge(maxConcurrent | other)`
<a href="#rxobservableprototypemergemaxconcurrent--other">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3265-L3307 "View in source") 

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

### <a id="rxobservableprototypemergeobservable"></a>`Rx.Observable.prototype.mergeAll()`
<a href="#rxobservableprototypemergeobservable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3347-L3373 "View in source") 

Merges an observable sequence of observable sequences into an observable sequence.

#### Returns
*(Observable)*: The observable sequence that merges the elements of the inner sequences. 
 
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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypemincomparer"></a>`Rx.Observable.prototype.min([comparer])`
<a href="#rxobservableprototypemincomparer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L265-L269 "View in source") 

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

### <a id="rxobservableprototypeminbykeyselector-comparer"></a>`Rx.Observable.prototype.minBy(keySelector, [comparer])`
<a href="#rxobservableprototypeminbykeyselector-comparer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L249-L254 "View in source") 

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

### <a id="rxobservableprototypemulticastsubject--subjectselector-selector"></a>`Rx.Observable.prototype.multicast(subject | subjectSelector, [selector])`
<a href="#rxobservableprototypemulticastsubject--subjectselector-selector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js#L63-L71 "View in source") 

Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
invocation. For specializations with fixed subject types, see `publish`, `share`, `publishValue`, `shareValue`, `publishLast`, `replay`, and `shareReplay`.

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

### <a id="rxobservableprototypeobserveonscheduler"></a>`Rx.Observable.prototype.observeOn(scheduler)`
<a href="#rxobservableprototypeobserveonscheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2683-L2688 "View in source") 

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

### <a id="rxobservableprototypeonerrorresumenextsecond"></a>`Rx.Observable.prototype.onErrorResumeNext(second)`
<a href="#rxobservableprototypeonerrorresumenextsecond">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3382-L3387 "View in source") 

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

### <a id="rxobservableprototypepluckproperty"></a>`Rx.Observable.prototype.pluck(property)`
<a href="#rxobservableprototypepluckproperty">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4335-L4337 "View in source") 

Projects each element of an observable sequence into a new form by incorporating the element's index.  This is an alias for the `select` method.

#### Arguments
1. `property` *(String)*: The property to pluck.
 
#### Returns
*(Observable)*: Returns a new Observable sequence of property values.

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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypepublishselector"></a>`Rx.Observable.prototype.publish([selector])`
<a href="#rxobservableprototypepublishselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js#L84-L90 "View in source") 

Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.

This operator is a specialization of `multicast` using a regular `Rx.Subject`.

#### Arguments
1. `[selector]` *(Function)*: Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
  
#### Returns
*(ConnectableObservable)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   
#### Example
```js
/* Without publish */
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

#### Location

- rx.binding.js

* * *

### <a id="rxobservableprototypeshare"></a>`Rx.Observable.prototype.share()`
<a href="#rxobservableprototypeshare">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js#L84-L90 "View in source") 

Returns an observable sequence that shares a single subscription to the underlying sequence. 

This operator is a specialization of `publish` which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.

#### Returns
*(Observable)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
   
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
    .doAction(
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

#### Location

- rx.binding.js

* * *

### <a id="rxobservableprototypepublishlatestselector"></a>`Rx.Observable.prototype.publishLatest([selector])`
<a href="#rxobservableprototypepublishlatestselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js#L103-L109 "View in source") 

Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence containing only the last notification.

This operator is a specialization of `multicast` using a `Rx.AsyncSubject`.

#### Arguments
1. `[selector]` *(Function)*: Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will only receive the last notification of the source.

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

#### Location

- rx.binding.js

* * *

### <a id="rxobservableprototypepublishvalueselector"></a>`Rx.Observable.prototype.publishValue([selector])`
<a href="#rxobservableprototypepublishvalueselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js#L123-L129 "View in source") 

Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
   
This operator is a specialization of `multicast` using a `Rx.BehaviorSubject`.

#### Arguments
1. `[selector]` *(Function)*: Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive immediately receive the initial value, followed by all notifications of the source from the time of the subscription on.
 
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

#### Location

- rx.binding.js

* * *

### <a id="rxobservableprototypesharevalue"></a>`Rx.Observable.prototype.shareValue()`
<a href="#rxobservableprototypesharevalue">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js#L123-L129 "View in source") 

Returns an observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
   
This operator is a specialization of `publishValue` which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.

#### Returns
*(Observable)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
 
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

#### Location

- rx.binding.js

* * *

### <a id="connectableobservableprototyperefcount"></a>`ConnectableObservable.prototype.refCount()`
<a href="#connectableobservableprototyperefcount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js#L510-L528 "View in source") 

Returns an observable sequence that stays connected to the source as long as there is at least one subscription to the observable sequence.
   
#### Returns
*(Observable)*: An observable sequence that stays connected to the source as long as there is at least one subscription to the observable sequence.
 
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

#### Location

- rx.binding.js

* * *

### <a id="rxobservableprototypereduceaccumulator-seed"></a>`Rx.Observable.prototype.reduce(accumulator, [seed])`
<a href="#rxobservableprototypereduceaccumulator-seed">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L126-L133 "View in source") 

Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.

For aggregation behavior with incremental intermediate results, see the `scan` method.

#### Arguments
1. `accumulator` *(Function)*:  An accumulator function to be invoked on each element.
2. `[seed]` *(Any)*: The initial accumulator value.
 
#### Returns
*(Observable)*: An observable sequence containing a single element with the final accumulator value.

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

#### Location

- rx.js

* * *

### <a id="rxobservableprototyperepeatrepeatcount"></a>`Rx.Observable.prototype.repeat(repeatCount)`
<a href="#rxobservableprototyperepeatrepeatcount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3893-L3895 "View in source") 

Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.
 
#### Arguments
1. `repeatCount` *(Number)*:  Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.
 
#### Returns
*(Observable)*: The observable sequence producing the elements of the given sequence repeatedly.  

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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypereplayselector-buffersize-window-scheduler"></a>`Rx.Observable.prototype.replay([selector], [bufferSize], [window], [scheduler])`
<a href="#rxobservableprototypereplayselector-buffersize-window-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js#L147-L153 "View in source") 

Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.

This operator is a specialization of `multicast` using a `Rx.ReplaySubject`.

#### Arguments
1. `[selector]` *(Function)*: Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all the notifications of the source subject to the specified replay buffer trimming policy.
2. `[bufferSize]` *(Number)*: Maximum element count of the replay buffer.
3. `[window]` *(Number)*: Maximum time length of the replay buffer in milliseconds.
4. `[scheduler]` *(Scheduler)*: Scheduler where connected observers within the selector function will be invoked on.
 
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

#### Location

- rx.binding.js

* * *

### <a id="rxobservableprototypesharereplay-buffersize-window-scheduler"></a>`Rx.Observable.prototype.shareReplay([bufferSize], [window], [scheduler])`
<a href="#rxobservableprototypesharereplay-buffersize-window-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.binding.js#L147-L153 "View in source") 

Returns an observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.

This operator is a specialization of `replay` that connects to the connectable observable sequence when the number of observers goes from zero to one, and disconnects when there are no more observers.

#### Arguments
1. `[bufferSize]` *(Number)*: Maximum element count of the replay buffer.
2. `[window]` *(Number)*: Maximum time length of the replay buffer in milliseconds.
3. `[scheduler]` *(Scheduler)*: Scheduler where connected observers within the selector function will be invoked on.
 
#### Returns
*(Observable)*: An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.

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
    .returnValue(true)
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

#### Location

- rx.binding.js

* * *

### <a id="rxobservableprototyperetryretrycount"></a>`Rx.Observable.prototype.retry([retryCount])`
<a href="#rxobservableprototyperetryretrycount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3908-L3910 "View in source") 

Projects each element of an observable sequence into a new form by incorporating the element's index.  This is an alias for the `select` method.

#### Arguments
1. `[retryCount]` *(Number)*:  Number of times to retry the sequence. If not provided, retry the sequence indefinitely.
 
#### Returns
*(Observable)*: An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully. 

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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypesampleinterval--sampleobservable"></a>`Rx.Observable.prototype.sample(interval | sampleObservable)`
<a href="#rxobservableprototypesampleinterval--sampleobservable">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3908-L3910 "View in source") 

Samples the observable sequence at each interval.

#### Arguments
1. `[interval]` *(Number)*: Interval at which to sample (specified as an integer denoting milliseconds)
2. `[sampleObservable]` *(Observable)*: Sampler Observable.
3. `[scheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler to run the sampling timer on. If not specified, the timeout scheduler is used.
 
#### Returns
*(Observable)*: Sampled observable sequence.

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

#### Location

- rx.time.js

* * *

### <a id="rxobservableprototypescanseed-accumulator"></a>`Rx.Observable.prototype.scan([seed], accumulator)`
<a href="#rxobservableprototypescanseed-accumulator">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3294-L3946 "View in source") 

Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.

For aggregation behavior with no intermediate results, see `Rx.Observable.aggregate`.

#### Arguments
1. `[seed]` *(Any)*: The initial accumulator value.
2. `accumulator` *(Function)*: An accumulator function to be invoked on each element.
 
#### Returns
*(Observable)*: An observable sequence which results from the comonadic bind operation.

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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypeselectselector-thisarg"></a>`Rx.Observable.prototype.select(selector, [thisArg])`
<a href="#rxobservableprototypeselectselector-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4311-L4326 "View in source") 

Projects each element of an observable sequence into a new form by incorporating the element's index.  This is an alias for the `map` method.

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

### <a id="rxobservableprototypeselectmanyselector-resultselector"></a>`Rx.Observable.prototype.selectMany(selector, [resultSelector])`
<a href="#rxobservableprototypeselectmanyselector-resultselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4311-L4326 "View in source") 

One of the following:

Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.

```js
source.selectMany(function (x) { return Rx.Observable.range(0, x); });
```

Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.

```js
source.selectMany(function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
```

Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
 
 ```js
source.selectMany(Rx.Observable.fromArray([1,2,3]));
 ```

#### Arguments
1. `selector` *(Function)*:  A transform function to apply to each element or an observable sequence to project each element from the source sequence onto.
2. `[resultSelector]` *(Function)*: A transform function to apply to each element of the intermediate sequence.
 
#### Returns
*(Observable)*: An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.   

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
```

#### Location

- rx.js

* * *

### <a id="rxobservableprototypeselectswitchaselector-thisArg"></a>`Rx.Observable.prototype.selectSwitch(selector, [thisArg])`
<a href="#rxobservableprototypeselectswitchaselector-thisArg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4311-L4326 "View in source") 

This is an alias for the `selectSwitch` method.

 Projects each element of an observable sequence into a new sequence of observable sequences by incorporating the element's index and then transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.

#### Arguments
1. `selector` *(Function)*:  A transform function to apply to each source element.  The callback has the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as `this` when executing the predicate.
 
#### Returns
*(Observable)*: An observable sequence whose elements are the result of invoking the transform function on each element of source producing an Observable of Observable sequences and that at any point in time produces the elements of the most recent inner observable sequence that has been received.    

#### Example
```js
var source = Rx.Observable
    .range(1, 2)
    .flatMapLatest(function (x) {
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

#### Location

- rx.js

* * *

## <a id="rxobservableprototypesequenceequalsecond-comparer"></a>`Rx.Observable.prototype.sequenceEqual(second, [comparer])`
<a href="#rxobservableprototypesequenceequalsecond-comparer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4311-L4326 "View in source") 

Determines whether two sequences are equal by comparing the elements pairwise using a specified equality comparer.

#### Arguments
1. `second` *(Observable)*:  Second observable sequence or array to compare.
2. `[comparer]` *(Function)*: Comparer used to compare elements of both sequences.
 
#### Returns
*(Observable)*: An observable sequence that contains a single element which indicates whether both sequences are of equal length and their corresponding elements are equal according to the specified equality comparer.   

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

#### Location

- rx.aggregates.js

* * *

### <a id="rxobservableprototypesinglepredicate-thisarg"></a>`Rx.Observable.prototype.single([predicate], [thisArg])`
<a href="#rxobservableprototypesinglepredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L524-L529 "View in source") 

Returns the only element of an observable sequence that satisfies the condition in the optional predicate, and reports an exception if there is not exactly one element in the observable sequence.
 
#### Arguments
1. `[predicate]` *(Function)*: A predicate function to evaluate for elements in the source sequence. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as `this` when executing the predicate.

#### Returns
*(Observable)*: Sequence containing the single element in the observable sequence that satisfies the condition in the predicate.

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

#### Location

- rx.aggregates.js

* * *

### <a id="rxobservableprototypesingleordefaultpredicate-defaultvalue-thisarg"></a>`Rx.Observable.prototype.singleOrDefault(predicate, [defaultValue], [thisArg])`
<a href="#rxobservableprototypesingleordefaultpredicate-defaultvalue-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L577-L582 "View in source") 

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
    .single(function (x, idx, obs) { return x ===  1; }, 0);

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

### <a id="rxobservableprototypeskipcount"></a>`Rx.Observable.prototype.skip(count)`
<a href="#rxobservableprototypeskipcount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4386-L4401 "View in source") 

Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.

#### Arguments
1. `count` *(Number)*: The number of elements to skip before returning the remaining elements.

#### Returns
*(Observable)*: An observable sequence that contains the elements that occur after the specified index in the input sequence.   

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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypeskiplastcount"></a>`Rx.Observable.prototype.skipLast(count)`
<a href="#rxobservableprototypeskiplastcount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3958-L3969 "View in source") 

Bypasses a specified number of elements at the end of an observable sequence.

This operator accumulates a queue with a length enough to store the first `count` elements. As more elements are received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed. 

#### Arguments
1. `count` *(Number)*: Number of elements to bypass at the end of the source sequence.

#### Returns
*(Observable)*: An observable sequence containing the source sequence elements except for the bypassed ones at the end.   
  
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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypeskiplastwithtimeduration"></a>`Rx.Observable.prototype.skipLastWithTime(duration)`
<a href="#rxobservableprototypeskiplastwithtimeduration">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L1035-L1054 "View in source") 

Bypasses a specified number of elements at the end of an observable sequence.

This operator accumulates a queue with a length enough to store the first `count` elements. As more elements are received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed. 

#### Arguments
1. `duration` *(Number)*: Duration for skipping elements from the end of the sequence.
1. `[scheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler to run the timer on. If not specified, defaults to timeout scheduler.

#### Returns
*(Observable)*: An observable sequence with the elements skipped during the specified duration from the end of the source sequence.
 
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

#### Location

- rx.time.js

* * *

### <a id="rxobservableprototypeskipuntilother"></a>`Rx.Observable.prototype.skipUntil(other)`
<a href="#rxobservableprototypeskipuntilother">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3429-L3454 "View in source") 

Returns the values from the source observable sequence only after the other observable sequence produces a value.

#### Arguments
1. `other` *(Observable)*: The observable sequence that triggers propagation of elements of the source sequence.

#### Returns
*(Observable)*: An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.    

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

// => Next: 6
// => Next: 7
// => Next: 8
// => Completed 
```

#### Location

- rx.js

* * *

### <a id="rxobservableprototypeskipwhilepredicate-thisarg"></a>`Rx.Observable.prototype.skipWhile([predicate], [thisArg])`
<a href="#rxobservableprototypeskipwhilepredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4414-L4432 "View in source") 

Bypasses elements in an observable sequence as long as a specified condition is true and then returns the remaining elements.

#### Arguments
1. `predicate` *(Function)*: A function to test each source element for a condition. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as this when executing callback.

#### Returns
*(Observable)*: An observable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.   
 
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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypesomepredicate-thisarg"></a>`Rx.Observable.prototype.some([predicate], [thisArg])`
<a href="#rxobservableprototypesomepredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L144-L157 "View in source") 

Determines whether any element of an observable sequence satisfies a condition if present, else if any items are in the sequence.  There is an alias to this method called `any`.

#### Arguments
1. `predicate` *(Function)*: A function to test each source element for a condition. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as this when executing callback.

#### Returns
*(Observable)*: An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate. 

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

#### Location

- rx.aggregates.js

* * *

### <a id="rxobservableprototypestartwithscheduler-args"></a>`Rx.Observable.prototype.startWith([scheduler] ...args)`
<a href="#rxobservableprototypestartwithscheduler-args">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3980-L3990 "View in source") 

Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.

#### Arguments
1. `[scheduler]` *(Scheduler)*: Scheduler to execute the function.
2. `args` *(arguments)*: Values to prepend to the observable sequence.

#### Returns
*(Observable)*: The source sequence prepended with the specified values.

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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypesubscribeobserver--onnext-onerror-oncompleted"></a>`Rx.Observable.prototype.subscribe([observer] | [onNext], [onError], [onCompleted])`
<a href="#rxobservableprototypesubscribeobserver--onnext-onerror-oncompleted">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2593-L2602 "View in source") 

Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.

#### Arguments
1. `[observer]` *(Observer)*: The object that is to receive notifications.
1. `[onNext]` *(Function)*: Function to invoke for each element in the observable sequence.
2. `[onError]` *(Function)*: Function to invoke upon exceptional termination of the observable sequence.
3. `[onCompleted]` *(Function)*: Function to invoke upon graceful termination of the observable sequence.

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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypesubscribeonscheduler"></a>`Rx.Observable.prototype.subscribeOn(scheduler)`
<a href="#rxobservableprototypesubscribeonscheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2700-L2710 "View in source") 

Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler.

This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer callbacks on a scheduler, use `observeOn`.

#### Arguments
1. `scheduler` *(Scheduler)*:  Scheduler to notify observers on.

#### Returns
*(Observable)*: The source sequence whose observations happen on the specified scheduler. 
 
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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypesumkeyselector-thisarg"></a>`Rx.Observable.prototype.sum([keySelector], [thisArg])`
<a href="#rxobservableprototypesumkeyselector-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.aggregates.js#L231-L237 "View in source") 

Computes the sum of a sequence of values that are obtained by invoking an optional transform function on each element of the input sequence, else if not specified computes the sum on each item in the sequence.

#### Arguments
1. `[keySelector]` *(Scheduler)*:  A transform function to apply to each element.  The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed

#### Returns
*(Observable)*: An observable sequence containing a single element with the sum of the values in the source sequence.
 
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

#### Location

- rx.aggregates.js

* * *

### <a id="rxobservableprototypeswitch"></a>`Rx.Observable.prototype.switch()`
<a href="#rxobservableprototypeswitch">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3462-L3497 "View in source") 

Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.  There is an alias for this method called `switchLatest` for browsers <IE9.
  
#### Returns
*(Observable)*: The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.  
 
#### Example
```js
var source = Rx.Observable.range(0, 3)
    .select(function (x) { return Rx.Observable.range(x, 3); })
    .switchLatest();

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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypetakecount-scheduler"></a>`Rx.Observable.prototype.take(count, [scheduler])`
<a href="#rxobservableprototypetakecount-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4446-L4466 "View in source") 

Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of `take(0)`.
  
#### Arguments
1. `count` *(Number)*: The number of elements to return.
2. `[schduler]` *(Scheduler)*: Scheduler used to produce an onCompleted message in case `count` is set to 0.

#### Returns
*(Observable)*: An observable sequence that contains the elements that occur after the specified index in the input sequence.   

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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypetakelastcount"></a>`Rx.Observable.prototype.takeLast(count)`
<a href="#rxobservableprototypetakelastcount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4008-L4010 "View in source") 

Returns a specified number of contiguous elements from the end of an observable sequence, using an optional scheduler to drain the queue.
  
This operator accumulates a buffer with a length enough to store elements count elements. Upon completion of the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.

#### Arguments
1. `count` *(Number)*: Number of elements to bypass at the end of the source sequence.

#### Returns
*(Observable)*: An observable sequence containing the source sequence elements except for the bypassed ones at the end.   
  
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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypetakelastbuffercount"></a>`Rx.Observable.prototype.takeLastBuffer(count)`
<a href="#rxobservableprototypetakelastbuffercount">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4023-L4037 "View in source") 

Returns an array with the specified number of contiguous elements from the end of an observable sequence.

#### Arguments
1. `count` *(Number)*: Number of elements to bypass at the end of the source sequence.

#### Returns
*(Observable)*: An observable sequence containing a single array with the specified number of elements from the end of the source sequence.
     
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

// => Next: [2, 3, 4]
// => Completed 
```

#### Location

- rx.js

* * *

### <a id="rxobservableprototypetakelastbufferwithtimeduration-scheduler"></a>`Rx.Observable.prototype.takeLastBufferWithTime(duration, [scheduler])`
<a href="#rxobservableprototypetakelastbufferwithtimeduration-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L1089-L1114 "View in source") 

Returns an array with the elements within the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.

This operator accumulates a queue with a length enough to store elements received during the initial duration window. As more elements are received, elements older than the specified duration are taken from the queue and produced on the result sequence. This causes elements to be delayed with duration.  
 
#### Arguments
1. `duration` *(Number)*: Duration for taking elements from the end of the sequence.
2. `[scheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler to run the timer on. If not specified, defaults to timeout scheduler.

#### Returns
*(Observable)*: An observable sequence containing a single array with the elements taken during the specified duration from the end of the source sequence.
 
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

// => Next: 5,6,7,8,9]
// => Completed 
```

#### Location

- rx.js

* * *

### <a id="rxobservableprototypetakelastwithtimeduration-timescheduler-loopscheduler"></a>`Rx.Observable.prototype.takeLastWithTime(duration, [timeScheduler], [loopScheduler])`
<a href="#rxobservableprototypetakelastwithtimeduration-timescheduler-loopscheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L1071-L1073 "View in source") 

Returns elements within the specified duration from the end of the observable source sequence, using the specified schedulers to run timers and to drain the collected elements.

#### Arguments
1. `duration` *(Number)*: Duration for taking elements from the end of the sequence.
2. `[timeScheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler to run the timer on. If not specified, defaults to timeout scheduler.
2. `[loopScheduler=Rx.Scheduler.currentThread]` *(Scheduler)*: Scheduler to drain the collected elements. If not specified, defaults to current thread scheduler.

#### Returns
*(Observable)*: An observable sequence with the elements taken during the specified duration from the end of the source sequence.
    
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

#### Location

- rx.time.js

* * *

### <a id="rxobservableprototypetakeuntilother"></a>`Rx.Observable.prototype.takeUntil(other)`
<a href="#rxobservableprototypetakeuntilother">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L3506-L3514 "View in source") 

Returns the values from the source observable sequence until the other observable sequence produces a value.

#### Arguments
1. `other` *(Observable)*: Observable sequence that terminates propagation of elements of the source sequence.

#### Returns
*(Observable)*: An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.    

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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypetakewhilepredicate-thisarg"></a>`Rx.Observable.prototype.takeWhile(predicate, [thisArg])`
<a href="#rxobservableprototypetakewhilepredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4481-L4501 "View in source") 

Returns elements from an observable sequence as long as a specified condition is true.

#### Arguments
1. `predicate` *(Function)*: A function to test each source element for a condition. The callback is called with the following information:
    1. the value of the element
    2. the index of the element
    3. the Observable object being subscribed
2. `[thisArg]` *(Any)*: Object to use as this when executing callback.

#### Returns
*(Observable)*: An observable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.  
    
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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypethrottleduetime-scheduler"></a>`Rx.Observable.prototype.throttle(dueTime, [scheduler])`
<a href="#rxobservableprototypethrottleduetime-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4481-L4501 "View in source") 

Ignores values from an observable sequence which are followed by another value before dueTime.

#### Arguments
1. `dueTime` *(Number)*: Duration of the throttle period for each value (specified as an integer denoting milliseconds).
2. `[scheduler=Rx.Scheduler.timeout]` *(Any)*: Scheduler to run the throttle timers on. If not specified, the timeout scheduler is used.

#### Returns
*(Observable)*: The throttled sequence. 
    
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

#### Location

- rx.time.js

* * *

### <a id="rxobservableprototypethrottlewithselectorthrottleselector"></a>`Rx.Observable.prototype.throttleWithSelector(throttleSelector)`
<a href="#rxobservableprototypethrottlewithselectorthrottleselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L973-L1018 "View in source") 

Ignores values from an observable sequence which are followed by another value before dueTime.

#### Arguments
1. `dueTime` *(Number)*: Selector function to retrieve a sequence indicating the throttle duration for each given element.

#### Returns
*(Observable)*: The throttled sequence. 
    
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

#### Location

- rx.time.js

* * *

### <a id="rxobservableprototypetimeintervalscheduler"></a>`Rx.Observable.prototype.timeInterval([scheduler])`
<a href="#rxobservableprototypetimeintervalscheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L531-L545 "View in source") 

Records the time interval between consecutive values in an observable sequence.

#### Arguments
1. `[scheduler=Rx.Observable.timeout]` *(Scheduler)*: Scheduler used to compute time intervals. If not specified, the timeout scheduler is used.

#### Returns
*(Observable)*: An observable sequence with time interval information on values.

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

#### Location

- rx.time.js

* * *

### <a id="rxobservableprototypetimeoutduetime-other-scheduler"></a>`Rx.Observable.prototype.timeout(dueTime, [other], [scheduler])`
<a href="#rxobservableprototypetimeoutduetime-other-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L633-L687 "View in source") 

Returns the source observable sequence or the other observable sequence if dueTime elapses.

#### Arguments
1. `dueTime` *(Date | Number)*: Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) when a timeout occurs.
2. `[other]` *(Observable)*: Sequence to return in case of a timeout. If not specified, a timeout error throwing sequence will be used.
3. `[scheduler=Rx.Observable.timeout]` *(Scheduler)*: Scheduler to run the timeout timers on. If not specified, the timeout scheduler is used.

#### Returns
*(Observable)*: An observable sequence with time interval information on values.

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

#### Location

- rx.time.js

* * *

### <a id="rxobservableprototypetimeoutwithselectorfirsttimeout-timeoutdurationselector-other"></a>`Rx.Observable.prototype.timeoutwithselector([firstTimeout], timeoutDurationSelector, [other])`
<a href="#rxobservableprototypetimeoutwithselectorfirsttimeout-timeoutdurationselector-other">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L633-L687 "View in source") 

Returns the source observable sequence, switching to the other observable sequence if a timeout is signaled.

#### Arguments
1. `[firstTimeout=Rx.Observable.never()]` *(Observable)*: Observable sequence that represents the timeout for the first element. If not provided, this defaults to `Rx.Observable.never()`.
2. `timeoutDurationSelector` *(Function)*: Selector to retrieve an observable sequence that represents the timeout between the current element and the next element.
3. `[other=Rx.Observable.throw]` *(Scheduler)*:Sequence to return in case of a timeout. If not provided, this is set to `Observable.throw`

#### Returns
*(Observable)*: The source sequence switching to the other sequence in case of a timeout.

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

#### Location

- rx.time.js

* * *

### <a id="rxobservableprototypetimestampscheduler"></a>`Rx.Observable.prototype.timestamp([scheduler])`
<a href="#rxobservableprototypetimestampscheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L559-L567 "View in source") 

Records the timestamp for each value in an observable sequence.

#### Arguments
1. `[scheduler=Rx.Observable.timeout]` *(Scheduler)*: Scheduler used to compute timestamps. If not specified, the timeout scheduler is used.

#### Returns
*(Observable)*: An observable sequence with timestamp information on values.

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

#### Location

- rx.time.js

* * *

### <a id="rxobservableprototypetoarray"></a>`Rx.Observable.prototype.toArray()`
<a href="#rxobservableprototypetoarray">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L2610-L2617 "View in source") 

Creates a list from an observable sequence.

#### Returns
*(Observable)*: An observable sequence containing a single element with a list containing all the elements of the source sequence.  

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

#### Location

- rx.js

* * *

### <a id="rxobservableprototypewherepredicate-thisarg"></a>`Rx.Observable.prototype.where(predicate, [thisArg])`
<a href="#rxobservableprototypewherepredicate-thisarg">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4513-L4530 "View in source") 

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

### <a id="rxobservableprototypewindowwindowopenings-windowboundaries-windowclosingselector"></a>`Rx.Observable.prototype.window([windowOpenings], [windowBoundaries], windowClosingSelector)`
<a href="#rxobservableprototypewindowwindowopenings-windowboundaries-windowclosingselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.coincidence.js#L4513-L4530 "View in source") 

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
1. `[windowOpenings]` *(Observable)*: Observable sequence whose elements denote the creation of new windows 
2.`[windowBoundaries]` *(Observable)*: Sequence of window boundary markers. The current window is closed and a new window is opened upon receiving a boundary marker. 
3. `windowClosingSelector` *(Function)*: A function invoked to define the closing of each produced window.

#### Returns
*(Observable)*: An observable sequence of windows.

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

#### Location

File:
- /src/core/observable/window.js

Requirements
- rx.js | rx.compat.js

Dist:
- rx.coincidence.js

* * *

### <a id="rxobservableprototypewindowwithcountcount-skip"></a>`Rx.Observable.prototype.windowWithCount(count, [skip])`
<a href="#rxobservableprototypewindowwithcountcount-skip">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4050-L4099 "View in source") 

Projects each element of an observable sequence into zero or more windows which are produced based on element count information.

#### Arguments
1. `count` *(Function)*: Length of each buffer.
2. `[skip]` *(Function)*: Number of elements to skip between creation of consecutive windows. If not provided, defaults to the count.

#### Returns
*(Observable)*: An observable sequence of windows. 

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
#### Location

File:
- /src/core/observable/windowwithcount.js

Requirements
- rx.js | rx.compat.js

Dist:
- rx.time.js

* * *

### <a id="rxobservableprototypewindowwithtimetimespan-timeshift--scheduler"></a>`Rx.Observable.prototype.windowWithTime(timeSpan, [timeShift | scheduler])`
<a href="#rxobservableprototypewindowwithtimetimespan-timeshift--scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L311-L399 "View in source") 

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
#### Location

File:
- /src/core/observable/windowwithtime.js

Requirements
- rx.js | rx.compat.js

Dist:
- rx.time.js


* * *

### <a id="rxobservableprototypewindowwithtimeorcounttimespan-count-scheduler"></a>`Rx.Observable.prototype.windowWithTimeOrCount(timeSpan, count, [scheduler])`
<a href="#rxobservableprototypewindowwithtimeorcounttimespan-count-scheduler">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.time.js#L413-L469 "View in source") 

Projects each element of an observable sequence into a window that is completed when either it's full or a given amount of time has elapsed.

#### Arguments
1. `timeSpan` *(Number)*: Maximum time length of a window.
2. `count` *(Number)*: Maximum element count of a window.
3. `[scheduler=Rx.Scheduler.timeout]` *(Scheduler)*: Scheduler to run windows timers on. If not specified, the timeout scheduler is used.

#### Returns
*(Observable)*: An observable sequence of windows. 

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
#### Location

File:
- /src/core/observable/windowwithtimeorcount.js

Requirements
- rx.js | rx.compat.js

Dist:
- rx.time.js

* * *

### <a id="rxobservableprototypezipargs-resultselector"></a>`Rx.Observable.prototype.zip(...args, [resultSelector])`
<a href="#rxobservableprototypezipargs-resultselector">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/rx.js#L4513-L4530 "View in source") 

Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.

The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the sources.

#### Arguments
1. `args` *(Arguments | Array)*: Arguments or an array of observable sequences.
2. `[resultSelector]` *(Any)*: Function to invoke for each series of elements at corresponding indexes in the sources, used only if the first parameter is not an array.

#### Returns
*(Observable)*: An observable sequence containing the result of combining elements of the sources using the specified result selector function. 

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

#### Location

File:
- /src/core/observable/zipproto.js

Requirements
- none

Dist:
- rx.js
- rx.compat.js

* * *
