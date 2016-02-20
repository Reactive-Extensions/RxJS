# Implementing Your Own Observable Operators #

You can extend RxJS by adding new operators for operations that are not provided by the base library, or by creating your own implementation of standard query operators to improve readability and performance. Writing a customized version of a standard operator is useful when you want to operate with in-memory objects and when the intended customization does not require a comprehensive view of the query.

## Creating New Operators ##

RxJS offers a full set of operators that cover most of the possible operations on a set of entities. However, you might need an operator to add a particular semantic meaning to your query—especially if you can reuse that same operator several times in your code.  Adding new operators to RxJS is a way to extend its capabilities. However, you can also improve code readability by wrapping existing operators into more specialized and meaningful ones.

For example, let's see how we might implement the [_.where](http://lodash.com/docs#where) method from [Lo-Dash](http://lodash.com/) or [Underscore](http://underscorejs.org/), which takes a set of attributes and does a deep comparison for equality.  We might try implementing this from scratch using the `Rx.Observable.create` method such as the following code.

```js
Rx.Observable.prototype.filterByProperties = function (properties) {
	var source = this,
		comparer = Rx.internals.isEqual;

	return Rx.Observable.create(function (observer) {
		// Our disposable is the subscription from the parent
		return source.subscribe(
			function (data) {

				try {
					var shouldRun = true;

					// Iterate the properties for deep equality
					for (var prop in properties) {
						if (!comparer(properties[prop], data[prop])) {
							shouldRun = false;
							break;
						}
					}
				} catch (e) {
					observer.onError(e);
				}

				if (shouldRun) {
					observer.onNext(data);
				}
			},
			observer.onError.bind(observer),
			observer.onCompleted.bind(observer)
		);
	});
};
```

Many existing operators, such as this, instead could be built using other basic operators for example in this case, `filter` or `where`.  In fact, many existing operators are built using other basic operators. For example, the `flatMap` or `selectMany` operator is built by composing the `map` or `select` and `mergeObservable` operators, as the following code shows.

```js
Rx.Observable.prototype.flatMap = function (selector) {
	return this.map(selector).mergeObservable();
};
```

We could rewrite it as the following to take advantage of already built in operators.

```js
Rx.Observable.prototype.filterByProperties = function (properties) {
	var comparer = Rx.internals.isEqual;

	return this.filter(function (data) {

		// Iterate the properties for deep equality
		for (var prop in properties) {
			if (!comparer(properties[prop], data[prop])) {
				return false;
			}
		}

		return true;
	});
};
```

By reusing existing operators when you build a new one, you can take advantage of the existing performance or exception handling capabilities implemented in the RxJS libraries.  When writing a custom operator, it is good practice not to leave any disposables unused; otherwise, you may find that resources could actually be leaked and cancellation may not work correctly.

## Testing Your New Operator ##

Just because you have implemented a new operator doesn't mean you are finished.  Now, let's write a test to verify its behavior from what we learned in the [Testing and Debugging](testing.md) topic.  We'll reuse the `collectionAssert.assertEqual` from the previous topic so it is not repeated here.

```js
var onNext = Rx.ReactiveTest.onNext,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('filterProperties should yield with match', function () {

    var scheduler = new Rx.TestScheduler();

    var input = scheduler.createHotObservable(
        onNext(210, { 'name': 'curly', 'age': 30, 'quotes': ['Oh, a wise guy, eh?', 'Poifect!'] }),
        onNext(220, { 'name': 'moe', 'age': 40, 'quotes': ['Spread out!', 'You knucklehead!'] }),
        onCompleted(230)
    );

    var results = scheduler.startWithCreate(
        function () {
            return input.filterByProperties({ 'age': 40 });
        }
    );

    collectionAssert.assertEqual(results.messages, [
        onNext(220, { 'name': 'moe', 'age': 40, 'quotes': ['Spread out!', 'You knucklehead!'] }),
        onCompleted(230)
    ]);

    collectionAssert.assertEqual(input.subscriptions, [
    	subscribe(200, 230)
    ]);
});
```

In order for this to be successfully tested, we should check for when there is no data, empty, single matches, multiple matches and so forth.

## See Also ##

**Resources**
- [Testing and Debugging](testing.md)
