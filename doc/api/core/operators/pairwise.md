### `Rx.Observable.prototype.pairwise()`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/pairwise.js "View in source")

Triggers on the second and subsequent triggerings of the input observable. The Nth triggering of the input observable passes the arguments from the N-1th and Nth triggering as a pair.

#### Returns
*(`Observable`)*: An observable that triggers on successive pairs of observations from the input observable as an array.

#### Example
```js
var r = Rx.Observable.range(1, 4);

var source = r.pairwise();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + JSON.stringify(x));
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Next: [1,2]
// => Next: [2,3]
// => Next: [3,4]
// => Completed
```

#### Example (Draw line)
```html
<canvas id="canvas" width="600" height="600"/>
```

```js
var canvas = document.getElementById("canvas");
var g = canvas.getContext("2d");
g.rect(0, 0, canvas.width, canvas.height);
g.fillStyle = "rgb(0,0,0)";
g.fill();

var mouseMove = Rx.Observable.fromEvent(document, 'mousemove');
var mouseDown = Rx.Observable.fromEvent(document.getElementById('canvas'), 'mousedown');
var mouseUp = Rx.Observable.fromEvent(document.getElementById('canvas'), 'mouseup');

mouseDown.flatMap(function(ev) {  
  return mouseMove.map(function(ev) {
    return {
      x: ev.clientX,
      y: ev.clientY
    };
  }).pairwise().takeUntil(mouseUp);
  
}).subscribe(function(pos) {
  g.beginPath();
  g.lineWidth = 1;
  
  g.strokeStyle = "rgb(255, 0, 0)";
  
  g.moveTo(pos[0].x, pos[0].y);
  g.lineTo(pos[1].x, pos[1].y);
  
  g.stroke();
});
```

### Location

File:
- [`/src/core/linq/observable/pairwise.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/pairwise.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.coincidence.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.coincidence.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Coincidence`](http://www.nuget.org/packages/RxJS-Coincidence/)

Unit Tests:
- [`/tests/observable/pairwise.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/pairwise.js)
