# Querying Observable Sequences #

In [Bridging to Events](events.md), we have converted existing DOM and Node.js events into observable sequences to subscribe to them. In this topic, we will look at the first-class nature of observable sequences as IObservable<T> objects, in which generic LINQ operators are supplied by the Rx assemblies to manipulate these objects. Most operators take an observable sequence and perform some logic on it and output another observable sequence. In addition, as you can see from our code samples, you can even chain multiple operators on a source sequence to tweak the resulting sequence to your exact requirement.

## Using Different Operators ##

We have already used the [`create`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablecreatesubscribe) and [`range`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablerangestart-count-scheduler) operators in previous topics to create and return simple sequences. We have also used the [`fromEvent`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefromeventelement-eventname) and [`fromEventPattern`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefromeventpatternaddhandler-removehandler) operators to convert existing  events into observable sequences. In this topic, we will use other operators of the `Observable` type so that you can filter, group and transform data. Such operators take observable sequence(s) as input, and produce observable sequence(s) as output.

## Combining different sequences ##

In this section, we will examine some of the operators that combine various observable sequences into a single observable sequence. Notice that data are not transformed when we combine sequences.
In the following sample, we use the Concat operator to combine two sequences into a single sequence and subscribe to it. For illustration purpose, we will use the very simple `range(x, y)` operator to create a sequence of integers that starts with x and produces y sequential numbers afterwards.

```js
var source1 = Rx.Observable.range(1, 3);
var source2 = Rx.Observable.range(1, 3);

source1.concat(source2)
   .subscribe(function (x) { console.log(x); });

// => 1
// => 2
// => 3
// => 1
// => 2
// => 3
```

Notice that the resultant sequence is 1,2,3,1,2,3. This is because when you use the [`concat`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeconcatargs) operator, the 2nd sequence (source2) will not be active until after the 1st sequence (source1) has finished pushing all its values. It is only after source1 has completed, then source2 will start to push values to the resultant sequence. The subscriber will then get all the values from the resultant sequence.

Compare this with the [`merge`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypemergemaxconcurrent--other) operator. If you run the following sample code, you will get 1,1,2,2,3,3. This is because the two sequences are active at the same time and values are pushed out as they occur in the sources. The resultant sequence only completes when the last source sequence has finished pushing values.

```js
var source1 = Rx.Observable.range(1, 3);
var source2 = Rx.Observable.range(1, 3);

source1.merge(source2)
   .subscribe(function (x) { console.log(x); });

// => 1
// => 1
// => 2
// => 2
// => 3
// => 3
```

Another comparison can be done with the [`catch`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypecatchsecond--handler) operator. In this case, if source1 completes without any error, then source2 will not start. Therefore, if you run the following sample code, you will get 1,2,3 only since source2 (which produces 4,5,6) is ignored.

```js
var source1 = Rx.Observable.range(1, 3);
var source2 = Rx.Observable.range(4, 3);

source1.catch(source2)
   .subscribe(function (x) { console.log(x); });

// => 1
// => 2
// => 3
```

Finally, let’s look at [`onErrorResumeNext`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeonerrorresumenextsecond). This operator will move on to source2 even if source1 cannot be completed due to an error. In the following example, even though source1 represents a sequence that terminates with an exception by using the [`throw`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablethrowexception-scheduler) operator, the subscriber will receive values (1,2,3) published by source2. Therefore, if you expect either source sequence to produce any error, it is a safer bet to use [`onErrorResumeNext`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeonerrorresumenextsecond) to guarantee that the subscriber will still receive some values.

```js
var source1 = Rx.Observable.throw(new Error('An error has occurred.'));
var source2 = Rx.Observable.range(1, 3);

source1.onErrorResumeNext(source2)
   .subscribe(function (x) { console.log(x); });

// => 1
// => 2
// => 3
```

## Projection ##

The [`select`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeselectselector-thisarg) or [`map`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypemapselector-thisarg) operator can translate each element of an observable sequence into another form.

In the following example, we project a sequence of strings into an a series of integers representing the length.

```js
var array = ['Reactive', 'Extensions', 'RxJS'];

var seqString = Rx.Observable.from(array);

var seqNum = seqString.map(function (x) { return x.length; });

seqNum
   .subscribe(function (x) { console.log(x); });

// => 8
// => 10
// => 4
```

In the following sample, which is an extension of the event conversion example we saw in the [Bridging with Existing Events](events.md) topic, we use the `select` or `map` operator to project the event arguments to a point of x and y. In this way, we are transforming a mouse move event sequence into a data type that can be parsed and manipulated further, as can be seen in the next "Filtering" section.

```js
var move = Rx.Observable.fromEvent(document, 'mousemove');

var points = move.map(function (e) {
	return { x: e.clientX, y: e.clientY };
});

points.subscribe(
	function (pos) {
		console.log('Mouse at point ' + pos.x + ', ' + pos.y);
	});
```

Finally, let’s look at the [`selectMany`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeselectmanyselector-resultselector) or [`flatMap`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeflatmapselector-resultselector) operator. The `selectMany` or `flatMap` operator has many overloads, one of which takes a selector function argument. This selector function is invoked on every value pushed out by the source observable. For each of these values, the selector projects it into a mini observable sequence. At the end, the `selectMany` or `flatMap` operator flattens all of these mini sequences into a single resultant sequence, which is then pushed to the subscriber.

