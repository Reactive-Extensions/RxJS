(function (Game) {
  var Observable = Rx.Observable;

  function Keyboard() {
    var allKeyUps = dom.keyup(document),
        allKeyDowns = dom.keydown(document);

    function keyCodeIs(keyCode) {
      return function(event) { return event.keyCode === keyCode; };
    }

    function keyCodeIsOneOf(keyCodes) {
      return function(event) { return keyCodes.indexOf(event.keyCode) >= 0; };
    }

    function keyUps(keyCode) {
      return allKeyUps.filter(keyCodeIs(keyCode));
    }

    function keyDowns(keyCodes) {
      return allKeyDowns.filter(keyCodeIsOneOf(toArray(keyCodes)));
    }

    function keyState(keyCode, value) {
      return keyDowns(keyCode)
        .map([value])
        .merge(keyUps(keyCode).map([]))
        .shareValue([])
        .distinctUntilChanged();
    }

    function multiKeyState(keyMap) {
      var streams = keyMap.map(function(pair) { return keyState(pair[0], pair[1]); });
      return Observable.zipArray(streams);
    }

    return {
      multiKeyState : multiKeyState,
      keyDowns : keyDowns,
      anyKey : allKeyDowns
    };
  }

  Game.Keyboard = Keyboard;
}(window.Game));
