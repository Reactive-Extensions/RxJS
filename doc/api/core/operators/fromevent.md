### `Rx.Observable.fromEvent(element, eventName, [selector])`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/fromevent.js "View in source")

Creates an observable sequence by adding an event listener to the matching DOMElement, jQuery element, Zepto Element, Angular element, Ember.js element or EventEmitter.

Note that this uses the library approaches for jQuery, Zepto, Backbone.Marionette, AngularJS and Ember.js and falls back to native binding if not present. If you are using AMD you may need to include these libraries as dependencies of RxJs in your requirejs configuration file. RxJs will attempt to detect their presence when deciding which library to use.

#### Arguments
1. `element` *(`Any`)*: The DOMElement, NodeList, jQuery element, Zepto Element, Angular element, Ember.js element or EventEmitter to attach a listener. For Backbone.Marionette this would be the application or an EventAggregator object.
2. `eventName` *(`String`)*: The event name to attach the observable sequence.
3. `[selector]` *(`Function`)*: A selector which takes the arguments from the event handler to produce a single item to yield on next.

#### Returns
*(`Observable`)*: An observable sequence of events from the specified element and the specified event.

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
var EventEmitter = require('events').EventEmitter,
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
        console.log('Next: foo -' + x.foo + ', bar -' + x.bar);
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
- [`/src/core/linq/observable/fromevent.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/fromevent.js)

Dist:
- [`rx.async.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.async.js)
- [`rx.async.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.async.compat.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- If using [`rx.async.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.async.js) | [`rx.async.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.async.compat.js)
    - [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)
    - [`rx.binding.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.binding.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Complete`](http://www.nuget.org/packages/RxJS-Complete)
- [`RxJS-Async`](http://www.nuget.org/packages/RxJS-Async)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)

Unit Tests:
- [`/tests/observable/fromevent-compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/fromevent-compat.js)
- [`/tests/observable/fromevent.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/fromevent.js)
