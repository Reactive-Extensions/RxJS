  var deprecate = Rx.helpers.deprecate = function (name, alternative) {
    if (console && typeof console.warn === 'function') {
      console.warn(name + ' is deprecated, use ' + alternative + ' instead.', new Error('').stack);
    }
  }
