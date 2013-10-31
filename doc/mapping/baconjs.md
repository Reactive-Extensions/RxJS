# RxJS for Bacon.js Users #

[Bacon.js](https://github.com/baconjs/bacon.js) is a popular Functional Reactive Programming (FRP) library which was inspired by RxJS, ReactiveBanana among other libraries.  If you're not familiar with FRP, Conal Elliott summed it up nicely on [StackOverflow](http://stackoverflow.com/questions/1028250/what-is-functional-reactive-programming/1030631#1030631) so no need to repeat that here.

Bacon.js has two main concepts, Event Streams and Properties, which we will map to RxJS concepts.

### Contents ###
- [Event Streams](#eventstreams)

### Common API Methods ###

## Event Streams ##

In Bacon.js (and RxJS for that matter), an EventStream represents a stream of events. It is an Observable object, meaning that you can listen to events in the stream using, for instance, the onValue method with a callback.  

### Creating Event Streams ### 

#### Bacon.js ####

Because Bacon.js is optimized for jQuery and Zepto, you can use the `$.fn.asEventStream` method to easily bind to create event streams. 

For example we can get the clickable element, listen to the `click` event, and then we can subscribe via the `onValue` method to capture the clicks.

```js
var clickable = $('#clickable').asEventStream('click');

clickable.onValue(function (e) {
	console.log('clicked!');
});
```

The support goes above just standard support, but also selectors and an optional argument selector which transforms the arguments of the event to a single object.

```js
$("#my-div").asEventStream("click", ".more-specific-selector")

$("#my-div").asEventStream("click", ".more-specific-selector", function(event, args) { 
	return args[0]; 
});

$("#my-div").asEventStream("click", function (event, args) { 
	return args[0] 
});
```

#### RxJS ####

It's very similar in RxJS core.  Until recently, this feature was reserved for external libraries such as [RxJS-jQuery](https://github.com/Reactive-Extensions/RxJS-jQuery), [RxJS-DOM](https://github.com/Reactive-Extensions/RxJS-DOM), [RxJS-Dojo](https://github.com/Reactive-Extensions/RxJS-Dojo) and [RxJS-MooTools](https://github.com/Reactive-Extensions/RxJS-MooTools).  RxJS 2.2 introduced two ways to bind to events with `fromEvent` and `fromEventPattern` so that bridge libraries are strictly not as necessary as they used to be.  

For example, we can recreate the binding to the clickable element for the `click` event, and then call `subscribe` with a function which listens for each time the clickable is clicked.

```js
var clickable = $('#clickable');

var clickableObservable = Rx.Observable.fromEvent(clickable, 'click')
	.subscribe(function () { console.log('clicked!'); });
```

In addition, RxJS also supports for event argument transformers for additional data.  For example, if a Node.js `EventEmitter` emits more than one piece of data at a time, you can still capture it.

```js
var Rx = require('rx'),
	EventEmitter = require('events').EventEmitter;

var e = new EventEmitter();

Rx.Observable.fromEvent(e, 'data', 
	function (args) {
		return { first: args[0], second: args[1] };
	})
	.subscribe(function (data) {
		console.log(data.first + ',' + data.second);
	});

e.emit('data', 'foo', 'bar');
// => foo,bar
```

### Querying Streams ###

Event Streams support higher ordered functions much as RxJS does such as `map`, `filter` and more, although supports a more Underscore/Lo-Dash style than the callback selector style found in RxJS.

```js
var plus = $("#plus").asEventStream("click").map(1);
var minus = $("#minus").asEventStream("click").map(-1);

// Combine both into one
var both = plus.merge(minus);

both.onValue (function (x) { /* returns 1 or -1 */ });
```