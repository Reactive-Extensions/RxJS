# RxJS Experimental Compat Module #

The Reactive Extensions for JavaScript has a number of operators that are considered experimental and not ready for mainstream usage.  This includes imperative operators such as `if`, `case`, `for`, `while`, `doWhile` as well as operators such as `forkJoin`.  This requires `rx.lite.compat.js` from the [`rx-lite-compat`](https://www.npmjs.com/package/rx-lite) NPM module.  This module has support for older browsers which do not support ES5 functionality, hence the name `compat`.

## Getting Started

There are a number of ways to get started with RxJS.

### Installing with [NPM](https://npmjs.org/)

```bash`
$ npm install rx-lite-experimental-compat
$ npm install -g rx-lite-experimental-compat
```

### Using with Node.js and Ringo.js

```js
var Rx = require('rx-lite-experimental-compat');
```

### In a Browser:

```html
<!-- Just the core RxJS -->
<script src="path/to/rx.lite.compat.js"></script>
<script src="path/to/rx.lite.experimental.compat.js"></script>
```

## Included Observable Operators ##

### `Observable Methods`
- [`case | switchCase`](../../doc/api/core/operators/case.md)
- [`for | forIn`](../../doc/api/core/operators/for.md)
- [`forkJoin`](../../doc/api/core/operators/forkjoin.md)
- [`if | ifThen`](../../doc/api/core/operators/if.md)
- [`while | whileDo`](../../doc/api/core/operators/while.md)

### `Observable Instance Methods`
- [`doWhile`](/api/core/operators/dowhile.md)
- [`expand`](../../doc/api/core/operators/expand.md)
- [`forkJoin`](../../doc/api/core/operators/forkjoinproto.md)
- [`let | letBind`](../../doc/api/core/operators/let.md)
- [`manySelect`](../../doc/api/core/operators/manyselect.md)

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
