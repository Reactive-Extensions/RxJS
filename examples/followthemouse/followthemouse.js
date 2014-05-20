(function () {

  function extractClientX(e) { return e.clientX; }
  function extractClientY(e) { return e.clientY; }
  function setLeft(x) { this.style.left = x + 'px'; }
  function setTop(y) { this.style.top = y + 'px'; }
  function add(x, y) { return x + y; }
  var partialAdd = function (x) { return add.bind(null, x); };
  function randomize() { return Math.round(10 * Math.random() - 5); }

  var delay = 300;

  var mousemove = Rx.Observable.fromEvent(document, 'mousemove');
  var left = mousemove.map(extractClientX);
  var top = mousemove.map(extractClientY);

  // Update the mouse
  var themouse = document.querySelector('#themouse');
  left.subscribe(setLeft.bind(themouse));
  top.subscribe(setTop.bind(themouse));

  // Update the tail
  var mouseoffset = themouse.offsetWidth;
  var thetail = document.querySelector('#thetail');
  left
    .map(partialAdd(mouseoffset))
    .delay(delay)
    .subscribe(setLeft.bind(thetail));
  top
    .delay(delay)
    .subscribe(setTop.bind(thetail));

  // Update wagging
  var wagDelay = delay * 1.5;
  var wagging = document.querySelector('#wagging');
  var mouseandtailoffset = mouseoffset + thetail.offsetWidth;
  left
    .map(partialAdd(mouseandtailoffset))
    .delay(wagDelay)
    .subscribe(setLeft.bind(wagging));

  var waggingDelay = Rx.Observable
    .interval(100)
    .map(randomize);

  top.delay(wagDelay)
    .combineLatest(waggingDelay, add)
    .subscribe(setTop.bind(wagging));
}());