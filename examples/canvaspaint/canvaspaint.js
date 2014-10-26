(function (window, undefined) {
  // Calcualte offset either layerX/Y or offsetX/Y
  function getOffset(event) {
    return {
      offsetX: event.offsetX === undefined ? event.layerX : event.offsetX,
      offsetY: event.offsetY === undefined ? event.layerY : event.offsetY
    };
  }

  function main() {
    var canvas = document.getElementById('tutorial');

    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.beginPath();

      // Check for pointer events
      var move = 'mousemove', down = 'mousedown', up = 'mouseup';
      if (window.navigator.pointerEnabled) {
        move = 'pointermove';
        down = 'pointerdown';
        up = 'pointerup';
      }

      // Get mouse moves
      var mouseMoves = Rx.Observable.fromEvent(canvas, move);

      // Calculate difference between two mouse moves
      var mouseDiffs = mouseMoves.zip(mouseMoves.skip(1), function (fst, snd) {
        return { first: getOffset(fst), second: getOffset(snd) };
      });

      // Get merge together both mouse up and mouse down
      var mouseButton = Rx.Observable.fromEvent(canvas, down).map(function () { return true; })
        .merge(Rx.Observable.fromEvent(canvas, up).map(function () { return false; }));

      // Paint if the mouse is down
      var paint = mouseButton.flatMapLatest(function (down) { return down ? mouseDiffs : mouseDiffs.take(0) });

      // Update the canvas
      paint.subscribe(function (x) {
        ctx.moveTo(x.first.offsetX, x.first.offsetY);
        ctx.lineTo(x.second.offsetX, x.second.offsetY);
        ctx.stroke();
      });
    }
  }

  main();
}(window));
