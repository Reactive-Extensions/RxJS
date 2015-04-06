# RxJS Coincidence Compat Module #

The Reactive Extensions for JavaScript has a set of coincidence-based operators such as `join` and `groupJoin` which allow one to correlate two observable sequences much as you would do in SQL.  There is also support for advanced windowing and bufferring capabilities which allow for the specification of opening and closing observable sequences to denote how much data to capture.  This requires `rx.lite.compat.js` from the [`rx-lite-compat`](https://www.npmjs.com/package/rx-lite) NPM module.  This module has support for older browsers which do not support ES5 functionality, hence the name `compat`.

## Getting Started

There are a number of ways to get started with RxJS.

### Installing with [NPM](https://npmjs.org/)

```bash`
$ npm install rx-lite-coincidence-compat
$ npm install -g rx-lite-coincidence-compat
```

### Using with Node.js and Ringo.js

```js
var Rx = require('rx-lite-coincidence-compat');
```

### In a Browser:

```html
<!-- Just the core RxJS -->
<script src="path/to/rx.lite.compat.js"></script>
<script src="path/to/rx.lite.coincidence.compat.js"></script>
```

## Included Observable Operators ##

## `Observable Instance Methods`
- [`buffer`](../../doc/api/core/operators/buffer.md)
- [`groupBy`](../../doc/api/core/operators/groupby.md)
- [`groupByUntil`](../../doc/api/core/operators/groupbyuntil.md)
- [`groupJoin`](../../doc/api/core/operators/groupjoin.md)
- [`join`](../../doc/api/core/operators/join.md)
- [`pairwise`](../../doc/api/core/operators/pairwise.md)
- [`partition`](../../doc/api/core/operators/partition.md)
- [`window`](../../doc/api/core/operators/window.md)


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