The observable returned from `selectMany` or `flatMap` publishes `onCompleted` after the source sequence and all mini observable sequences produced by the selector have completed. It fires `onError` when an error has occurred in the source stream, when an exception was thrown by the selector function, or when an error occurred in any of the mini observable sequences.

In the following example, we first create a source sequence which produces an integer every 5 seconds, and decide to just take the first 2 values produced (by using the `take` operator). We then use `selectMany` or `flatMap` to project each of these integers using another sequence of {100, 101, 102}. By doing so, two mini observable sequences are produced, {100, 101, 102} and {100, 101, 102}. These are finally flattened into a single stream of integers of {100, 101, 102, 100, 101, 102} and pushed to the observer.

```js
var source1 = Rx.Observable.interval(5000).take(2);
var proj = Rx.Observable.range(100, 3);
var resultSeq = source1.flatMap(proj);

var subscription = resultSeq.subscribe(
	function (x) { console.log('onNext: ' + x); },
	function (e) { console.log('onError: ' + e.message); },
	function () { console.log('onCompleted'); });

// => onNext: 100
// => onNext: 101
// => onNext: 102
// => onNext: 100
// => onNext: 101
// => onNext: 102
// => onCompleted
```

## Filtering ##

In the following example, we use the [`generate`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablegenerateinitialstate-condition-iterate-resultselector-scheduler) operator to create a simple observable sequence of numbers. The `generate` operator has several versions including with relative and absolute time scheduling. In our example, it takes an initial state (0 in our example), a conditional function to terminate (fewer than 10 times), an iterator (+1), a result selector (a square function of the current value), and prints out only those smaller than 5 using the [`filter`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypefilterpredicate-thisarg) or [`where`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypewherepredicate-thisarg) operators.

```js
var seq = Rx.Observable.generate(
	0,
	function (i) { return i < 10; },
	function (i) { return i + 1; },
	function (i) { return i * i; });

var source = seq.filter(function (n) { return n < 5; });

var subscription = source.subscribe(
	function (x) { console.log('onNext: ' + x); },
	function (e) { console.log('onError: ' + e.message); },
	function () { console.log('onCompleted'); });

// => onNext: 0
// => onNext: 1
// => onNext: 4
// => onCompleted
```

The following example is an extension of the projection example you have seen earlier in this topic. In that sample, we have used the `select` or `map` operator to project the event arguments into a point with x and y. In the following example, we use the `filter` or `where` and `select` or `map` operator to pick only those mouse movement that we are interested. In this case, we filter the mouse moves to those over the first bisector (where the x and y coordinates are equal).

```js
var move = Rx.Observable.fromEvent(document, 'mousemove');

var points = move.map(function (e) {
	return { x: e.clientX, y: e.clientY };
});

var overfirstbisector = points.filter(function (pos) {
	return pos.x === pos.y;
});

var movesub = overfirstbisector.subscribe(function (pos) { console.log('mouse at ' + pos.x + ', ' pos.y); });
```

## Time-based Operation ##

You can use the Buffer operators to perform time-based operations.

Buffering an observable sequence means that an observable sequence’s values are put into a buffer based on either a specified timespan or by a count threshold. This is especially helpful in situations when you expect a tremendous amount of data to be pushed out by the sequence, and the subscriber does not have the resource to process these values. By buffering the results based on time or count, and only returning a sequence of values when the criteria is exceeded (or when the source sequence has completed), the subscriber can process OnNext calls at its own pace.

In the following example, we first create a simple sequence of integers for every second. We then use the `bufferWithCount` operator and specify that each buffer will hold 5 items from the sequence. The `onNext` is called when the buffer is full. We then tally the sum of the buffer using calling `Array.reduce`. The buffer is automatically flushed and another cycle begins. The printout will be 10, 35, 60… in which 10=0+1+2+3+4, 35=5+6+7+8+9, and so on.

```js
var seq = Rx.Observable.interval(1000);

var bufSeq = seq.bufferWithCount(5);

bufSeq
	.map(function (arr) { return arr.reduce(function (acc, x) { return acc + x; }, 0); })
	.subscribe(function (sum) { console.log(sum); });

// => 10
// => 35
// => 60
...
```

We can also create a buffer with a specified time span in milliseconds. In the following example, the buffer will hold items that have accumulated for 3 seconds. The printout will be 3, 12, 21… in which 3=0+1+2, 12=3+4+5, and so on.

```js
var seq = Rx.Observable.interval(1000);

var bufSeq = seq.bufferWithTime(3000);

bufSeq
	.map(function (arr) { return arr.reduce(function (acc, x) { return acc + x; }, 0); })
	.subscribe(function (sum) { console.log(sum); });
```

Note that if you are using any of the `buffer*` or `window*` operators, you have to make sure that the sequence is not empty before filtering on it.

## Operators by Categories ##

The [Operators by Categories](operators.md) topic lists of all major operators implemented by the `Observable` type by their categories; specifically: creation, conversion, combine, functional, mathematical, time, exceptions, miscellaneous, selection and primitives.

## See Also ##

*Reference*
 - [Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)

*Concepts*
- [Operators by Categories](operators.md)
