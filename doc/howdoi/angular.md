# How do I integrate Angular.js with RxJS? #

[AngularJS](http://angularjs.org/) is a popular MV* framework for JavaScript which covers things such as data binding, controllers as well as things such as dependency injection.  The Reactive Extensions for JavaScript plays well with this framework, and in fact has a dedicated library for interop called [rx.angular.js](https://github.com/Reactive-Extensions/rx.angular.js).  However, if you don't wish to use that, here are some simple ways you can integrate the two together.

## Integration with Scopes

The [`scope`](http://docs.angularjs.org/api/ng.$rootScope.Scope) is an object that refers to the application model. It is an execution context for expressions. Scopes are arranged in hierarchical structure which mimic the DOM structure of the application. Scopes can watch expressions and propagate events.

Scopes provide the ability to observe change mutations on the scope through the [`$watch`](http://docs.angularjs.org/api/ng.$rootScope.Scope#methods_$watch) method.  This is a perfect opportunity to integrate the power of the Reactive Extensions for JavaScript with Angular.  Let's look at a typical usage of `$watch`.

```js
// Get the scope from somewhere
var scope = $rootScope;
scope.name = 'Reactive Extensions';
scope.counter = 0;
 
scope.$watch('name', function(newValue, oldValue) {
  scope.counter = scope.counter + 1;
  scope.oldValue = oldValue;
  scope.newValue = newValue;
});
 
scope.name = 'RxJS';

// Process All the Watchers
scope.$digest();

// See the counter increment
console.log(counter);
// => 1
```

Using the Reactive Extensions for JavaScript, we're able to easily bind to this by wrapping the `$watch` as an observable.  To do this, we'll create an observable sequence using `Rx.Observable.create` which gives us an observer to yield to.  In this case, we'll capture both the old and new values through our listener function.  The `$watch` function returns a function, which when called, ceases the watch expression.

```js
Rx.Observable.$watch = function (scope, watchExpression, objectEquality) {
	return Rx.Observable.create(function (observer) {
		// Create function to handle old and new Value
		function listener (newValue, oldValue) {
			observer.onNext({ oldValue: oldValue, newValue: newValue });
		}

		// Returns function which disconnects the $watch expression
		return scope.$watch(watchExpression, listener, objectEquality);
	});
};
```

Now that we have this, we're able to now take the above example and now add some RxJS goodness to it.

```js
// Get the scope from somewhere
var scope = $rootScope;
scope.name = 'Reactive Extensions';
scope.isLoading = false;
scope.data = [];

// Watch for name change and throttle it for 1 second and then query a service
Rx.Observable.$watch(scope, 'name')
	.throttle(1000) 
	.map(function (e) {
		return e.newValue;
	})
	.do(function () { 
		// Set loading and reset data
		scope.isLoading = true;
		scope.data = [];
	})
	.flatMapLatest(querySomeService)
	.subscribe(function (data) {

		// Set the data
		scope.isLoading = false;
		scope.data = data;
	});
```

## Integration with Deferred/Promise Objects

AngularJS ships a promise/deferred implementation based upon [Kris Kowal's Q](https://github.com/kriskowal/q) called the [`$q`](http://docs.angularjs.org/api/ng.$q) service.  Promises are quite useful in scenarios with one and done asynchronous operations such as querying a service through the [`$http`](http://docs.angularjs.org/api/ng.$http) service.

```js
$http.get('/someUrl')
	.then(successCallback, errCallback);
```

Using the Reactive Extensions for JavaScript, we can also integrate using the `Rx.Observable.fromPromise` bridge available in RxJS version 2.2+.  We simply 

```js
// Query data
var observable = Rx.Observable.fromPromise(
	$http(
		method: 'GET',
		url: 'someurl',
		params: { searchString: $scope.searchString }
	)
);

// Subscribe to data and update UI
observable.subscribe(
	function (data) {
		$scope.data = data;
	},
	function (err) {
		$scope.error = err.message;
	}
);
```

These are just only the beginnings of what you can do with the Reactive Extensions for JavaScript and AngularJS.