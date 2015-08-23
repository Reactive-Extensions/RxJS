/**
 *  Projects each element of an observable sequence into a new sequence of observable sequences by incorporating the element's index and then
 *  transforms an observable sequence of observable sequences into an observable sequence which performs a exclusive waiting for the first to finish before subscribing to another observable.
 * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
 * @param {Any} [thisArg] Object to use as this when executing callback.
 * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source producing an Observable of Observable sequences
 *  and that at any point in time performs a exclusive waiting for the first to finish before subscribing to another observable.
 */
observableProto.selectSwitchFirst = observableProto.flatMapFirst = function (selector, thisArg) {
  return this.map(selector, thisArg).switchFirst();
};
