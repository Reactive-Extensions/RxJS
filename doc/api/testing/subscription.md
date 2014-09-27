# `Rx.Subscription` class #

Records information about subscriptions to and unsubscriptions from observable sequences.

### Location

- rx.testing.js

## `Subscription Constructor` ##
- [`constructor`](#rxsubscriptionsubscribe-unsubscribe)

## `Subscription Instance Methods` ##
- [`equals`](#rxsubscriptionprototypeequalsother)
- [`toString`](#rxsubscriptionprototypetostring)

## `Subscription Instance Properties` ##
- [`subscribe`](#subscribe)
- [`unsubscribe`](#unsubscribe)

## _Subscription Constructor_ ##

### <a id="rxsubscriptionsubscribe-unsubscribe"></a>`Rx.Subscription(subscribe, unsubscribe)`
<a href="#rxsubscriptionsubscribe-unsubscribe">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/subscription.js#L8-L11 "View in source")

Creates a new subscription object with the given virtual subscription and unsubscription time.

#### Arguments
1. `subscribe` *(Number)*: Virtual time at which the subscription occurred.
2. `[unsubscribe = Number.MAX_VALUE]` *(Number)*: Virtual time at which the unsubscription occurred.

#### Example
```js
var subscription = new Rx.Subscription(200, 1000);

console.log(recorded.time);
// => 200

console.log(recorded.unsubscribe);
// => 1000
```

### Location

- rx.testing.js

* * *

## _Subscription Instance Methods_ ##

### <a id="rxsubscriptionprototypeequalsother"></a>`Rx.Subscription.prototype.equals(other)`
<a href="#rxsubscriptionprototypeequalsother">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/subscription.js#L18-L20 "View in source")

Checks whether the given subscription is equal to the current instance.

#### Arguments
1. `other` *(Subscription)*: Subscription object to check for equality.

#### Returns
*(Boolean)*: Returns `true` if the Subscription equals the other, else `false`.

#### Example

```js
var s1 = new Subscription(201, 500);
var s2 = new Subscription(201);
var s3 = new Subscription(201, 500);

console.log(s1.equals(s2));
// => false

console.log(s1.equals(s3));
// => true
```

### Location

- rx.testing.js

* * *

### <a id="rxsubscriptionprototypetostring"></a>`Rx.Subscription.prototype.toString()`
<a href="#rxsubscriptionprototypeequalsother">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/subscription.js#L30-L32 "View in source")

Returns a string representation of the current Subscription value.

#### Returns
*(String)*: String representation of the current Subscription value.

#### Example

```js
var s1 = new Subscription(201);

console.log(s1.toString());
// => (201, Infinite)

var s2 = new Subscription(201, 1000);
console.log(s2.toString());
// => (201, 1000)
```

### Location

- rx.testing.js

* * *

## _Subscription Instance Properties_ ##

### <a id="subscribe"></a>`subscribe`
<a href="#subscribe">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/subscription.js#L8 "View in source")

Gets the subscription virtual time.

#### Returns
*(Number)*: The subscription virtual time.

#### Example

```js
var s1 = new Subscription(201);

console.log(s1.subscribe);
// => 201
```

### Location

- rx.testing.js

* * *

### <a id="unsubscribe"></a>`unsubscribe`
<a href="#value">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/subscription.js#L9 "View in source")

Gets the unsubscription virtual time.

#### Returns
*(Number)*: The unsubscription virtual time.

#### Example

```js
var s1 = new Subscription(201, 500);

console.log(r1.unsubscribe);
// => foo
```

### Location

- rx.testing.js

* * *
