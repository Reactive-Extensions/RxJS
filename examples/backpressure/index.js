(function () {

  function main() {
    var fromEvent = Rx.Observable.fromEvent;

    function isChecked(x) { return x.checked; }
    function notChecked(x) { return !x.checked; }

    var losslessResults = document.getElementById('losslessResults');
    var losslessToggle = document.getElementById('losslessToggle');

    function logInput(text) {
      var li = document.createElement('li');
      li.innerHTML = text;
      losslessResults.appendChild(li);
    }

    var mousemove = fromEvent(document, 'mousemove')
      .map(function (e) {
        return 'clientX: ' + e.clientX + ', clientY: ' + e.clientY;
      })
      .pausableBuffered();

    // Lossless
    var losslessClick = fromEvent(losslessToggle, 'click')
      .map(function (e) { return e.target.checked; })

    losslessClick.subscribe(function (checked) {
      if (checked) {
        mousemove.resume();
      } else {
        mousemove.pause();
      }
    })

    mousemove.subscribe(function (text) {
      logInput(text);
    });
  }

  window.onload = main;

}());
