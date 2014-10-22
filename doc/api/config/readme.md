# Reactive Extensions Configuration #

Configuration information for the Reactive Extensions for JavaScript

## Documentation ##

- [`Rx.config.Promise`](#rxconfigpromise)
- [`Rx.config.useNativeEvents`](#rxconfigusenativeevents)

* * *

### <a id="rxconfigpromise"></a>`Rx.config.Promise`
<a href="#rxconfigpromise">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/basicheader.js "View in source") [&#x24C9;][1]

Sets the default Promise type to be used when the [`toPromise`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/topromise.md) method is called.  Note that the Promise implementation must conform to the ES6 specification.  Some of those supported libraries are [Q](https://github.com/kriskowal/q), [RSVP](https://github.com/tildeio/rsvp.js), [when.js](https://github.com/cujojs/when) among others.  If not specified, this defaults to the native ES6 Promise, if available, else will throw an error.

#### Example

```js
Rx.config.Promise = RSVP.Promise;

var p = Rx.Observable.just(1).toPromise()
  .then(function (value) { console.log('Value: %s', s); });
// => Value: 1
```
* * *

### <a id="rxconfigusenativeevents"></a>`Rx.config.useNativeEvents`
<a href="#rxconfigusenativeevents">#</a>[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/fromevent.js "View in source") [&#x24C9;][1]

Determines whether the [`fromEvent`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators/fromevent.md) method uses native DOM events only and disregards the referenced supported libraries such as [jQuery](http://jquery.com/), [Zepto.js](http://zeptojs.com/), [AngularJS](https://angularjs.org/), [Ember.js](http://emberjs.com/) and [Backbone.js](http://backbonejs.org)

#### Example

For example, we could have jQuery referenced as part of our project, however, we only want native DOM events.

```html
<script src="jquery.js"></script>
<script src="rx.lite.js"></script>
```

We can do this by setting the `Rx.config.useNativeEvents` flag to `true`.

```js
Rx.config.useNativeEvents = true;

Rx.Observable.fromEvent(document, 'mousemove')
  .subscribe(e) {
    console.log('ClientX: %d, ClientY: %d', e.clientX, e.clientY);
  }
```
* * *
