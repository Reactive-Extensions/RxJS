  var deprecate = Rx.helpers.deprecate = function (name, alternative) {
    if (console && typeof console.warn === 'function') {
      console.warn('%s is deprecated, use %s instead.', name, alternative, new Error('').stack);
    }
  }
