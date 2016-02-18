[![NPM version](https://img.shields.io/npm/v/@rxjs/rx.svg)](https://www.npmjs.com/package/@rxjs/rx)
[![Downloads](https://img.shields.io/npm/dm/@rxjs/rx.svg)](https://www.npmjs.com/package/@rxjs/rx
[![Join the chat at https://gitter.im/Reactive-Extensions/RxJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Reactive-Extensions/RxJS?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**[The Need to go Reactive](#the-need-to-go-reactive)** |
**[About the Reactive Extensions](#about-the-reactive-extensions)** |
**[Batteries Included](#batteries-included)** |
**[Why RxJS?](#why-rxjs)** |
**[Dive In!](#dive-in)** |
**[Resources](#resources)** |
**[Getting Started](#getting-started)** |
**[Contributing](#contributing)** |
**[License](#license)**

# The Reactive Extensions for JavaScript (RxJS) <sup>4.0</sup>... #

*...is a set of libraries to compose asynchronous and event-based programs using observable collections and [Array#extras](http://blogs.msdn.com/b/ie/archive/2010/12/13/ecmascript-5-part-2-array-extras.aspx) style composition in JavaScript*

The project is actively developed by [Microsoft](https://microsoft.com/), in collaboration with a community of open source developers.

## The Need to go Reactive ##

Applications, especially on the web have changed over the years from being a simple static page, to DHTML with animations, to the Ajax revolution.  Each time, we're adding more complexity, more data, and asynchronous behavior to our applications.  How do we manage it all?  How do we scale it?  By moving towards "Reactive Architectures" which are event-driven, resilient and responsive.  With the Reactive Extensions, you have all the tools you need to help build these systems.

## About the Reactive Extensions ##

The Reactive Extensions for JavaScript (RxJS) is a set of libraries for composing asynchronous and event-based programs using observable sequences and fluent query operators that many of you already know by [Array#extras](http://blogs.msdn.com/b/ie/archive/2010/12/13/ecmascript-5-part-2-array-extras.aspx) in JavaScript. Using RxJS, developers represent asynchronous data streams with Observables, query asynchronous data streams using our many operators, and parameterize the concurrency in the asynchronous data streams using Schedulers. Simply put, RxJS = Observables + Operators + Schedulers.

Whether you are authoring a web-based application in JavaScript or a server-side application in Node.js, you have to deal with asynchronous and event-based programming. Although some patterns are emerging such as the Promise pattern, handling exceptions, cancellation, and synchronization is difficult and error-prone.

Using RxJS, you can represent multiple asynchronous data streams (that come from diverse sources, e.g., stock quote, tweets, computer events, web service requests, etc.), and subscribe to the event stream using the Observer object. The Observable notifies the subscribed Observer instance whenever an event occurs.

Because observable sequences are data streams, you can query them using standard query operators implemented by the Observable type. Thus you can filter, project, aggregate, compose and perform time-based operations on multiple events easily by using these operators. In addition, there are a number of other reactive stream specific operators that allow powerful queries to be written. Cancellation, exceptions, and synchronization are also handled gracefully by using the methods on the Observable object.

But the best news of all is that you already know how to program like this.  Take for example the following JavaScript code, where we get some stock data and then manipulate and iterate the results.

```js
/* Get stock data somehow */
const source = getAsyncStockData();

const subscription = source
  .filter(quote => quote.price > 30)
  .map(quote => quote.price)
  .forEach(price => console.log(`Prices higher than $30: ${price}`);
```

Now what if this data were to come as some sort of event, for example a stream, such as a WebSocket? Then we could pretty much write the same query to iterate our data, with very little change.

```js
/* Get stock data somehow */
const source = getAsyncStockData();

const subscription = source
  .filter(quote => quote.price > 30)
  .map(quote => quote.price)
  .subscribe(
    price => console.log(`Prices higher than $30: ${price}`),
    err => console.log(`Something went wrong: ${err.message}`);
  );

/* When we're done */
subscription.dispose();
```

The only difference is that we can handle the errors inline with our subscription.  And when we're no longer interested in receiving the data as it comes streaming in, we call `dispose` on our subscription.  Note the use of `subscribe` instead of `forEach`.  We could also use `forEach` which is an alias for `subscribe` but we highly suggest you use `subscribe`.

## Batteries Included ##

Sure, there are a lot of ways to get started with RxJS.  Since RxJS has been built using the CommonJS style of modules, you can either take the whole thing via Node.js with requiring `@rxjs/rx` or simply in your browser using the files of `dist/rx.all.js` or `dist/rx.all.min.js`.  We also have smaller versions such as a modular version of `rx.lite` which you can get via Node by requiring `@rxjs/rx/rx.lite` or in your browser `dist/rx.lite.js` or `dist/rx.lite.min.js`.

```js
var Rx = require('@rxjs/rx');

const subscription = Rx.Observable.fromArray([1,2,3])
  .filter(x => x % 2 === 0)
  .map(x => x + 2)
  .subscribe(x => console.log(`The answer is ${x}`));
// => The answer is 4
```

How much you include is up to you.  For example, want only a few operators?, then simply require what you need and leave the rest behind.

```js
const fromArray = require('@rx/rx/observable/fromarray');
const filter = require('@rxjs/rx/observable/filter');
const map = require('@rxjs/rx/observable/map');

const source = fromArray([1,2,3]);

const filtered = filter(source, x => x % 2 === 0);

const mapped = map(filtered, x => x + 2);

const subscription = mapped.subscribe( x => console.log(`The answer is ${x}`) );
// => The answer is 4
```

Optionally you can add right to the Observable itself such as:

```js
const Observable = require('@rxjs/rx/observable');

// Add class methods
Observable.addToObject({
  fromArray: require('@rxjs/rx/observable/fromarray')
});

// Add instance methods
Observable.addToPrototype({
  filter: require('@rxjs/rx/observable/filter'),
  map: require('@rxjs/rx/observable/map')
});

const subscription = Observable.fromArray([1,2,3])
  .filter(x => x % 2 === 0)
  .map(x => x + 2)
  .subscribe(x => console.log(`The answer is ${x}`));
```

## Why RxJS? ##

One question you may ask yourself is why RxJS?  What about Promises?  Promises are good for solving asynchronous operations such as querying a service with an XMLHttpRequest, where the expected behavior is one value and then completion.  Reactive Extensions for JavaScript unify both the world of Promises, callbacks as well as evented data such as DOM Input, Web Workers, and Web Sockets. Unifying these concepts enables rich composition.

To give you an idea about rich composition, we can create an autocompletion service which takes user input from a text input and then throttles queries a service (to avoid flooding the service with calls for every key stroke).

First, we'll reference the JavaScript files, including jQuery, although RxJS has no dependencies on jQuery...
```html
<script src="https://code.jquery.com/jquery.js"></script>
<script src="rx.lite.js"></script>
```
Next, we'll get the user input from an input, listening to the keyup event by using the `Rx.Observable.fromEvent` method.  This will either use the event binding from [jQuery](http://jquery.com), [Zepto](http://zeptojs.com/), [AngularJS](https://angularjs.org/), [Backbone.js](http://backbonejs.org/) and [Ember.js](http://emberjs.com/) if available, and if not, falls back to the native event binding.  This gives you consistent ways of thinking of events depending on your framework, so there are no surprises.

```js
const $input = $('#input');
const $results = $('#results');

/* Only get the value from each key up */
var keyups = Rx.Observable.fromEvent($input, 'keyup')
  .pluck('target', 'value')
  .filter(text => text.length > 2 );

/* Now debounce the input for 500ms */
var debounced = keyups
  .debounce(500 /* ms */);

/* Now get only distinct values, so we eliminate the arrows and other control characters */
var distinct = debounced
  .distinctUntilChanged();
```

Now, let's query Wikipedia!  In RxJS, we can instantly bind to any [Promises A+](https://github.com/promises-aplus/promises-spec) implementation through the `Rx.Observable.fromPromise` method. Or, directly return it and RxJS will wrap it for you.

```js
function searchWikipedia (term) {
  return $.ajax({
    url: 'https://en.wikipedia.org/w/api.php',
    dataType: 'jsonp',
    data: {
      action: 'opensearch',
      format: 'json',
      search: term
    }
  }).promise();
}
```

Once that is created, we can tie together the distinct throttled input and query the service.  In this case, we'll call `flatMapLatest` to get the value and ensure we're not introducing any out of order sequence calls.

```js
const suggestions = distinct
  .flatMapLatest(searchWikipedia);
```

Finally, we call the `subscribe` method on our observable sequence to start pulling data.

```js
suggestions.subscribe(
  data => {
    $results
      .empty()
      .append($.map(data[1], value =>  $('<li>').text(value)))
  },
  error=> {
    $results
      .empty()
      .append($('<li>'))
        .text('Error:' + error);
  });
```

And there you have it!

## Dive In! ##

Please check out:

 - [Our Code of Conduct](https://github.com/Reactive-Extensions/RxJS/tree/master/code-of-conduct.md)
 - [The full documentation](https://github.com/Reactive-Extensions/RxJS/tree/master/src/modular/doc)
 - [Our design guidelines](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/designguidelines)
 - [Our contribution guidelines](https://github.com/Reactive-Extensions/RxJS/tree/master/contributing.md)
 - [Our complete Unit Tests](https://github.com/Reactive-Extensions/RxJS/tree/master/src/modular/test)

## Resources

- Contact us
   - [Twitter @ReactiveX](https://twitter.com/ReactiveX)
   - [Gitter.im](https://gitter.im/Reactive-Extensions/RxJS)
   - [StackOverflow rxjs](http://stackoverflow.com/questions/tagged/rxjs)

## Getting Started

There are a number of ways to get started with RxJS.

### Download the Source

```bash
git clone https://github.com/Reactive-Extensions/rxjs.git
cd ./rxjs/src/modular
```

### Installing with [NPM](https://www.npmjs.com/)

```bash`
$ npm install @rxjs/rx
$ npm install -g @rxjs/rx
```

### Using with Node.js/JXcore

```js
var Rx = require('@rxjs/rx');
```

### In a Browser:

```html
<!-- Or all of RxJS minus testing -->
<script src="rx.all.js"></script>

<!-- Or keeping it lite -->
<script src="rx.lite.js"></script>
```

### Custom Builds

You can create custom builds using WebPack, Browserify, Rollup or other tools since RxJS is written in the style of CommonJS modules.  If you are looking for inspiration, see our `webpack.config.js` and `webpack.config.production.js` files on how we use WebPack.

## Contributing ##

There are lots of ways to contribute to the project, and we appreciate our [contributors](https://github.com/Reactive-Extensions/RxJS/wiki/Contributors).  If you wish to contribute, check out our [style guide]((https://github.com/Reactive-Extensions/RxJS/tree/master/doc/contributing)).

You can contribute by reviewing and sending feedback on code checkins, suggesting and trying out new features as they are implemented, submit bugs and help us verify fixes as they are checked in, as well as submit code fixes or code contributions of your own. Note that all code submissions will be rigorously reviewed and tested by the Rx Team, and only those that meet an extremely high bar for both quality and design/roadmap appropriateness will be merged into the source.

First-time contributors must sign a [Contribution License Agreement](https://cla.microsoft.com/).  If your Pull Request has the label [cla-required](https://github.com/Reactive-Extensions/RxJS/labels/cla-required), this is an indication that you haven't yet signed such an agreement.

## License ##

Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.
Microsoft Open Technologies would like to thank its contributors, a list
of whom are at https://github.com/Reactive-Extensions/RxJS/wiki/Contributors.

Licensed under the Apache License, Version 2.0 (the "License"); you
may not use this file except in compliance with the License. You may
obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing permissions
and limitations under the License.
