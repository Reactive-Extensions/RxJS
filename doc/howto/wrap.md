# Wrap an Existing API with RxJS



Final result

```js

function watchPosition(geolocationOptions) {
    return observableCreate(function (observer) {
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