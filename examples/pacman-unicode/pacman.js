// Originally from https://github.com/eguneys/pacman-unicode/blob/master/app/scripts/pacman.js
(function () {
'use strict';

  function PacmanGame(parent, hs) {
    this.parent = parent;

    this.term = null;

    this.termConfig = {
      hud: { x: 3, y: 1 },
      gameArea: { x: 3, y: 3 }
    };

    this.gameOver = true;

    this.score = 0;
    this.highScore = hs || 0;

    this.totalPoints = 0;
    this.countPoints = 0;

    this.p1 = null;
    this.ghosts = null;
    this.map = null;

    this.TilePacmanLeft = [new ut.Tile('>', 255, 255, 0), new ut.Tile('-', 255, 255, 0)];
    this.TilePacmanRight = [new ut.Tile('<', 255, 255, 0), new ut.Tile('-', 255, 255, 0)];
    this.TilePacmanUp = [new ut.Tile('V', 255, 255, 0), new ut.Tile('|', 255, 255, 0)];
    this.TilePacmanDown = [new ut.Tile('^', 255, 255, 0), new ut.Tile('|', 255, 255, 0)];


    this.TilePoint = new ut.Tile('▪', 150, 0, 150);
    this.TileBigP = new ut.Tile('O', 150, 0, 150);

    this.TileWall = new ut.Tile(' ', 0, 0, 0, 100, 100, 100);

    this.TileEmpty = new ut.Tile(' ', 100, 100, 100);

    var hudbg = PacmanGame.HudColors.BG;
    this.TileHudBG = new ut.Tile(' ', 0, 0, 0, hudbg.r, hudbg.g, hudbg.b);

    this.onPacmanMove = null;
  }

  PacmanGame.HudColors = {
    BG: { r: 94, g: 39, b: 40 }
  };

  PacmanGame.GhostColors = {
    ORANGE: 1,
    BLUE: 2,
    GREEN: 3,
    PURPLE: 4,
    WHITE: 5
  };

  PacmanGame.PacmanTiles = {
    WALL: '#',
    POINT: '.',
    BIGP: 'o',
    'EMPTY': ' '
  };


  PacmanGame.prototype.generateMap = function() {
    this.p1 = { x: 14, y: 12,
                tile: this.TilePacmanLeft[0]
              };

    this.ghosts = [];

    this.map = [
      '############################',
      '#o...........##...........o#',
      '#.####.#####.##.#####.####.#',
      '#.####.#####.##.#####.####.#',
      '#..........................#',
      '#.####.#.##########.#.####.#',
      '#......#.....##.....#......#',
      '######.#####.##.#####.######',
      '     #.#............#.#     ',
      '######.#.####  ####.#.######',
      '.........#        #.........',
      '######.#.##########.#.######',
      '     #.#............#.#     ',
      '######.#.##########.#.######',
      '#............##............#',
      '#.####.#####.##.#####.####.#',
      '#...##................##...#',
      '###.##.#.##########.#.##.###',
      '#......#.....##.....#......#',
      '#.##########.##.##########.#',
      '#o........................o#',
      '############################'
    ];

    var totalPoints = 0;
    this.map.forEach(function(s) {
      totalPoints += s.split('.').length - 1;
    });

    this.totalPoints = totalPoints;

    this.wrapPos = [
      { x: -1, y: 10,
        wrapTo: { x: 27, y: 10 }
      },
      { x: 28, y: 10,
        wrapTo: { x: 0, y: 10 }
      }
    ];
  };

  PacmanGame.prototype.getGhostTile = function(color) {
    var tileChar = 'X';
    var tile;

    switch (color) {
    case PacmanGame.GhostColors.ORANGE:
      tile = new ut.Tile(tileChar, 150, 75, 0);
      break;
    case PacmanGame.GhostColors.BLUE:
      tile = new ut.Tile(tileChar, 0, 0, 100);
      break;
    case PacmanGame.GhostColors.GREEN:
      tile = new ut.Tile(tileChar, 0, 100, 0);
      break;
    case PacmanGame.GhostColors.PURPLE:
      tile = new ut.Tile(tileChar, 100, 0, 100);
      break;
    case PacmanGame.GhostColors.WHITE:
      tile = new ut.Tile(tileChar, 255, 255, 255);
      break;
    }
    return tile;
  };

  PacmanGame.prototype.getPacmanTile = function(x, y) {
    var t = '';
    try { t = this.map[y][x]; }
    catch(err) { return ut.NULLTILE; }
    switch(t) {
    case PacmanGame.PacmanTiles.POINT:
      return this.TilePoint;
    case PacmanGame.PacmanTiles.BIGP:
      return this.TileBigP;
    case PacmanGame.PacmanTiles.WALL:
      return this.TileWall;
    case PacmanGame.PacmanTiles.EMPTY:
      return this.TileEmpty;
    default:
      return ut.NULLTILE;
    }

  };

  PacmanGame.prototype.setPacmanTile = function(x, y, tile) {
    var row = this.map[y];

    this.map[y] = row.substr(0, x) + tile + row.substr(x + 1);
  };

  PacmanGame.prototype.setGameOver = function() {
    this.p1.tile = new ut.Tile('Ⴖ', 255, 255, 255);
    this.gameOver = true;
    this.highScore = Math.max(this.highScore, this.score);
  };

  PacmanGame.prototype.putHud = function() {
    var base = this.termConfig.hud;

    for (var x = 0; x < this.map[0].length; x++) {
      for (var y = 0; y < 2; y++) {
        this.term.put(this.TileHudBG, base.x + x, base.y + y);
      }
    }

    var hudbg = PacmanGame.HudColors.BG;
    var halfLength = this.map[0].length / 2;

    this.term.putString("High Score", base.x + halfLength, base.y, 255, 255, 255, hudbg.r, hudbg.g, hudbg.b);

    this.term.putString(this.score.toString(), base.x + 2, base.y + 1, 255, 255, 255, hudbg.r, hudbg.g, hudbg.b);

    this.term.putString(this.highScore.toString(), base.x + halfLength, base.y + 1, 255, 255, 255, hudbg.r, hudbg.g, hudbg.b);


    if (this.gameOver) {
      var mapLength = this.map.length;
      this.term.putString("Game Over", base.x, base.y + mapLength + 2, 255, 255, 255, hudbg.r, hudbg.g, hudbg.b);
      this.term.putString("Space to Restart", base.x, base.y + mapLength + 3, 255, 255, 255, hudbg.r, hudbg.g, hudbg.b);
    }
  };

  PacmanGame.prototype.putTiles = function() {
    var base = this.termConfig.gameArea;

    for (var y = 0; y < this.map.length; y++) {
      for (var x = 0; x< this.map[0].length; x++) {
        this.term.put(this.getPacmanTile(x, y), base.x + x, base.y + y);
      }
    }
  };

  PacmanGame.prototype.putMovables = function() {
    var base = this.termConfig.gameArea;

    this.term.put(this.p1.tile, base.x + this.p1.x, base.y + this.p1.y);

    for (var i in this.ghosts) {
      var ghost = this.ghosts[i];

      this.term.put(ghost.tile, base.x + ghost.x, base.y + ghost.y);
    }
  };

  PacmanGame.prototype.movePacman = function(p1V) {

    var p1 = { x: this.p1.x + p1V.x, y: this.p1.y + p1V.y,
               tile: this.TilePacmanDown
             };

    if (this.gameOver) {
      return;
    }

    if (!this.canMoveTo(p1.x, p1.y)) {
      var wrapPos = this.findWrapPos(p1.x, p1.y);

      if (wrapPos) {
        p1.x = wrapPos.x;
        p1.y = wrapPos.y;
      } else {
        return;
      }
    }

    if (p1V.x < 0) {
      p1.tile = this.TilePacmanLeft;
    } else if (p1V.x > 0) {
      p1.tile = this.TilePacmanRight;
    } else if (p1V.y < 0) {
      p1.tile = this.TilePacmanUp;
    }

    if (p1.tile[0] === this.p1.tile) {
      p1.tile = p1.tile[1];
    } else {
      p1.tile = p1.tile[0];
    }

    this.p1 = p1;
  };

  PacmanGame.prototype.spawnGhost = function(color) {
    var ghost = {
      x: 14, y: 10,
      tile: this.getGhostTile(color),
      v: { x: 0, y: -1 }
    };

    this.ghosts.push(ghost);
  };

  PacmanGame.prototype.moveGhost = function(ghost) {
    var wrapPos = this.findWrapPos(ghost.x + ghost.v.x, ghost.y + ghost.v.y);

    if (wrapPos) {
      ghost.x = wrapPos.x;
      ghost.y = wrapPos.y;
      return;
    }

    var nextVs = this.availableDirections(ghost.x, ghost.y);

    // protect against going backwards
    var backwardsV = { x: ghost.v.x * -1, y: ghost.v.y * -1};
    if (nextVs.length > 1) {
      nextVs = nextVs
        .filter(function(v) {
          return v.x  !==  backwardsV.x  || v.y !== backwardsV.y;
        });
    }

    var nextV = Math.floor(Math.random() * (nextVs.length - 1));

    ghost.v = nextVs[nextV];

    ghost.x += ghost.v.x;
    ghost.y += ghost.v.y;
  };

  PacmanGame.prototype.availableDirections = function(x, y) {
    var res = [];

    [{x: 0, y: 1}, {x : 0, y: -1}, { x: 1, y: 0 }, {x: -1, y: 0}]
      .forEach(function(v) {
        if (this.canMoveTo(x + v.x, y + v.y)) {
          res.push(v);
        }
      }, this);

    return res;
  };

  PacmanGame.prototype.canMoveTo = function(x, y) {
    var tile = this.getPacmanTile(x, y);

    return (tile === this.TilePoint ||
            tile === this.TileBigP ||
            tile === this.TileEmpty);
  };

  PacmanGame.prototype.findWrapPos = function(x, y) {
    var wrapPos = this.wrapPos
          .filter(function(p) {
            return p.x === x && p.y === y;
          });

    if (wrapPos.length > 0) {
      return wrapPos[0].wrapTo;
    } else {
      return null;
    }
  };

  PacmanGame.prototype.checkPacmanEat = function() {
    var p1Tile = this.getPacmanTile(this.p1.x, this.p1.y);

    if (p1Tile === this.TilePoint) {
      this.setPacmanTile(this.p1.x, this.p1.y, PacmanGame.PacmanTiles.EMPTY);
      this.score++;
      this.countPoints++;

      if (this.countPoints === this.totalPoints) {
        this.score += 100;
        this.setGameOver();
      }
    } else if (p1Tile === this.TileBigP) {
      this.setPacmanTile(this.p1.x, this.p1.y, PacmanGame.PacmanTiles.EMPTY);
      this.score += 10;
    }
  };

  PacmanGame.prototype.checkPacmanCaught = function() {
    var game = this;

    var p1 = this.p1;

    this.ghosts.forEach(function(g) {
      if (g.x === p1.x && g.y === p1.y) {
        game.setGameOver();
      }
    });
  };

  PacmanGame.prototype.updateGhosts = function() {
    this.ghosts.forEach(function(g) { this.moveGhost(g); }, this);
  };

  PacmanGame.prototype.tick = function() {

    if (!this.gameOver) {
      this.checkPacmanEat();
      this.checkPacmanCaught();
    }

    this.putHud();
    this.putTiles();
    this.putMovables();

    this.term.render();
  };

  PacmanGame.prototype.onKeyDown = function(k) {
    var moveV = { x: 0, y: 0 };
    switch (k) {
    case ut.KEY_W:
      moveV.y--;
      break;
    case ut.KEY_A:
      moveV.x--;
      break;
    case ut.KEY_S:
      moveV.y++;
      break;
    case ut.KEY_D:
      moveV.x++;
      break;
    case ut.KEY_SPACE:
      if (this.gameOver)
        moveV = null;
      break;
    }
    if (typeof this.onPacmanMove === 'function') {
      this.onPacmanMove(moveV);
    }
  };


  PacmanGame.prototype.start = function() {
    this.gameOver = false;

    this.generateMap();

    this.term = new ut.Viewport(this.parent, 50, 30);
    ut.initInput(this.onKeyDown.bind(this));

    this.tick();
  };

  window.PacmanGame = PacmanGame;
}());
