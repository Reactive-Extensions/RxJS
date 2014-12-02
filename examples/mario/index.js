(function () {
  var slice = Array.prototype.slice,
      Observable = Rx.Observable;

  var dom = {},
      events = ['resize','keyup','keydown'];
  events.forEach(function (event) {
    dom[event] = function (element) {
      return Observable.fromEvent(element, event);
    };
  });

  // compose functions
  function compose() {
    var args = slice.call(arguments, 0);
    return args.reduce(function(f, g) {
      return function () {
        return f(g.apply(null, arguments));
      };
    });
  }

  // update record
  function update(r, u) {
    if (typeof u === 'function') {
      return update(r, u(r));
    }
    return Object.assign({}, r, u);
  }

  // Environment functions

  function jump(dt) {
    return function (m) {
      return dt.y > 0 && m.y === 0 ?
        update(m, {vy: 5}) :
        m;
    };
  }

  function gravity(t) {
    return function (m) {
      return m.y > 0 ?
        update(m, {vy: m.vy - t / 4}) :
        m;
    };
  }

  function physics(t) {
    return function (m) {
      return update(m, {
        x: m.x + t * m.vx,
        y: Math.max(0, m.y + t * m.vy)
      });
    };
  }

  function walk(dt) {
    return function (m) {
      var dir = m.dir;
      if (dt.x < 0) {
        dir = 'left';
      } else if (dt.x > 0) {
        dir = 'right';
      }

      return update(m, {
        vx: dt.x,
        dir: dir
      });
    };
  }

  function step(dt, keys) {
    return compose(jump(keys), gravity(dt), walk(keys), physics(dt));
  }

  // Render
  function render(dimensions, mario, marioImage) {
    var verb = 'stand';
    if (mario.y > 0) {
      verb = 'jump';
    } else if (mario.vx !== 0) {
      verb = 'walk';
    }

    var src = 'img/' + verb + '-' + mario.dir + '.gif';

    // gif animations reset on src assignment
    if(marioImage.name !== src) {
      marioImage.src = src;
      marioImage.name = src;
    }

    marioImage.style.left = (mario.x + dimensions.width / 2) + 'px';
    marioImage.style.top = (dimensions.height - 91 - mario.y) + 'px';
  }

  // Elm's FPS
  function fps(v) {
    return Observable.interval(1000 / v)
      .timestamp()
      .bufferWithCount(2, 1)
      .map(function (w) { return w[1].timestamp - w[0].timestamp; })
      .share();
  }

  function keysBuffer(buffer, e) {
    var result = buffer.slice(0);
    if (e.type === 'keydown') {
      if(buffer.indexOf(e.keyCode) === -1) {
        result.push(e.keyCode);
      }
    } else {
      result = buffer.filter(function (keyCode) {return keyCode !== e.keyCode; });
    }

    return result;
  }

  // Set up the environment

  var dimensions = dom.resize(window)
    .map(function (e) {
      return {
        width: e.target.innerWidth,
        height: e.target.innerHeight
      };
    })
    .shareValue({
      width: window.innerWidth,
      height: window.innerHeight
    });

  var keyDowns = dom.keydown(document);
  var keyUps   = dom.keyup(document);

  // array of currently pressed keys
  var keyboard = keyDowns
    .merge(keyUps)
    .scan([], keysBuffer)
    .distinctUntilChanged()
    .shareValue([]);

  // LEFT: 37
  // UP: 38
  // RIGHT: 39
  // UP: 40
  var arrowsMap = {
    37: {x: -1, y: 0},
    39: {x: 1, y: 0},
    38: {x: 0, y: 1},
    40: {x: 0, y: -1}
  };

  // Elm's Keyboard.arrows
  var arrows = keyboard
    .map(function (keys) {
      return keys
        .filter(function (key) { return key in arrowsMap; })
        .reduce(function (agg, key) {
          return update(agg, function (prev) {
            return {
              x: prev.x + arrowsMap[key].x,
              y: prev.y + arrowsMap[key].y
            };
          });
        }, {x: 0, y: 0});
    });

  var deltas = fps(60).map(function (t) { return t / 20; });
  var input = deltas
    .combineLatest(arrows, function (dt, keys) { return { dt: dt, keys: keys }; })
    .sample(deltas);

  var marioImage = document.getElementById('mario');

  // mario
  var mario = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    dir: 'right'
  };

  var marios = input.scan(mario, function (m, c) {
    return step(c.dt, c.keys)(m);
  });

  marios
    .combineLatest(dimensions, function (mario, dimensions) {
      return { mario: mario, dimensions: dimensions };
    })
    .subscribe(
      function (c) { render(c.dimensions, c.mario, marioImage); },
      function (err) { console.log(err); }
    );
}());
