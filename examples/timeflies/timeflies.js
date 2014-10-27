(function (window, undefined) {

  function getOffset(element) {
    var doc = element.ownerDocument,
        docElem = doc.documentElement,
        body = doc.body,
        clientTop  = docElem.clientTop  || body.clientTop  || 0,
        clientLeft = docElem.clientLeft || body.clientLeft || 0,
        scrollTop  = window.pageYOffset,
        scrollLeft = window.pageXOffset;

    return { top : scrollTop  - clientTop, left: scrollLeft - clientLeft };
  }

  function main() {

    var text = 'TIME FLIES LIKE AN ARROW',
        container = document.querySelector('#container'),
        mousemove = Rx.Observable.fromEvent(document, 'mousemove');

    // Get the offset on mousemove from the container
    var mouseMoveOffset = mousemove.map(function (e) {
      var offset = getOffset(container);
      return {
        offsetX : e.clientX - offset.left + document.documentElement.scrollLeft,
        offsetY : e.clientY - offset.top + document.documentElement.scrollTop
      };
    });

    Rx.Observable.from(text).flatMap(
      function (letter, i) {
        // Add an element for each letter
        var s = document.createElement('span');
        s.innerHTML = letter;
        s.style.position = 'absolute';
        container.appendChild(s);

        // move each letter with a delay based upon overall position
        return mouseMoveOffset.delay(i * 100).map(function (pos) {
          return { pos: pos, element: s, index: i };
        });
      })
    .subscribe(function (data) {
      data.element.style.top = data.pos.offsetY + 'px';
      data.element.style.left = data.pos.offsetX + data.index * 10 + 15 + 'px';
    });
  }

  main();
}(window));
