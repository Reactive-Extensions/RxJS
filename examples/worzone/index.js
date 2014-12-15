// Originally from https://github.com/raimohanska/worzone

;(function (undefined) {

  dom.ready().subscribe(function () {
    var bounds = Rectangle(0, 0, 500, 450)
    var r = Raphael(20, 20, bounds.width, bounds.height);

    var audio = Audio();

    dom.click(document.querySelector('#sound'))
      .subscribe(function () { audio.toggle(); });
  });

  function Audio () {
    var on = false,
        sounds = {};

    function loadSound(soundName) {
      var audioElement = document.createElement('audio');
      audioElement.setAttribute('src', 'audio/' + soundName + '.ogg');
      return audioElement;
    }

    function getSound(soundName) {
      sounds[soundName] || (sounds[soundName] = loadSound(soundName));
      return sounds[soundName];
    }

    function play(soundName) {
      on && getSound(soundName).play();
    }

    return {
      playSound : function(soundName) { return function() { play(soundName) }},
      toggle : function() { on = !on; }
    };
  }

  function AsciiGraphic(data, blockSize, wall, position) {
    wall || (wall = blockSize);
    position || (position = new Graphics.Point(0, 0));
    var width = data[0].length,
        height = data.length,
        fullBlock = blockSize + wall;

    function charAt(blockPos) {
      if (blockPos.y >= height || blockPos.x >= width || blockPos.x < 0 || blockPos.y < 0) { return 'X'; }
      return data[blockPos.y][blockPos.x];
    }

    function isChar(blockPos, chars) { return chars.indexOf(charAt(blockPos)) >= 0; }

    function isWall(blockPos) { return isChar(blockPos, '*'); }

    function isFree(blockPos) { return isChar(blockPos, 'C '); }

    function blockCorner(blockPos) {
      function blockToPixel(block) {
        var fullBlocks = Math.floor(block / 2);
        return fullBlocks * fullBlock + ((block % 2 == 1) ? wall : 0);
      }
      return Graphics.Point(blockToPixel(blockPos.x) + position.x, blockToPixel(blockPos.y) + position.y);
    }

    function blockCenter(blockPos) {
      return blockCorner(blockPos).add(sizeOf(blockPos).times(.5))
    }

    function sizeOf(blockPos) {
      function size(x) { return ( x % 2 == 0) ? wall : blockSize; }
      return Graphics.Point(size(blockPos.x), size(blockPos.y));
    }

    function toBlock(x) {
      var fullBlocks = Math.floor(x / fullBlock),
          remainder = x - (fullBlocks * fullBlock),
          wallToAdd = ((remainder >= wall) ? 1 : 0);
      return fullBlocks * 2 + wallToAdd;
    }

    function toBlockX(x) {
      return toBlock(x - position.x)
    }

    function toBlockY(y) {
      return toBlock(y - position.y)
    }

    function toBlocks(pixelPos) {
      return Point(toBlockX(pixelPos.x), toBlockY(pixelPos.y))
    }

    function forEachBlock(fn) {
      for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          var result = fn(Point(x, y))
          if (result) { return result; }
        }
      }
    }

    function randomBlock() {
      return Point(randomInt(width), randomInt(height))
    }

    function render(r) {
      return renderWith(r, function(block) {
        if (!isChar(block, ' ')) {
          return r.text(blockCenter(block).x, blockCenter(block).y, charAt(block)).attr({ fill : '#f00', 'font-family' : 'Courier New, Courier', 'font-size' : blockSize * 1.7})
        }
      });
    }

    function renderWith(r, blockRenderer) {
      var elements = r.set()
      forEachBlock(function(block) {
        var element = blockRenderer(block);
        element && elements.push(element);
      })
      return elements
    }

    return { isChar : isChar,
      toBlockX : toBlockX,
      toBlockY : toBlockY,
      blockCorner : blockCorner,
      blockCenter : blockCenter,
      forEachBlock : forEachBlock,
      sizeOf : sizeOf,
      randomBlock : randomBlock ,
      render : render,
      renderWith : renderWith
    };
  }

  function Rectangle(x, y, width, height) {
    return {x : x, y : y, width : width, height : height}
  }

}.call(this));
