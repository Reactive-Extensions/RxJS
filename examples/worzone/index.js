// Originally from https://github.com/raimohanska/worzone

;(function (Game, undefined) {

  dom.ready().subscribe(function () {
    var bounds = Game.Rectangle(0, 0, 500, 450)
    var r = Raphael(20, 20, bounds.width, bounds.height);

    var audio = Game.Audio();

    dom.click(document.querySelector('#sound'))
      .subscribeOnNext(function () { audio.toggle(); });
  });

}(window.Game));
