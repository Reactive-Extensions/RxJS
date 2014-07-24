### `Rx.Observable.using(resourceFactory, observableFactory)`
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/using.js "View in source") 

 Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.

### Arguments
1. `resourceFactory` *(`Function`)*: Factory function to obtain a resource object.
2. `observableFactory` *(`Scheduler`)*: Factory function to obtain an observable sequence that depends on the obtained resource.

#### Returns
*(`Function`)*: An observable sequence whose lifetime controls the lifetime of the dependent resource object.

#### Example
```js
/* Using an AsyncSubject as a resource which supports the .dispose method */
function DisposableResource(value) {
  this.value = null;
  this.disposed = false;
}

DisposableResource.prototype.getValue = function () {
  if (this.disposed) {
    throw new Error('Object is disposed');
  }
  return this.value;
};

DisposableResource.prototype.dispose = function () {
  if (!this.disposed) {
    this.disposed = true;
    this.value = null;
  }
  console.log('Disposed');
};

var source = Rx.Observable.using(
  function () { return new DisposableResource(42); },
  function (resource) {
    var subject = new AsyncSubject();
    s.onNext(resource.getValue());
    s.onCompleted();
    return subject;
  }
);

var subscription = source.subscribe(
  function (x) {
    console.log('Next: ' + x);
  },
  function (err) {
    console.log('Error: ' + err);   
  },
  function () {
    console.log('Completed');   
  });

// => Next: 42
// => Completed 

subscription.dispose();

// => Disposed
```

### Location

File:
- [/src/core/observable/using.js](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/using.js)

Dist:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js)
- [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js)

Prerequisites:
- None

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-Main`](http://www.nuget.org/packages/RxJS-Main/)

Unit Tests:
- [/tests/observable/using.js](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/using.js)
