# RxJS Coincidence Module #

The Reactive Extensions for JavaScript has a set of coincidence-based operators such as `join` and `groupJoin` which allow one to correlate two observable sequences much as you would do in SQL.  There is also support for advanced windowing and bufferring capabilities which allow for the specification of opening and closing observable sequences to denote how much data to capture.

## Details ##

Files:
- `rx.coincidence.js`

NPM Packages:
- `rx`

NuGet Packages:
- `RxJS-Coincidence`

File Dependencies:
- `rx.js` | `rx.compat.js` | `rx.lite.js` | `rx.lite.compat.js`

NPM Dependencies:
- <None>

NuGet Dependencies:
- RxJS-Main

## Included Observable Operators ##

## `Observable Instance Methods`
- [`buffer`](../api/core/observable.md#rxobservableprototypebufferbufferopenings-bufferboundaries-bufferclosingselector)
- [`groupJoin`](../api/core/observable.md#rxobservableprototypegroupjoinright-leftdurationselector-rightdurationselector-resultselector)
- [`join`](../api/core/observable.md#rxobservableprototypejoinright-leftdurationselector-rightdurationselector-resultselector)
- [`window`](../api/core/observable.md#rxobservableprototypewindowwindowopenings-windowboundaries-windowclosingselector)