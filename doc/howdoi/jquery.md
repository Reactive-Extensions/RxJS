# How do I work with jQuery and RxJS #

The [jQuery](http://jquery.com) project and RxJS play very well together as libraries.  In fact, we supply bindings directly for RxJS to jQuery should you want to wrap animations, events, Ajax calls and more using Observables in [RxJS-jQuery](https://github.com/Reactive-Extensions/RxJS-jQuery).  The bindings library provides many handy features for bridging the world to Observables.  If you're interested in that library, go ahead and use it.  

## Using RxJS with Rx-jQuery ##

Getting started with the bindings is easy.  Each method is enumerated on the main page from the jQuery method to its RxJS counterpart.

	<div id="results"></div>
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="rx.js"></script>
	<script src="rx.binding.js"></script>
	<script src="rx.jquery.js"></script>

Now we can start using the bindings!  For example, we can listen to a `click` event and then by using `flatMap` or `selectMap` we can animate by calling `animateAsObservable`.  Finally, we can subscribe to cause the side effect and nothing more.

```js
$( "#go" ).clickAsObservable().flatMap(function () {
	  
	return $( "#block" ).animateAsObservable({
		width: "70%",
		opacity: 0.4,
		marginLeft: "0.6in",
		fontSize: "3em",
		borderWidth: "10px"
	}, 1500 );
}).subscribe();
```

## Using RxJS with jQuery ##

Let's start though by assuming you just have RxJS and wanted to get started with jQuery without the bridge library.  There is already plenty you can do without even needing a bridge library with the support built in for events and promises.

### Binding to an event ###

Using RxJS with jQuery to bind to an event using plain old RxJS is easy.  For example, we could bind to the `mousemove` event from the DOM document easily.

First, we'll reference the files we need.

	<div id="results"></div>
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="rx.js"></script>
	<script src="rx.async.js"></script>
	<script src="rx.binding.js"></script>

```js
var observable = Rx.Observable.fromEvent(
	$(document),
	'mousemove');

var subscription = observable.subscribe(function (e) {
	$('#results').text(e.clientX + ',' + e.clientY);
});
```

We could go a step further and create our own jQuery plugin which handles events with ease.

```js
/**
 * Creates an observable sequence by adding an event listener to the matching jQuery element
 *
 * @param {String} eventName The event name to attach the observable sequence.
 * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
 * @returns {Observable} An observable sequence of events from the specified element and the specified event.
 */
jQuery.fn.toObservable = function (eventName, selector) {
	return Rx.Observable.fromEvent(this, eventName, selector);	
};
```

Now we could rewrite our above example such as this.

```js
var observable = $(document).toObservable('mousemove');

var subscription = observable.subscribe(function (e) {
	$('#results').text(e.clientX + ',' + e.clientY);
});
```

### Using RxJS with Ajax calls ###

Bridging to jQuery Ajax calls using [`$.ajax`](http://api.jquery.com/jQuery.ajax/) is easy as well with the built-in [Promises A+](https://github.com/promises-aplus/promises-spec) support.  Since jQuery 1.5, the `$.ajax` method has implemented a promise interface (even if not 100% pure) which allows us to bridge to an observable sequence via the `Rx.Observable.fromPromise` method.

For example, we could query Wikipedia by calling the `$.ajax` method and then calling the [`promise`](http://api.jquery.com/deferred.promise/) method which then exposes the minimum promise interface needed.

```js
function searchWikipedia (term) {
    var promise = $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
            action: 'opensearch',
            format: 'json',
            search: encodeURI(term)
        }
    }).promise();
    return Rx.Observable.fromPromise(promise);
}
```

Once we created the wrapper, we can query the service by getting the text and then using `flatMapLatest` to ensure we have no out of order results.

```js
$('#input').toObservable('keyup')
	.map(function (e) { return e.target.value; })
	.flatMapLatest(searchWikipedia)
	.subscribe(function (data) {

		var results = data[1];

		$.each(results, function (_, result) {
			// Do something with each result
		});

	});
```

### Using RxJS with Callbacks to Handle Simple Animations ###

RxJS can also be used to bind to simple callbacks, such as the [`.animate()`](http://api.jquery.com/animate/) method.  We can use `Rx.Observable.fromCallback` to supply the required arguments with the last argument is to be the callback.  In this example, we'll take the animation example from above and use nothing but core RxJS to accomplish the same thing.

You'll note that we need a notion of `this` for the `block.animate` to properly work, so we have two choices, either use `Function.prototype.bind` available in most modern browsers...

```js
var animate = Rx.Observable.fromCallback(block.animate.bind(block));
```

Or we can supply an optional argument which supplies the context to the callback such as the following...

```js
var animate = Rx.Observable.fromCallback(
	block.animate,
	null, /* default scheduler used */
	block /* context */);
```

When viewed in its entirety, it will look like this where we call `flatMap` or `selectMany` to compose together two observable sequences.  We then bind to the `animate` function through `Rx.Observable.fromCallback` and then return the observable which results from the function execution.  Our `subscribe` does nothing in this case as there is nothing to print or do, and is simply a side effect.

```js
var block = $('#block');

$('#go').toObservable('click).flatMap(function () {
    var animate = Rx.Observable.fromCallback(block.animate.bind(block));

    return animate({
        width: "70%",
        opacity: 0.4,
        marginLeft: "0.6in",
        fontSize: "3em",
        borderWidth: "10px"
    }, 1500);
}).subscribe();
```
