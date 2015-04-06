# RxJS Backpressure Module #

The Reactive Extensions for JavaScript provides support backpressure for situations when the observable sequences emits too many messages for the observer to consume.  This is in addition to other mechanisms already in place such as `buffer`, `throttle`, `sample` among other operators which allow you to get messages every so often, or in batches.  This module allows you to pause and resume a hot observable with `pausable` and to pause and resume with buffered data with `pausableBuffered`.  In addition, we also support the ability to get a requested number of items from the queue through the `controlled` operator.
 This requires `rx.lite.js` from the [`rx-lite`](https://www.npmjs.com/package/rx-lite) NPM module.

## Getting Started

There are a number of ways to get started with RxJS.

### Installing with [NPM](https://npmjs.org/)

```bash`
$ npm install rx-lite-backpressure
$ npm install -g rx-lite-backpressure
```

### Using with Node.js and Ringo.js

```js
var Rx = require('rx-lite-backpressure');
```

### In a Browser:

```html
<!-- Just the core RxJS -->
<script src="path/to/rx.lite.js"></script>
<script src="path/to/rx.lite.backpressure.js"></script>
```

## Included Observable Operators ##

### `Observable Instance Methods`
- [`controlled`](../../doc/api/core/operators/controlled.md)
- [`pausable`](../../doc/api/core/operators/pausable.md)
- [`pausableBuffered`](../../doc/api/core/operators/pausablebuffered.md)

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
