(function (Game) {
  var mazes = [
    [ "*******************",
    "* *",
    "* ******* ****** *",
    "* * * *",
    "* * ******* * *",
    "* * * * * *",
    "* * * *",
    "* C *",
    "* * ******* * *",
    "* * * *",
    "* * * *",
    "* * * *",
    "* ******* ****** *",
    "* *",
    "* *************** *",
    "*1*5XXXXXLXXXX60*2*",
    "***XXXXXXXXXXXXX***" ],
    [ "*******************",
    "* *",
    "* ******* ****** *",
    "* * * *",
    "* * * ******* * * *",
    "* * * * * * * *",
    "* * * * * * * *",
    "* * * C * *",
    "* * * *** *** *****",
    "* * * * * * * *",
    "* * * * * * * * * *",
    "* * * * *",
    "***** *** * ***** *",
    "* * * *",
    "* *************** *",
    "*1*5XXXXXLXXXX60*2*",
    "***XXXXXXXXXXXXX***" ]
  ];


  function Maze(level) {

    var data = mazes[(level + 1) % 2],
        blockSize = 50,
        wall = 5,
        ascii = new Game.AsciiGraphic(data, blockSize, wall);

    function isWall(blockPos) { return ascii.isChar(blockPos, "*"); }

    function isFree(blockPos) { return ascii.isChar(blockPos, "C "); }

    function findMazePos(character) {
      function blockThat(predicate) {
        return ascii.forEachBlock(function(blockPos) {
          if (predicate(blockPos)) { return blockPos; }
        });
      }
      return blockThat(function(blockPos) { return ascii.isChar(blockPos, character)})
    }

    function accessible(pos, objectRadiusX, objectRadiusY, predicate) {
      objectRadiusY || (objectRadiusY = objectRadiusX);

      var radiusX = objectRadiusX,
          radiusY = objectRadiusY;

      for (var x = ascii.toBlockX(pos.x - radiusX); x <= ascii.toBlockX(pos.x + radiusX); x++) {
        for (var y = ascii.toBlockY(pos.y - radiusY); y <= ascii.toBlockY(pos.y + radiusY); y++) {
          if (!predicate(Point(x, y))) { return false; }
        }
      }
      return true;
    }
    return {
      levelNumberPos : function() {
        return ascii.blockCenter(findMazePos("L"))
      },
      centerMessagePos : function() {
        return ascii.blockCenter(findMazePos("C"))
      },
      playerStartPos : function(player) {
        return ascii.blockCenter(findMazePos("" + player.id))
      },
      playerScorePos : function(player) {
        var number = Number(player.id) + 4
        return ascii.blockCenter(findMazePos("" + number))
      },
      isAccessible : function(pos, objectRadiusX, objectRadiusY) {
        return accessible(pos, objectRadiusX, objectRadiusY, function(blockPos) { return !isWall(blockPos) })
      },
      isAccessibleByMonster : function(pos, objectRadiusX, objectRadiusY) {
        return accessible(pos, objectRadiusX, objectRadiusY, function(blockPos) { return isFree(blockPos) })
      },
      randomFreePos : function(filter) {
        while(true) {
          var pixelPos = ascii.blockCenter(ascii.randomBlock());
          if (filter(pixelPos)) { return pixelPos; }
        }
      },
      draw : function(levelEnd, raphael) {
        var elements = ascii.renderWith(raphael, function(block) {
          if (isWall(block)) {
            var corner = ascii.blockCorner(block),
                size = ascii.sizeOf(block);
            return raphael.rect(corner.x, corner.y, size.x, size.y).attr({ stroke : "#008", fill : "#008"});
          }
        });

        levelEnd.subscribeOnNext(function() {
          elements.remove()
        });
      }
    }
  }

  Game.Maze = Maze;
}(window.Game));