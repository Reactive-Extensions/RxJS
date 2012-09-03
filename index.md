---
layout: default
title: RxJS Reactive Extensions for JavaScript
---

# What is RxJS?

aka _Reactive Extensions for JavaScript_. 

It's a library for composing asynchronous and event-based programs using observable sequences and LINQ-style query operators. Using Rx, you can represent asynchronous data streams with Observables and much more.

RxJS provides easy-to-use conversions from existing DOM, XmlHttpRequest (AJAX), and jQuery events to Rx push-collections, allowing you to seamlessly plug Rx into your existing apps.

## Show me

<pre><code data-language="JavaScript">
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