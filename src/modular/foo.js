var $iterator$ = '@@iterator';

function repeatValue(value, count) {
  count == null && (count = -1);
  return {
    '@@iterator': function () {
      return {
        remaining: count,
        next: function () {
          if (this.remaining === 0) { return { done: true, value: undefined }; }
          if (this.remaining > 0) { this.remaining--; }
          return { done: false, value: value };
        }
      };
    }
  };
}

var e = repeatValue(42, 10)[$iterator$]();
var result;
do {
  result = e.next();
  console.log(result.value);
} while (!result.done);

function createDisposable(state) {
  return {
    isDisposed: false,
    dispose: function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        state.isDisposed = true;
      }
    }
  };
}

var o = { isDisposed: false };
var d = createDisposable(o);
console.log(o.isDisposed);
d.dispose();
console.log(o.isDisposed);
d.dispose();
console.log(o.isDisposed);
