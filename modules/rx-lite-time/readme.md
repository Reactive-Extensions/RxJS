# RxJS Time Module #

The Reactive Extensions for JavaScript, as it is a library that deals with events over time, naturally has a large number of operators that allow the creation of sequences at given timers, in addition to capturing time stamp and time interval information.  In addition, you can also check for timeouts on your operations.  This also supports windows and buffers with time. This requires `rx.lite.js` from the [`rx-lite`](https://www.npmjs.com/package/rx-lite) NPM module.

## Getting Started

There are a number of ways to get started with RxJS.

### Installing with [NPM](https://npmjs.org/)

```bash`
$ npm install rx-lite-time
$ npm install -g rx-lite-time
```

### Using with Node.js and Ringo.js

```js
var Rx = require('rx-lite-time');
```

### In a Browser:

```html
<!-- Just the core RxJS -->
<script src="path/to/rx.lite.js"></script>
<script src="path/to/rx.lite.time.js"></script>
```

## Included Observable Operators ##

### `Observable Methods`
- [`generateWithAbsoluteTime`](../../doc/api/core/operators/generatewithabsolutetime.md)
- [`generateWithRelativeTime`](../../doc/api/core/operators/generatewithrelativetime.md)

### `Observable Instance Methods`
- [`bufferWithTime`](../../doc/api/core/operators/bufferwithtime.md)
- [`bufferWithTimeOrCount`](../../doc/api/core/operators/bufferwithtimeorcount.md)
- [`debounceWithSelector`](../../doc/api/core/operators/debouncewithselector.md)
- [`delaySubscription`](../api/core/operators/delaysubscription.md)
- [`skipLastWithTime`](../../doc/api/core/operators/skiplastwithtime.md)
- [`takeLastBufferWithTime`](../../doc/api/core/operators/takelastbufferwithtime.md)
- [`takeLastWithTime`](../../doc/api/core/operators/takelastwithtime.md)
- [`throttleFirst`](../../doc/api/core/operators/throttlefirst.md)
- [`throttleWithTimeout`](../../doc/api/core/operators/debounce.md)
- [`timeInterval`](../../doc/api/core/operators/timeinterval.md)
- [`timeoutWithSelector`](../../doc/api/core/operators/timeoutwithselector.md)
- [`timestamp`](../../doc/api/core/operators/timestamp.md)
- [`windowWithTime`](../../doc/api/core/operators/windowwithtime.md)
- [`windowWithTimeOrCount`](../../doc/api/core/operators/windowwithtimeorcount.md)


## Contributing ##

There are lots of ways to contribute to the project, and we appreciate our [contributors](https://github.com/Reactive-Extensions/RxJS/wiki/Contributors).  If you wish to contribute, check out our [style guide]((https://github.com/Reactive-Extensions/RxJS/tree/master/doc/contributing)).

You can contribute by reviewing and sending feedback on code checkins, suggesting and trying out new features as they are implemented, submit bugs and help us verify fixes as they are checked in, as well as submit code fixes or code contributions of your own. Note that all code submissions will be rigorously reviewed and tested by the Rx Team, and only those that meet an extremely high bar for both quality and design/roadmap appropriateness will be merged into the source.

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
