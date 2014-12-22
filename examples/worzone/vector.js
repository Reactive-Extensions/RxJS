// Originally from https://github.com/raimohanska/worzone

;(function (global) {

  function Point(x, y) {
    return new Vector2D(x, y);
  }

  // Number -> Number -> Vector2D
  function Vector2D(x, y) {
    this.x = x;
    this.y = y;
  }

  Vector2D.prototype = {
    // Vector2D -> Vector2D
    add : function(other) { return new Vector2D(this.x + other.x, this.y + other.y); },
    // Vector2D -> Vector2D
    subtract : function(other) { return new Vector2D(this.x - other.x, this.y - other.y); },
    // Unit -> Number
    getLength : function() { return Math.sqrt(this.x * this.x + this.y * this.y); },
    // Number -> Vector2D
    times : function(multiplier) { return new Vector2D(this.x * multiplier, this.y * multiplier); },
    // Unit -> Vector2D
    invert : function() { return new Vector2D(-this.x, -this.y); },
    // Number -> Vector2D
    withLength : function(newLength) { return this.times(newLength / this.getLength()); },

    rotateRad : function(radians) {
      var length = this.getLength(),
          currentRadians = this.getAngle(),
          resultRadians = radians + currentRadians,
          rotatedUnit = new Vector2D(Math.cos(resultRadians), Math.sin(resultRadians));
      return rotatedUnit.withLength(length);
    },

    // Number -> Vector2D
    rotateDeg : function(degrees) {
      var radians = degrees * 2 * Math.PI / 360;
      return this.rotateRad(radians);
    },

    // Unit -> Number
    getAngle : function() {
      var length = this.getLength(),
          unit = this.withLength(1);
      return Math.atan2(unit.y, unit.x);
    },

    getAngleDeg : function() {
      return this.getAngle() * 360 / (2 * Math.PI);
    },

    floor : function() {
      return new Vector2D(Math.floor(this.x), Math.floor(this.y));
    },

    toString : function() {
      return '(' + x + ', ' + y + ')';
    }
  };

  global.Game = {
    Point: Point,
    Vector2D: Vector2D
  };

}(window));
