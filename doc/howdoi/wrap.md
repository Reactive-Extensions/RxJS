# This is RxJS v 4. [Find the latest version here](https://github.com/reactivex/rxjs)
# Wrap an Existing API with RxJS

One question that often comes up is how can I wrap an existing API into an Observable sequence?  The answer is fairly simple and not a lot of lines of code to make that happen.

To make this a bit more concrete, let's take a familiar HTML5 API like [Geolocation API](http://dev.w3.org/geo/api/spec-source.html), in particular, the `navigator.geolocation.watchPosition` method.

The typical use of this method might be the following where we would hook up an event handler to listen for success and errors on watching the geolocation by using the `navigator.geolocation.watchPosition` method.  When one wishes to terminate listening for geolocation updates, you simply call the `navigator.geolocation.clearWatch` method passing in the watch ID returned from the `watchPosition` method.

```js
function watchPositionChanged(e) {
	// Do something with the coordinates
}

function watchPositionError(e) {
	// Handle position error
}

var watchId = navigator.geolocation.watchPosition(
	watchPositionChanged,
	watchPositionError);

var stopWatching = document.querySelector('#stopWatching');
stopWatching.addEventListener('click', stopWatchingClicked, false);

// Clear watching upon click
function stopWatchingClicked(e) {
	navigator.geolocation.clearWatch(watchId)
}
```

In order to wrap this, we'll need to use the [`Rx.Observable.create`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablecreatesubscribe) method.  From this, we can yield values to the observer or handle the errors.  Let's see how the code might look, creating a watchPosition method which takes geolocation options.

```js
function watchPosition(geolocationOptions) {
    return Rx.Observable.create(function (observer) {
        var watchId = window.navigator.geolocation.watchPosition(
            function successHandler (loc) {
                observer.onNext(loc);
            },
            function errorHandler (err) {
                observer.onError(err);
            },
            geolocationOptions);

        return function () {
            window.navigator.geolocation.clearWatch(watchId);
        };
    });
 }
```

We need to also be aware of ensuring we're not adding too many watchPosition calls as we compose it together with other observable sequences.  To do that, we'll need to utilize the [`publish`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypepublishselector) and [`refCount`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#connectableobservableprototyperefcount) methods from rx.binding.js.

Our final result should look like the following:

```js
function watchPosition(geolocationOptions) {
    return Rx.Observable.create(function (observer) {
        var watchId = window.navigator.geolocation.watchPosition(
            function successHandler (loc) {
                observer.onNext(loc);
            },
            function errorHandler (err) {
                observer.onError(err);
            },
            geolocationOptions);

        return function () {
            window.navigator.geolocation.clearWatch(watchId);
        };
    }).publish().refCount();
 }
```

And now we can consume the geolocation such as:

```js
var source = watchPosition();

var subscription = source.subscribe(
    function (position) {
        console.log('Next:' + position.coords.latitude + ',' + position.coords.longitude);
    },
    function (err) {
        var message = '';
        switch (err.code) {
            case err.PERMISSION_DENIED:
                message = 'Permission denied';
                break;
            case err.POSITION_UNAVAILABLE:
                message = 'Position unavailable';
                break;
            case err.PERMISSION_DENIED_TIMEOUT:
                message = 'Position timeout';
                break;
        }
        console.log('Error: ' + message);
    },
    function () {
        console.log('Completed');
    });
```
