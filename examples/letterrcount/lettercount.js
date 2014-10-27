(function () {
  var $toCount = document.querySelector('#toCount');
  var $result = document.querySelector('#result');

  var source = Rx.Observable.fromEvent($toCount, 'keyup')
    .map(function (e) { return 'length: ' + e.target.value.length; })
    .distinctUntilChanged();

  function setHtml(text) {
    console.log(text);
    this.innerHTML = text;
  }

  source.subscribe(setHtml.bind($result));
}());
