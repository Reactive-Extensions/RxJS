(function (Game) {
  function FigureImage(imgPrefix, animCount, animCycle) {
    imgPrefix = imgPath + imgPrefix
    function flip(img, f) {
      var x = img.attrs.x,
          y = img.attrs.y;
      img.scale(f, 1);
      img.attr({x:x, y:y});
    }
    function rotate(img, absoluteRotation) {
      img.rotate(absoluteRotation, img.attrs.x + img.attrs.width/2, img.attrs.y + img.attrs.height/2);
    }
    return {
      create : function(startPos, radius, r) {
        return r.image(imgPrefix + "-left-1.png", startPos.x - radius, startPos.y - radius, radius * 2, radius * 2)
      },
      animate : function(figure, status) {
        var animationSequence = status
          .bufferWithCount(animCycle)
          .scan(1, function(prev) { return prev % animCount + 1; });

        var animation = status.combineLatest(animationSequence, function(status, index) {
          return { image :  imgPrefix + "-left-" + index + ".png", dir : status.dir }
        });

        animation.subscribe(function(anim) {
          if(figure.removed) { return; }
          figure.attr({src : anim.image})
          if(anim.dir == left) {
            // when facing left, use the pic as is
            flip(figure, 1)
            rotate(figure, 0)
          } else {
            // when facing any other way, flip the pic and then rotate it
            flip(figure, -1)
            rotate(figure, anim.dir.getAngleDeg())
          }
        })
      }
    }
  }

  Game.FigureImage = FigureImage;
}(window.Game));