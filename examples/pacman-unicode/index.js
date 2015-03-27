// Originally from https://github.com/eguneys/pacman-unicode/blob/master/app/scripts/main.js
(function () {

  function ready() {
    return Rx.Observable.create(function (observer) {
      var addedHandlers = false;

      function handler () {
        observer.onNext();
        observer.onCompleted();
      }

      if (document.readyState === 'complete') {
        setTimeout(handler, 0);
      } else {
        addedHandlers = true;
        document.addEventListener( 'DOMContentLoaded', handler, false );
      }

      return function () {
        if (!addedHandlers) { return; }
        document.removeEventListener( 'DOMContentLoaded', handler, false );
      };
    });
  };

  ready().subscribe(function() {
    restartGame(document.querySelector('.game-area'));
  });

  function restartGame(parent, hs) {
    var game = new PacmanGame(parent, hs);

    var moveStream = Rx.Observable.create(function(observer) {
      game.onPacmanMove = function(moveV) {
        observer.onNext(moveV);
      };
    }).publish().refCount();

    moveStream.subscribe(function(moveV) {
      if (!moveV) {
        restartGame(parent, game.highScore);
        return;
      }

      game.movePacman(moveV);
    });

    var spawnStream = Rx.Observable.of(
      PacmanGame.GhostColors.ORANGE,
      PacmanGame.GhostColors.BLUE,
      PacmanGame.GhostColors.GREEN,
      PacmanGame.GhostColors.PURPLE,
      PacmanGame.GhostColors.WHITE
    )
    .flatMap(function (x) { return Rx.Observable.timer(800).map(x); })
    .delay(2500);

    spawnStream.subscribe(function(ghost) {
      game.spawnGhost(ghost);
    });

    var ghostStream = Rx.Observable.interval(1000);

    ghostStream.subscribe(function() {
      game.updateGhosts();
    });

    Rx.Observable.merge(moveStream, ghostStream).subscribe(function() {
      game.tick();
    });

    game.start();
  }

}());
