# How do I work with jQuery and RxJS #

The [jQuery](http://jquery.com) project and RxJS play very well together as libraries.  In fact, we supply bindings directly for RxJS to jQuery should you want to wrap animations, events, Ajax calls and more using Observables in [RxJS-jQuery](https://github.com/Reactive-Extensions/RxJS-jQuery).  The bindings library provides many handy features for bridging the world to Observables.  If you're interested in that library, go ahead and use it.  

## Using RxJS wit jQuery ##

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
jQuery.fn.toObservable = function (eventName) {
	return Rx.Observable.fromEvent(this, eventName);	
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
