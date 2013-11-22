# How do I create a custom event emitter? #

Publish/Subscribe is a common pattern within JavaScript applications.  The idea is that you have a publisher that emits events and you have consumers which register their interest in a given event.  Typically you may see something like the following where you listen for a 'data' event and then the event emitter publishes data to it.

```js
var emitter = new Emitter();

function logData(data) {
	console.log('data: ' + data);
}

emitter.on('data', logData);

emitter.emit('data', 'foo');
// => data: foo

// Destroy handler
emitter.off('data', logData);
```

How might one implement this using the Reactive Extensions for JavaScript?  Using an `Rx.Subject` will solve this problem easily.  As you may remember, an `Rx.Subject` is both an Observer and Observable, so it handles both publish and subscribe.

```js
var subject = new Rx.Subject();

var subscription = subject.subscribe(function (data) {
	console.log('data: ' + data);
});

subject.onNext('foo');
// => data: foo
```

Now that we have a basic understanding of publish and subscribe through `onNext` and `subscribe`, let's put it to work to handle multiple types of events at once.  First, we'll create an Emitter class which has three main methods, `emit`, `on` and `off` which allows you to emit an event, listen to an event and stop listening to an event.

```js
var hasOwnProp = {}.hasOwnProperty;

function createName (name) {
	return '$' + name;
}

function Emitter() {
	this.subjects = {};
}

Emitter.prototype.emit = function (name, data) {
	var fnName = createName(name);
	this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
	this.subjects[fnName].onNext(data);
};

Emitter.prototype.on = function (name, handler) {
	var fnName = createName(name);
	this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
	this.subjects[fName].subscribe(handler);
};

Emitter.prototype.off = function (name, handler) {
	var fnName = createName(name);
	if (this.subjects[fnName]) {
		this.subjects[fName].dispose();
		delete this.subjects[fName];
	}
};

Emitter.prototype.dispose = function () {
	var subjects = this.subjects;
	for (var prop in subjects) {	
		if (hasOwnProp.call(subjects, prop)) {
			subjects[prop].dispose();
		}
	}

	this.subjects = {};
};
```

Then we can use it much as we did above.  As the call to `subscribe` returns a subscription, we might want to hand that back to the user instead of providing an off method.  So, we could rewrite the above where we call the `on` method to `listen` and we return a subscription handle to the user to stop listening.  

```js
var hasOwnProp = {}.hasOwnProperty;

function createName (name) {
	return '$' + name;
}

function Emitter() {
	this.subjects = {};
}

Emitter.prototype.emit = function (name, data) {
	var fnName = createName(name);
	this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
	this.subjects[fnName].onNext(data);
};

Emitter.prototype.listen = function (name, handler) {
	var fnName = createName(name);
	this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
	return this.subjects[fName].subscribe(handler);
};

Emitter.prototype.dispose = function () {
	var subjects = this.subjects;
	for (var prop in subjects) {	
		if (hasOwnProp.call(subjects, prop)) {
			subjects[prop].dispose();
		}
	}

	this.subjects = {};
};
```

Now we can use this to rewrite our example such as the following:

```js
var emitter = new Emitter();

var subcription = emitter.listen('data', function (data) {
	console.log('data: ' + data);
});

emitter.emit('data', 'foo');
// => data: foo

// Destroy the subscription
subscription.dispose();
```

