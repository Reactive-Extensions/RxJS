---
layout: default
title: RxJS Reactive Extensions for JavaScript
menu: 'index'
---

# What is RxJS?

aka _Reactive Extensions for JavaScript_. 

RxJS a library for composing asynchronous and event-based programs using observable sequences and LINQ-style query operators. Using Rx, you can represent asynchronous data streams with Observables and much more.

RxJS provides easy-to-use conversions from existing DOM, XmlHttpRequest (AJAX), and jQuery events to Rx push-collections, allowing you to seamlessly plug Rx into your existing apps.

# Show me

<pre><code data-language="JavaScript">// Here's an example using jQuery

	var $dragTarget = $('#dragTarget'), 
		$doc = $(document);

	var mouseup = $dragTarget.mouseupAsObservable(),
	var mousemove = $doc.mousemoveAsObservable(),
	var mousedown = $doc.mousedownAsObservable().select(function(ev) {
	        ev.preventDefault();
	        return {
	            left: event.clientX - dragTarget.offset().left,
	            top: event.clientY - dragTarget.offset().top
	        };
	    });

	var mousedrag = mousedown.selectMany(function(imageOffset) {
	        return mousemove.select(function(pos) {
	            return {
	                left: pos.clientX - imageOffset.left,
	                top: pos.clientY - imageOffset.top
	            };
	        }).takeUntil(mouseup);
	    });

	mousedrag.subscribe(function(pos) {
	     $dragTarget.css({top: pos.top, left: pos.left });
	});
</code></pre>

# Bindings

RxJS has lots of friends because it knows how to play nice with others.
Here's a list of the current bindings using RxJS with your favorite libraries and stacks.

* [NodeJS](https://github.com/Reactive-Extensions/rxjs-node)
* [jQuery](https://github.com/Reactive-Extensions/rxjs-jquery)
* [JavaScript Library for Windows 8](https://github.com/Reactive-Extensions/rxjs-winjs)
* [MooTools](https://github.com/Reactive-Extensions/rxjs-mootools)
* [Ext JS](https://github.com/Reactive-Extensions/rxjs-extjs)
* [Dojo Toolkit](https://github.com/Reactive-Extensions/rxjs-dojo)

# Community

Others are using RxJS. That means that if you use it you'll be cool too, just like everyone else.

* [Official Forums](http://social.msdn.microsoft.com/Forums/en-US/rx/)
* [Github Projects](https://github.com/reactive-extensions)
* [Contrib Project]()