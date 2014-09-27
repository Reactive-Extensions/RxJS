# Bridging to Events #

RxJS provides factory methods for you to bridge with existing asynchronous sources in the DOM or Node.js so that you can employ the rich composing, filtering and resource management features provided by RxJS on any kind of data streams. This topic examines the [`fromEvent`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefromeventelement-eventname) and [`fromEventPattern`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefromeventpatternaddhander-removehandler) operator that allows "importing" a DOM or custom event into RxJS as an observable sequence. Every time an event is raised, an `onNext` message will be delivered to the observable sequence. You can then manipulate event data just like any other observable sequences.

RxJS does not aim at replacing existing asynchronous programming models such as promises or callbacks. However, when you attempt to compose events, RxJS’s factory methods will provide you the convenience that cannot be found in the current programming model. This is especially true for resource maintenance (e.g., when to unsubscribe) and filtering (e.g., choosing what kind of data to receive). In this topic and the ones that follow, you can examine how these RxJS features can assist you in asynchronous programming.

## Converting a DOM event to a RxJS Observable Sequence ##

The following sample creates a simple DOM event handler for the mouse move event, and prints out the mouse’s location on the page.

```js
var result = document.getElementById('result');

document.addEventListener('mousemove', function (e) {
	result.innerHTML = e.clientX + ', ' + e.clientY;
}, false);
```

To import an event into RxJS, you can use the [`fromEvent`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefromeventelement-eventname) operator, and provide the event arguments that will be raised by the event being bridged. It then converts the given event into an observable sequence.

In the following example, we convert the mousemove event stream of the DOM into an observable sequence. Every time a mouse-move event is fired, the subscriber will receive an `onNext` notification. We can then examine the event arguments value of such notification and get the location of the mouse-move.

```js
var result = document.getElementById('result');

var source = Rx.Observable.fromEvent(document, 'mousemove');

var subscription = source.subscribe(function (e) {
	result.innerHTML = e.clientX + ', ' + e.clientY;
});
```

Notice that in this sample, move becomes an observable sequence in which we can manipulate further. The [Querying Observable Sequences](querying.md) topic will show you how you can project this sequence into a collection of Points type and filter its content, so that your application will only receive values that satisfy a certain criteria.

Cleaning up of the event handler is taken care of by the `Disposable` object returned by the `subscribe` method. Calling `dispose` will release all resources being used by the sequence including the underlying event handler. This essentially takes care of unsubscribing to an event on your behalf.

The `fromEvent` method also supports adding event handlers to multiple items, for example a DOM NodeList.  This example will add the 'click' to each element in the list.

```
var result = document.getElementById('result');
var sources = document.querySelectorAll('div');

var source = Rx.Observable.fromEvent(sources, 'click');

var subscription = source.subscribe(function (e) {
	result.innerHTML = e.clientX + ', ' + e.clientY;
});
```

In addition, `fromEvent` also supports libraries such as [jQuery](http://jquery.com/):

```
var $result = $('#result');
var $sources = $('div');

var source = Rx.Observable.fromEvent($sources, 'click');

var subscription = source.subscribe(function (e) {
	$result.html(e.clientX + ', ' + e.clientY);
});
```

## Converting a Node.js event to a RxJS Observable Sequence ##

Node.js is also supported such as an [`EventEmitter`](http://nodejs.org/api/events.html#events_class_events_eventemitter):

```js
var Rx = require('rx'),
	EventEmitter = require('events').EventEmitter;

var eventEmitter = new EventEmitter();

var source = Rx.Observable.fromEvent(eventEmitter, 'data')

var subscription = source.subscribe(function (data) {
	console.log('data: ' + data);
});

eventEmitter.emit('data', 'foo');
// => data: foo
```

## Bridging to Custom Events with FromEventPattern ##

There may be instances dealing with libraries which have different ways of subscribing and unsubscribing from events.  The [`fromEventPattern`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefromeventpatternaddhander-removehandler) method was created exactly for this purpose to allow you to bridge to each of these custom event emitters.

For example, you might want to bridge to using jQuery [`on`](http://api.jquery.com/on/) method.  We can convert the following code which alerts based upon the click of a table row.

```js
$( "#dataTable tbody" ).on('click', 'tr', function() {
  alert( $( this ).text() );
});
```

The converted code looks like this while using the `fromEventPattern` method.  Each function passes in the handler function which allows you to call the `on` and `off` methods to properly handle disposal of events.

```js
var $tbody = $('#dataTable tbody');

var source = Rx.Observable.fromEventPattern(
	function addHandler (h) { $tbody.on('click', 'tr', h); },
	function delHandler (h) { $tbody.off('click', 'tr', h); });

var subscription = source.subscribe(function (e) {
	alert( $(e.target).text() );
});
```

In addition to this normal support, we also support if the `addHandler` returns an object, it can be passed to the `removeHandler` to properly unsubscribe.  In this example, we'll use the [Dojo Toolkit](http://dojotoolkit.org) and the [`on`](http://dojotoolkit.org/api/1.9/dojo/on.html) module.

```js
require(['dojo/on', 'dojo/dom', 'rx', 'rx.async', 'rx.binding'], function (on, dom, rx) {

    var input = dom.byId('input');

    var source = Rx.Observable.fromEventPattern(
        function addHandler (h) {
            return on(input, 'click', h);
        },
        function delHandler (_, signal) {
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

## See Also

Concepts
- [Querying Observable Sequences](querying.md)
