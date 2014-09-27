# `Rx.Recorded` class #

Record of a value including the virtual time it was produced on.

### Location

- rx.testing.js

## `Recorded Constructor` ##
- [`constructor`](#rxrecordedtime-value-comparer)

## `Recorded Instance Methods` ##
- [`equals`](#rxrecordedprototypeequalsother)
- [`toString`](#rxrecordedprototypetostring)

## `Recorded Instance Properties` ##
- [`time`](#time)
- [`value`](#value)

## _Recorded Constructor_ ##

### <a id="rxrecordedtime-value-comparer"></a>`Rx.Recorded(time, value, [comparer])`
<a href="#rxrecordedtime-value-comparer">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/recorded.js#L9-L13 "View in source")

Creates a new object recording the production of the specified value at the given virtual time.

#### Arguments
1. `time` *(Number)*: Virtual time the value was produced on.
2. `value` *(Any)*: Value that was produced
3. `[comparer]` *(Function)*: Optional comparer function.

#### Example
```js
var recorded = new Rx.Recorded(200, 'value');

console.log(recorded.time);
// => 200

console.log(recorded.value);
// => value
```

### Location

- rx.js

* * *

## _Recorded Instance Methods_ ##

### <a id="rxrecordedprototypeequalsother"></a>`Rx.Recorded.prototype.equals(other)`
<a href="#rxrecordedprototypeequalsother">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/recorded.js#L21-L23 "View in source")

Checks whether the given recorded object is equal to the current instance.

#### Arguments
1. `other` *(Recorded)*: Recorded object to check for equality.

#### Returns
*(Boolean)*: Returns `true` if the Recorded equals the other, else `false`.

#### Example

```js
var r1 = new Recorded(201, 'foo');
var r2 = new Recorded(201, 'bar');
var r3 = new Recorded(201, 'foo');

console.log(r1.equals(r2));
// => false

console.log(r1.equals(r3));
// => true
```

### Location

- rx.testing.js

* * *

### <a id="rxrecordedprototypetostring"></a>`Rx.Recorded.prototype.toString()`
<a href="#rxrecordedprototypeequalsother">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/recorded.js#L30-L32 "View in source")

Returns a string representation of the current Recorded value.

#### Returns
*(String)*: String representation of the current Recorded value.

#### Example

```js
var r1 = new Recorded(201, 'foo');

console.log(r1.toString());
// => foo@201
```

### Location

- rx.testing.js

* * *

## _Recorded Instance Properties_ ##

### <a id="time"></a>`time`
<a href="#time">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/recorded.js#L10 "View in source")

Gets the virtual time the value was produced on.

#### Returns
*(Number)*: The virtual time the value was produced on.

#### Example

```js
var r1 = new Recorded(201, 'foo');

console.log(r1.time);
// => 201
```

### Location

- rx.testing.js

* * *

### <a id="value"></a>`value`
<a href="#value">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/testing/recorded.js#L11 "View in source")

Gets the recorded value.

#### Returns
*(Number)*: The recorded value.

#### Example

```js
var r1 = new Recorded(201, 'foo');

console.log(r1.value;
// => foo
```

### Location

- rx.testing.js

* * *
