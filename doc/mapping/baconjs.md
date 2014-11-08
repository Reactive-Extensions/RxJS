# RxJS for Bacon.js Users #

[Bacon.js](https://github.com/baconjs/bacon.js) is a popular Reactive Programming (FRP) library which was inspired by RxJS, ReactiveBanana among other libraries.  Bacon.js has two main concepts, Event Streams and Properties, which we will map to RxJS concepts in this document.

But, before we get started, why use RxJS over Bacon.js?

## Why RxJS versus Bacon.js ##

There are a number of reasons why RxJS makes sense to use versus Bacon.js.  Some of these include:
- Performance
- Interoperability With The Libraries You Use
- Swappable Concurrency Layer
- Build What You Want
- Many Examples and Tutorials
- Extensive Documentation
- A Commitment to Standards

### Performance ###

RxJS has always been committed to providing the best performance available on any given JavaScript platform.  Whether it is providing a small footprint for an `Observable` instance, to providing the capability of using `setImmediate` versus `setTimeout` versus `requestAnimationFrame`, all by choosing a different scheduler.  In addition, since RxJS is written in regular JavaScript versus CoffeeScript, there are a lot more optimizations that can be made by hand to ensure performance.

To make this more concrete, there is a project called [Kefir](https://github.com/pozadi/kefir) which is trying to make a more performance oriented version of Bacon.js.  Here are some current numbers based upon the memory tests provided by Kefir.  Note that these may change over time, but gives you a good indication of memory consumtpion.  Below will be comparison of `combineLatest`, `filter`, `map`, and `scan`.

```
stream1.combine(stream2, ->) (1000 samples)
----------------------------------------------------------------
Kefir   w/o subscr. 0.44 KiB   w/ subscr. +0.80 KiB   sum 1.23 KiB
Bacon   w/o subscr. 5.42 KiB   w/ subscr. +6.15 KiB   sum 11.57 KiB
Rx      w/o subscr. 0.43 KiB   w/ subscr. +2.84 KiB   sum 3.26 KiB
-----------------------
Kefir 1.00 1.00 1.00    Bacon 12.45 7.71 9.39    Rx 0.98 3.56 2.65

.filter(->) (1000 samples)
----------------------------------------------------------------
Kefir   w/o subscr. 0.31 KiB   w/ subscr. +0.46 KiB   sum 0.77 KiB
Bacon   w/o subscr. 1.82 KiB   w/ subscr. +2.49 KiB   sum 4.31 KiB
Rx      w/o subscr. 0.37 KiB   w/ subscr. +1.44 KiB   sum 1.81 KiB
-----------------------
Kefir 1.00 1.00 1.00    Bacon 5.91 5.39 5.60    Rx 1.21 3.11 2.35

.map(->) (1000 samples)
----------------------------------------------------------------
Kefir   w/o subscr. 0.30 KiB   w/ subscr. +0.47 KiB   sum 0.77 KiB
Bacon   w/o subscr. 1.81 KiB   w/ subscr. +2.49 KiB   sum 4.30 KiB
Rx      w/o subscr. 0.37 KiB   w/ subscr. +1.43 KiB   sum 1.81 KiB
-----------------------
Kefir 1.00 1.00 1.00    Bacon 6.07 5.31 5.60    Rx 1.24 3.06 2.35

.scan(0, ->) (1000 samples)
----------------------------------------------------------------
Kefir   w/o subscr. 0.30 KiB   w/ subscr. +0.47 KiB   sum 0.76 KiB
Bacon   w/o subscr. 1.68 KiB   w/ subscr. +2.06 KiB   sum 3.75 KiB
Rx      w/o subscr. 0.39 KiB   w/ subscr. +1.13 KiB   sum 1.52 KiB
-----------------------
Kefir 1.00 1.00 1.00    Bacon 5.62 4.44 4.90    Rx 1.29 2.43 1.99
```

As you'll note, while Kefir does pretty well here, Bacon.js does not.  Bacon.js has a fairly heavy Observable object to start with and then subscriptions are fairly heavy as well.  With both Kefir and RxJS, the initial size of the Observable is about the same.  We'll get to the other fine tuning such as schedulers in the later section.
