'use strict';

// Shim in iterator support
var $iterator$ = (typeof global.Symbol === 'function' && global.Symbol.iterator) ||
  '_es6shim_iterator_';
// Bug for mozilla version
if (global.Set && typeof new global.Set()['@@iterator'] === 'function') {
  $iterator$ = '@@iterator';
}

module.exports = $iterator$;
