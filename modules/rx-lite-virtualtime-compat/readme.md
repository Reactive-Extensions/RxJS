# RxJS Virtual Time Compat Module #

The Reactive Extensions for JavaScript supports a notion of virtual time, which allows you to mock time easily, or even run through historical data through the `HistoricalScheduler`. This requires `rx.lite.js` from the [`rx-lite`](https://www.npmjs.com/package/rx-lite) NPM module.  This module has support for older browsers which do not support ES5 functionality, hence the name `compat`.

## Getting Started

There are a number of ways to get started with RxJS.

### Installing with [NPM](https://npmjs.org/)

```bash`
$ npm install rx-lite-virtualtime-compat
$ npm install -g rx-lite-virtualtime-compat
```

### Using with Node.js and Ringo.js

```js
var Rx = require('rx-lite-virtualtime-compat');
```

### In a Browser:

```html
<!-- Just the core RxJS -->
<script src="path/to/rx.lite.compat.js"></script>
<script src="path/to/rx.lite.virtualtime.compat.js"></script>
```

## Included Classes ##

### Schedulers

- [`Rx.HistoricalScheduler`](../../doc/api/schedulers/historicalscheduler.md)
- [`Rx.VirtualTimeScheduler`](../../doc/api/schedulers/virtualtimescheduler.md)


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
