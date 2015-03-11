# RxJS Lite Compatibility Extras #

The Reactive Extensions for JavaScript's lite extras are the operators that are found on `rx.compat.js` and but not available in `rx.lite.compat.js`.  By adding this file, you will have full access to all operators and thus makes including other files such as `rx.time.js`, `rx.joinpatterns.js` and others easier as well as having support for older browsers which do not support ES5 functionality.

## Getting Started

There are a number of ways to get started with RxJS. The files are available on [cdnjs](http://cdnjs.com/libraries/rxjs/) and [jsDelivr](http://www.jsdelivr.com/#!rxjs).

### Installing with [NPM](https://npmjs.org/)

```bash`
$ npm install rx-lite-extras-compat
$ npm install -g rx-lite-extras-compat
```

### Using with Node.js and Ringo.js

```js
var Rx = require('rx-lite-extras-compat');
```

### In a Browser:

```html
<!-- Just the core RxJS -->
<script src="path/to/rx.lite.compat.js"></script>
<script src="path/to/rx.lite.compat.extras.js"></script>
```

## Included Observable Operators ##

### `Observable Methods`
- [`amb`](../doc/api/core/operators/amb.md)
- [`generate`](../core/operators/generate.md)
- [`onErrorResumeNext`](../doc/api/core/operators/onerrorresumenext.md)
- [`using`](../doc/api/core/ooperators/using.md)

### `Observable Instance Methods`
- [`amb`](../doc/api/core/operators/ambproto.md)
- [`bufferWithCount`](../doc/api/core/operators/bufferwithcount.md)
- [`distinct`](../doc/api/core/operators/distinct.md)
- [`observeOn`](../doc/api/core/operators/observeon.md)
- [`onErrorResumeNext`](../doc/api/core/operators/onerrorresumenext.md)
- [`subscribeOn`](../doc/api/core/operators/subscribeon.md)
- [`takeLastBuffer`](../doc/api/core/operators/takelastbuffer.md)
- [`windowWithCount`](../doc/api/core/operators/windowwithcount.md)

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
