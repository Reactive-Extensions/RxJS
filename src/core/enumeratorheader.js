  // Shim in iterator support
  var $iterator$ = (typeof Symbol === 'object' && Symbol.iterator) ||
    '_es6shim_iterator_';
  // Firefox ships a partial implementation using the name @@iterator.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
  // So use that name if we detect it.
  if (root.Set && typeof new root.Set()['@@iterator'] === 'function') {
    $iterator$ = '@@iterator';
  }
  var doneEnumerator = { done: true, value: undefined };
