'use strict';

var $iterator$ = require('./iterator');

module.exports = function isIterable (o) {
  return o && o[$iterator$] !== undefined;
};
