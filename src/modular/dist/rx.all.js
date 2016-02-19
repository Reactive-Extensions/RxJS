(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rx"] = factory();
	else
		root["rx"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Observer = __webpack_require__(1);

	Observer.addToObject({
	  create: __webpack_require__(2)
	});

	var Observable = __webpack_require__(8);

	Observable.addToObject({
	  amb: __webpack_require__(10),
	  bindCallback: __webpack_require__(29),
	  bindNodeCallback: __webpack_require__(36),
	  case: __webpack_require__(37),
	  catch: __webpack_require__(42),
	  combineLatest: __webpack_require__(45),
	  concat: __webpack_require__(47),
	  create: __webpack_require__(48),
	  defer: __webpack_require__(38),
	  empty: __webpack_require__(41),
	  forkJoin: __webpack_require__(49),
	  from: __webpack_require__(50),
	  fromArray: __webpack_require__(53),
	  fromEvent: __webpack_require__(54),
	  fromEventPattern: __webpack_require__(55),
	  fromPromise: __webpack_require__(24),
	  generate: __webpack_require__(60),
	  generateAbsolute: __webpack_require__(61),
	  generateRelative: __webpack_require__(62),
	  interval: __webpack_require__(63),
	  just: __webpack_require__(64),
	  merge: __webpack_require__(65),
	  never: __webpack_require__(28),
	  of: __webpack_require__(67),
	  ofScheduled: __webpack_require__(68),
	  onErrorResumeNext: __webpack_require__(69),
	  pairs: __webpack_require__(70),
	  range: __webpack_require__(71),
	  repeat: __webpack_require__(72),
	  sequenceEqual: __webpack_require__(74),
	  start: __webpack_require__(76),
	  startAsync: __webpack_require__(78),
	  throw: __webpack_require__(39),
	  timer: __webpack_require__(79),
	  toAsync: __webpack_require__(77),
	  when: __webpack_require__(80),
	  using: __webpack_require__(135),
	  zip: __webpack_require__(136)
	});

	Observable.addToPrototype({
	  amb: __webpack_require__(10),
	  and: __webpack_require__(137),
	  asObservable: __webpack_require__(34),
	  average: __webpack_require__(144),
	  buffer: __webpack_require__(145),
	  bufferCount: __webpack_require__(155),
	  bufferTime: __webpack_require__(158),
	  bufferTimeOrCount: __webpack_require__(160),
	  catch: __webpack_require__(42),
	  catchHandler: __webpack_require__(162),
	  combineLatest: __webpack_require__(45),
	  concat: __webpack_require__(47),
	  concatAll: __webpack_require__(163),
	  count: __webpack_require__(165),
	  debounce: __webpack_require__(166),
	  defaultIfEmpty: __webpack_require__(167),
	  delay: __webpack_require__(168),
	  delaySubscription: __webpack_require__(170),
	  dematerialize: __webpack_require__(171),
	  distinct: __webpack_require__(172),
	  distinctUntilChanged: __webpack_require__(173),
	  do: __webpack_require__(174),
	  every: __webpack_require__(175),
	  filter: __webpack_require__(156),
	  finally: __webpack_require__(176),
	  find: __webpack_require__(177),
	  findIndex: __webpack_require__(179),
	  first: __webpack_require__(180),
	  flatMap: __webpack_require__(146),
	  flatMapLatest: __webpack_require__(181),
	  forkJoin: __webpack_require__(49),
	  groupJoin: __webpack_require__(152),
	  ignoreElements: __webpack_require__(183),
	  includes: __webpack_require__(184),
	  indexOf: __webpack_require__(185),
	  isEmpty: __webpack_require__(186),
	  join: __webpack_require__(187),
	  last: __webpack_require__(188),
	  lastIndexOf: __webpack_require__(189),
	  map: __webpack_require__(190),
	  materialize: __webpack_require__(142),
	  max: __webpack_require__(191),
	  maxBy: __webpack_require__(192),
	  merge: __webpack_require__(65),
	  mergeAll: __webpack_require__(66),
	  mergeConcat: __webpack_require__(164),
	  min: __webpack_require__(195),
	  minBy: __webpack_require__(196),
	  multicast: __webpack_require__(58),
	  observeOn: __webpack_require__(197),
	  onErrorResumeNext: __webpack_require__(69),
	  pairwise: __webpack_require__(200),
	  partition: __webpack_require__(201),
	  pluck: __webpack_require__(202),
	  publish: __webpack_require__(56),
	  publishLast: __webpack_require__(203),
	  publishValue: __webpack_require__(204),
	  reduce: __webpack_require__(206),
	  repeat: __webpack_require__(73),
	  repeatWhen: __webpack_require__(207),
	  replay: __webpack_require__(208),
	  retry: __webpack_require__(210),
	  retryWhen: __webpack_require__(211),
	  sample: __webpack_require__(212),
	  scan: __webpack_require__(213),
	  sequenceEqual: __webpack_require__(74),
	  share: __webpack_require__(214),
	  shareReplay: __webpack_require__(215),
	  shareValue: __webpack_require__(216),
	  skip: __webpack_require__(217),
	  skipLast: __webpack_require__(218),
	  skipLastTime: __webpack_require__(219),
	  skipUntil: __webpack_require__(220),
	  skipUntilTime: __webpack_require__(221),
	  skipWhile: __webpack_require__(222),
	  slice: __webpack_require__(223),
	  subscribeOn: __webpack_require__(224),
	  some: __webpack_require__(226),
	  sum: __webpack_require__(227),
	  switch: __webpack_require__(182),
	  switchFirst: __webpack_require__(228),
	  take: __webpack_require__(154),
	  takeLastBuffer: __webpack_require__(229),
	  takeLastBufferTime: __webpack_require__(230),
	  lastLastTime: __webpack_require__(231),
	  takeUntil: __webpack_require__(232),
	  takeUntilTime: __webpack_require__(233),
	  takeWhile: __webpack_require__(234),
	  tap: __webpack_require__(174),
	  thenDo: __webpack_require__(235),
	  throttle: __webpack_require__(236),
	  timeInterval: __webpack_require__(237),
	  timestamp: __webpack_require__(169),
	  toArray: __webpack_require__(238),
	  toMap: __webpack_require__(239),
	  toPromise: __webpack_require__(240),
	  toSet: __webpack_require__(241),
	  transduce: __webpack_require__(242),
	  window: __webpack_require__(150),
	  windowCount: __webpack_require__(157),
	  windowTime: __webpack_require__(159),
	  windowTimeOrCount: __webpack_require__(161),
	  withLatestFrom: __webpack_require__(243),
	  zip: __webpack_require__(136),
	  zipIterable: __webpack_require__(244)
	});

	var Subject = __webpack_require__(57);
	Subject.addToObject({
	  create: __webpack_require__(245)
	});

	var Rx = {
	  BinaryDisposable: __webpack_require__(23),
	  CompositeDisposable: __webpack_require__(18),
	  Disposable: __webpack_require__(12),
	  NAryDisposable: __webpack_require__(43),
	  SerialDisposable: __webpack_require__(44),
	  SingleAssignmentDisposable: __webpack_require__(14),

	  Scheduler: __webpack_require__(17),

	  Observer: Observer,
	  Observable: Observable,

	  AsyncSubject: __webpack_require__(30),
	  BehaviorSubject: __webpack_require__(205),
	  ReplaySubject: __webpack_require__(209),
	  Subject: Subject
	};

	module.exports = Rx;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Supports push-style iteration over an observable sequence.
	 */

	function Observer() {}

	Observer.addToObject = function (operators) {
	  Object.keys(operators).forEach(function (operator) {
	    Observer[operator] = operators[operator];
	  });
	};

	Observer.addToPrototype = function (operators) {
	  Object.keys(operators).forEach(function (operator) {
	    Observer.prototype[operator] = function () {
	      var args = [this];
	      args.push.apply(args, arguments);
	      return operators[operator].apply(null, args);
	    };
	  });
	};

	module.exports = Observer;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var noop = __webpack_require__(3);
	var AnonymousObserver = __webpack_require__(4);

	function throwError(e) {
	  throw e;
	}

	/**
	 *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
	 * @param {Function} [onNext] Observer's OnNext action implementation.
	 * @param {Function} [onError] Observer's OnError action implementation.
	 * @param {Function} [onCompleted] Observer's OnCompleted action implementation.
	 * @returns {Observer} The observer object implemented using the given actions.
	 */
	module.exports = function (onNext, onError, onCompleted) {
	  return new AnonymousObserver(onNext || noop, onError || throwError, onCompleted || noop);
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function noop() {};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AbstractObserver = __webpack_require__(5);
	var inherits = __webpack_require__(6);

	/**
	 * Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
	 * @param {Any} onNext Observer's OnNext action implementation.
	 * @param {Any} onError Observer's OnError action implementation.
	 * @param {Any} onCompleted Observer's OnCompleted action implementation.
	 */
	function AnonymousObserver(onNext, onError, onCompleted) {
	  AbstractObserver.call(this);
	  this._onNext = onNext;
	  this._onError = onError;
	  this._onCompleted = onCompleted;
	}

	inherits(AnonymousObserver, AbstractObserver);

	/**
	 * Calls the onNext action.
	 * @param {Any} value Next element in the sequence.
	 */
	AnonymousObserver.prototype.next = function (value) {
	  this._onNext(value);
	};

	/**
	 * Calls the onError action.
	 * @param {Any} error The error that has occurred.
	 */
	AnonymousObserver.prototype.error = function (error) {
	  this._onError(error);
	};

	/**
	 *  Calls the onCompleted action.
	 */
	AnonymousObserver.prototype.completed = function () {
	  this._onCompleted();
	};

	module.exports = AnonymousObserver;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Observer = __webpack_require__(1);
	var inherits = __webpack_require__(6);
	var NotImplementedError = __webpack_require__(7).NotImplementedError;

	function notImplemented() {
	  throw new NotImplementedError();
	}

	function AbstractObserver() {
	  this.isStopped = false;
	  Observer.call(this);
	}

	inherits(AbstractObserver, Observer);

	// Must be implemented by other observers
	AbstractObserver.prototype.next = notImplemented;
	AbstractObserver.prototype.error = notImplemented;
	AbstractObserver.prototype.completed = notImplemented;

	AbstractObserver.prototype.onNext = function (value) {
	  if (!this.isStopped) {
	    this.next(value);
	  }
	};

	AbstractObserver.prototype.onError = function (error) {
	  if (!this.isStopped) {
	    this.isStopped = true;
	    this.error(error);
	  }
	};

	AbstractObserver.prototype.onCompleted = function () {
	  if (!this.isStopped) {
	    this.isStopped = true;
	    this.completed();
	  }
	};

	AbstractObserver.prototype.dispose = function () {
	  this.isStopped = true;
	};

	AbstractObserver.prototype.fail = function (e) {
	  if (!this.isStopped) {
	    this.isStopped = true;
	    this.error(e);
	    return true;
	  }

	  return false;
	};

	module.exports = AbstractObserver;

/***/ },
/* 6 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	function EmptyError() {
	  this.message = 'Sequence contains no elements.';
	  Error.call(this);
	}
	EmptyError.prototype = Object.create(Error.prototype);
	EmptyError.prototype.name = 'EmptyError';

	function ObjectDisposedError() {
	  this.message = 'Object has been disposed';
	  Error.call(this);
	}
	ObjectDisposedError.prototype = Object.create(Error.prototype);
	ObjectDisposedError.prototype.name = 'ObjectDisposedError';

	function ArgumentOutOfRangeError() {
	  this.message = 'Argument out of range';
	  Error.call(this);
	}
	ArgumentOutOfRangeError.prototype = Object.create(Error.prototype);
	ArgumentOutOfRangeError.prototype.name = 'ArgumentOutOfRangeError';

	function NotSupportedError(message) {
	  this.message = message || 'This operation is not supported';
	  Error.call(this);
	}
	NotSupportedError.prototype = Object.create(Error.prototype);
	NotSupportedError.prototype.name = 'NotSupportedError';

	function NotImplementedError(message) {
	  this.message = message || 'This operation is not implemented';
	  Error.call(this);
	}
	NotImplementedError.prototype = Object.create(Error.prototype);
	NotImplementedError.prototype.name = 'NotImplementedError';

	function CompositeError(errors) {
	  this.innerErrors = errors;
	  this.message = 'This contains multiple errors. Check the innerErrors';
	  Error.call(this);
	}

	CompositeError.prototype = Object.create(Error.prototype);
	CompositeError.prototype.name = 'CompositeError';

	module.exports = {
	  CompositeError: CompositeError,
	  EmptyError: EmptyError,
	  ObjectDisposedError: ObjectDisposedError,
	  ArgumentOutOfRangeError: ArgumentOutOfRangeError,
	  NotSupportedError: NotSupportedError,
	  NotImplementedError: NotImplementedError
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var create = __webpack_require__(2);
	var isFunction = __webpack_require__(9);

	function Observable() {}

	/**
	* Determines whether the given object is an Observable
	* @param {Any} An object to determine whether it is an Observable
	* @returns {Boolean} true if an Observable, else false.
	*/
	Observable.isObservable = function (o) {
	  return o && isFunction(o.subscribe);
	};

	/**
	 *  Subscribes an o to the observable sequence.
	 *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
	 *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
	 *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
	 *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
	 */
	Observable.prototype.subscribe = function (oOrOnNext, onError, onCompleted) {
	  return this._subscribe(typeof oOrOnNext === 'object' ? oOrOnNext : create(oOrOnNext, onError, onCompleted));
	};

	/**
	 * Subscribes to the next value in the sequence with an optional "this" argument.
	 * @param {Function} onNext The function to invoke on each element in the observable sequence.
	 * @param {Any} [thisArg] Object to use as this when executing callback.
	 * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	 */
	Observable.prototype.subscribeOnNext = function (onNext, thisArg) {
	  return this._subscribe(create(typeof thisArg !== 'undefined' ? function (x) {
	    onNext.call(thisArg, x);
	  } : onNext));
	};

	/**
	 * Subscribes to an exceptional condition in the sequence with an optional "this" argument.
	 * @param {Function} onError The function to invoke upon exceptional termination of the observable sequence.
	 * @param {Any} [thisArg] Object to use as this when executing callback.
	 * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	 */
	Observable.prototype.subscribeOnError = function (onError, thisArg) {
	  return this._subscribe(create(null, typeof thisArg !== 'undefined' ? function (e) {
	    onError.call(thisArg, e);
	  } : onError));
	};

	/**
	 * Subscribes to the next value in the sequence with an optional "this" argument.
	 * @param {Function} onCompleted The function to invoke upon graceful termination of the observable sequence.
	 * @param {Any} [thisArg] Object to use as this when executing callback.
	 * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	 */
	Observable.prototype.subscribeOnCompleted = function (onCompleted, thisArg) {
	  return this._subscribe(create(null, null, typeof thisArg !== 'undefined' ? function () {
	    onCompleted.call(thisArg);
	  } : onCompleted));
	};

	Observable.addToObject = function (operators) {
	  Object.keys(operators).forEach(function (operator) {
	    Observable[operator] = operators[operator];
	  });
	};

	Observable.addToPrototype = function (operators) {
	  Object.keys(operators).forEach(function (operator) {
	    Observable.prototype[operator] = function () {
	      var args = [this];
	      args.push.apply(args, arguments);
	      return operators[operator].apply(null, args);
	    };
	  });
	};

	module.exports = Observable;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
	  var isFn = function (value) {
	    return typeof value === 'function' || false;
	  };

	  // fallback for older versions of Chrome and Safari
	  if (isFn(/x/)) {
	    isFn = function (value) {
	      return typeof value === 'function' && Object.prototype.toString.call(value) === '[object Function]';
	    };
	  }
	  return isFn;
	}();

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var BinaryDisposable = __webpack_require__(23);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var never = __webpack_require__(28);
	var inherits = __webpack_require__(6);

	var LEFT_CHOICE = 'L';
	var RIGHT_CHOICE = 'R';

	function choiceL(state) {
	  if (!state.choice) {
	    state.choice = LEFT_CHOICE;
	    state.rightSubscription.dispose();
	  }
	}

	function choiceR(state) {
	  if (!state.choice) {
	    state.choice = RIGHT_CHOICE;
	    state.leftSubscription.dispose();
	  }
	}

	function LeftObserver(o, state) {
	  this._o = o;
	  this._s = state;
	  AbstractObserver.call(this);
	}

	inherits(LeftObserver, AbstractObserver);

	LeftObserver.prototype.next = function (x) {
	  choiceL(this._s);
	  this._s.choice === LEFT_CHOICE && this._o.onNext(x);
	};

	LeftObserver.prototype.error = function (e) {
	  choiceL(this._s);
	  this._s.choice === LEFT_CHOICE && this._o.onError(e);
	};

	LeftObserver.prototype.completed = function () {
	  choiceL(this._s);
	  this._s.choice === LEFT_CHOICE && this._o.onCompleted();
	};

	function RightObserver(o, state) {
	  this._o = o;
	  this._s = state;
	  AbstractObserver.call(this);
	}

	inherits(RightObserver, AbstractObserver);

	RightObserver.prototype.next = function (x) {
	  choiceR(this._s);
	  this._s.choice === RIGHT_CHOICE && this._o.onNext(x);
	};

	RightObserver.prototype.error = function (e) {
	  choiceR(this._s);
	  this._s.choice === RIGHT_CHOICE && this._o.onError(e);
	};

	RightObserver.prototype.completed = function () {
	  choiceR(this._s);
	  this._s.choice === RIGHT_CHOICE && this._o.onCompleted();
	};

	function AmbObservable(leftSource, rightSource) {
	  isPromise(leftSource) && (leftSource = fromPromise(leftSource));
	  isPromise(rightSource) && (rightSource = fromPromise(rightSource));

	  this._l = leftSource;
	  this._r = rightSource;
	  ObservableBase.call(this);
	}

	inherits(AmbObservable, ObservableBase);

	AmbObservable.prototype.subscribeCore = function (o) {
	  var state = {
	    choice: null,
	    leftSubscription: new SingleAssignmentDisposable(),
	    rightSubscription: new SingleAssignmentDisposable()
	  };

	  state.leftSubscription.setDisposable(this._l.subscribe(new LeftObserver(o, state)));
	  state.rightSubscription.setDisposable(this._r.subscribe(new RightObserver(o, state)));

	  return new BinaryDisposable(state.leftSubscription, state.rightSubscription);
	};

	/**
	 * Propagates the observable sequence or Promise that reacts first.
	 * @returns {Observable} An observable sequence that surfaces any of the given sequences, whichever reacted first.
	 */
	module.exports = function amb() {
	  var acc = never();
	  for (var i = 0, len = arguments.length; i < len; i++) {
	    acc = new AmbObservable(acc, arguments[i]);
	  }
	  return acc;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var inherits = __webpack_require__(6);
	var isFunction = __webpack_require__(9);
	var errors = __webpack_require__(7);
	var Observable = __webpack_require__(8);
	var Disposable = __webpack_require__(12);
	var AutoDetachObserver = __webpack_require__(13);
	var tryCatchUtils = __webpack_require__(15);
	var tryCatch = tryCatchUtils.tryCatch,
	    thrower = tryCatchUtils.thrower;

	global._Rx || (global._Rx = {});
	if (!global._Rx.currentThreadScheduler) {
	  __webpack_require__(16);
	}

	function fixSubscriber(subscriber) {
	  return subscriber && isFunction(subscriber.dispose) ? subscriber : isFunction(subscriber) ? Disposable.create(subscriber) : Disposable.empty;
	}

	function setDisposable(s, state) {
	  var ado = state[0],
	      self = state[1];
	  var sub = tryCatch(self.subscribeCore).call(self, ado);
	  if (sub === global._Rx.errorObj && !ado.fail(sub.e)) {
	    thrower(sub.e);
	  }
	  ado.setDisposable(fixSubscriber(sub));
	}

	function ObservableBase() {
	  Observable.call(this);
	}

	inherits(ObservableBase, Observable);

	ObservableBase.prototype._subscribe = function (o) {
	  var ado = new AutoDetachObserver(o),
	      state = [ado, this];

	  if (global._Rx.currentThreadScheduler.scheduleRequired()) {
	    global._Rx.currentThreadScheduler.schedule(state, setDisposable);
	  } else {
	    setDisposable(null, state);
	  }
	  return ado;
	};

	ObservableBase.prototype.subscribeCore = function () {
	  throw new errors.NotImplementedError();
	};

	module.exports = ObservableBase;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var noop = __webpack_require__(3);
	var isFunction = __webpack_require__(9);
	var ObjectDisposedError = __webpack_require__(7).ObjectDisposedError;

	/**
	 * Provides a set of static methods for creating Disposables.
	 * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
	 */
	function Disposable(action) {
	  this.isDisposed = false;
	  this.action = action || noop;
	}

	/** Performs the task of cleaning up resources. */
	Disposable.prototype.dispose = function () {
	  if (!this.isDisposed) {
	    this.action();
	    this.isDisposed = true;
	  }
	};

	/**
	 * Creates a disposable object that invokes the specified action when disposed.
	 * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
	 * @return {Disposable} The disposable object that runs the given action upon disposal.
	 */
	Disposable.create = function (action) {
	  return new Disposable(action);
	};

	/**
	 * Gets the disposable that does nothing when disposed.
	 */
	Disposable.empty = { dispose: noop };

	/**
	 * Validates whether the given object is a disposable
	 * @param {Object} Object to test whether it has a dispose method
	 * @returns {Boolean} true if a disposable object, else false.
	 */
	Disposable.isDisposable = function (d) {
	  return d && isFunction(d.dispose);
	};

	Disposable.checkDisposed = function (disposable) {
	  if (disposable.isDisposed) {
	    throw new ObjectDisposedError();
	  }
	};

	Disposable._fixup = function (result) {
	  return Disposable.isDisposable(result) ? result : Disposable.empty;
	};

	module.exports = Disposable;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var AbstractObserver = __webpack_require__(5);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var inherits = __webpack_require__(6);
	var tryCatchUtils = __webpack_require__(15);
	var tryCatch = tryCatchUtils.tryCatch,
	    thrower = tryCatchUtils.thrower;

	function AutoDetachObserver(observer) {
	  AbstractObserver.call(this);
	  this.observer = observer;
	  this.m = new SingleAssignmentDisposable();
	}

	inherits(AutoDetachObserver, AbstractObserver);

	AutoDetachObserver.prototype.next = function (value) {
	  var result = tryCatch(this.observer.onNext).call(this.observer, value);
	  if (result === global._Rx.errorObj) {
	    this.dispose();
	    thrower(result.e);
	  }
	};

	AutoDetachObserver.prototype.error = function (err) {
	  var result = tryCatch(this.observer.onError).call(this.observer, err);
	  this.dispose();
	  result === global._Rx.errorObj && thrower(result.e);
	};

	AutoDetachObserver.prototype.completed = function () {
	  var result = tryCatch(this.observer.onCompleted).call(this.observer);
	  this.dispose();
	  result === global._Rx.errorObj && thrower(result.e);
	};

	AutoDetachObserver.prototype.setDisposable = function (value) {
	  this.m.setDisposable(value);
	};
	AutoDetachObserver.prototype.getDisposable = function () {
	  return this.m.getDisposable();
	};

	AutoDetachObserver.prototype.dispose = function () {
	  AbstractObserver.prototype.dispose.call(this);
	  this.m.dispose();
	};

	module.exports = AutoDetachObserver;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	function SingleAssignmentDisposable() {
	  this.isDisposed = false;
	  this._current = null;
	}

	SingleAssignmentDisposable.prototype.getDisposable = function () {
	  return this._current;
	};

	SingleAssignmentDisposable.prototype.setDisposable = function (value) {
	  if (this._current) {
	    throw new Error('Disposable has already been assigned');
	  }
	  var shouldDispose = this.isDisposed;
	  !shouldDispose && (this._current = value);
	  shouldDispose && value && value.dispose();
	};

	SingleAssignmentDisposable.prototype.dispose = function () {
	  if (!this.isDisposed) {
	    this.isDisposed = true;
	    var old = this._current;
	    this._current = null;
	    old && old.dispose();
	  }
	};

	module.exports = SingleAssignmentDisposable;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var isFunction = __webpack_require__(9);

	global._Rx || (global._Rx = {});
	var errorObj = global._Rx.errorObj = { e: {} };

	function tryCatcherGen(tryCatchTarget) {
	  return function tryCatcher() {
	    try {
	      return tryCatchTarget.apply(this, arguments);
	    } catch (e) {
	      errorObj.e = e;
	      return errorObj;
	    }
	  };
	}

	function tryCatch(fn) {
	  if (!isFunction(fn)) {
	    throw new TypeError('fn must be a function');
	  }
	  return tryCatcherGen(fn);
	}

	function thrower(e) {
	  throw e;
	}

	module.exports = {
	  tryCatch: tryCatch,
	  thrower: thrower
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var Scheduler = __webpack_require__(17);
	var ScheduledItem = __webpack_require__(20);
	var PriorityQueue = __webpack_require__(22);
	var tryCatchUtils = __webpack_require__(15);
	var tryCatch = tryCatchUtils.tryCatch,
	    thrower = tryCatchUtils.thrower;
	var inherits = __webpack_require__(6);

	function CurrentThreadScheduler() {
	  Scheduler.call(this);
	}

	CurrentThreadScheduler.queue = null;

	inherits(CurrentThreadScheduler, Scheduler);

	function runTrampoline() {
	  while (CurrentThreadScheduler.queue.length > 0) {
	    var item = CurrentThreadScheduler.queue.dequeue();
	    !item.isCancelled() && item.invoke();
	  }
	}

	CurrentThreadScheduler.prototype.schedule = function (state, action) {
	  var si = new ScheduledItem(this, state, action, this.now());

	  if (!CurrentThreadScheduler.queue) {
	    CurrentThreadScheduler.queue = new PriorityQueue(4);
	    CurrentThreadScheduler.queue.enqueue(si);

	    var result = tryCatch(runTrampoline)();
	    CurrentThreadScheduler.queue = null;
	    if (result === global._Rx.errorObj) {
	      thrower(result.e);
	    }
	  } else {
	    CurrentThreadScheduler.queue.enqueue(si);
	  }
	  return si.disposable;
	};

	CurrentThreadScheduler.prototype.scheduleRequired = function () {
	  return !CurrentThreadScheduler.queue;
	};

	global._Rx || (global._Rx = {});
	global._Rx.currentThreadScheduler = new CurrentThreadScheduler();

	Scheduler.currentThread = global._Rx.currentThreadScheduler;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var errors = __webpack_require__(7);
	var Disposable = __webpack_require__(12);
	var CompositeDisposable = __webpack_require__(18);

	function Scheduler() {}

	/** Determines whether the given object is a scheduler */
	Scheduler.isScheduler = function (s) {
	  return s instanceof Scheduler;
	};

	/**
	* Schedules an action to be executed.
	* @param state State passed to the action to be executed.
	* @param {Function} action Action to be executed.
	* @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	*/
	Scheduler.prototype.schedule = function (state, action) {
	  throw new errors.NotImplementedError();
	};

	/**
	* Schedules an action to be executed after dueTime.
	* @param state State passed to the action to be executed.
	* @param {Function} action Action to be executed.
	* @param {Number} dueTime Relative time after which to execute the action.
	* @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	*/
	Scheduler.prototype.scheduleFuture = function (state, dueTime, action) {
	  var dt = dueTime;
	  dt instanceof Date && (dt = dt - this.now());
	  dt = Scheduler.normalize(dt);

	  if (dt === 0) {
	    return this.schedule(state, action);
	  }

	  return this._scheduleFuture(state, dt, action);
	};

	Scheduler.prototype._scheduleFuture = function (state, dueTime, action) {
	  throw new errors.NotImplementedError();
	};

	function PeriodicDisposable(id) {
	  this._id = id;
	  this.isDisposed = false;
	}

	PeriodicDisposable.prototype.dispose = function () {
	  if (!this.isDisposed) {
	    this.isDisposed = true;
	    global.clearInterval(this._id);
	  }
	};

	/**
	 * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
	 * @param {Mixed} state Initial state passed to the action upon the first iteration.
	 * @param {Number} period Period for running the work periodically.
	 * @param {Function} action Action to be executed, potentially updating the state.
	 * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	 */
	Scheduler.prototype.schedulePeriodic = function (state, period, action) {
	  if (typeof global.setInterval === 'undefined') {
	    throw new errors.NotSupportedError();
	  }
	  period = Scheduler.normalize(period);
	  var s = state,
	      id = global.setInterval(function () {
	    s = action(s);
	  }, period);
	  return new PeriodicDisposable(id);
	};

	function invokeRecImmediate(scheduler, pair) {
	  var state = pair[0],
	      action = pair[1],
	      group = new CompositeDisposable();
	  action(state, innerAction);
	  return group;

	  function innerAction(state2) {
	    var isAdded = false,
	        isDone = false;

	    var d = scheduler.schedule(state2, scheduleWork);
	    if (!isDone) {
	      group.add(d);
	      isAdded = true;
	    }

	    function scheduleWork(_, state3) {
	      if (isAdded) {
	        group.remove(d);
	      } else {
	        isDone = true;
	      }
	      action(state3, innerAction);
	      return Disposable.empty;
	    }
	  }
	}

	function invokeRecDate(scheduler, pair) {
	  var state = pair[0],
	      action = pair[1],
	      group = new CompositeDisposable();
	  action(state, innerAction);
	  return group;

	  function innerAction(state2, dueTime1) {
	    var isAdded = false,
	        isDone = false;

	    var d = scheduler.scheduleFuture(state2, dueTime1, scheduleWork);
	    if (!isDone) {
	      group.add(d);
	      isAdded = true;
	    }

	    function scheduleWork(_, state3) {
	      if (isAdded) {
	        group.remove(d);
	      } else {
	        isDone = true;
	      }
	      action(state3, innerAction);
	      return Disposable.empty;
	    }
	  }
	}

	/**
	 * Schedules an action to be executed recursively.
	 * @param {Mixed} state State passed to the action to be executed.
	 * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.
	 * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	 */
	Scheduler.prototype.scheduleRecursive = function (state, action) {
	  return this.schedule([state, action], invokeRecImmediate);
	};

	/**
	 * Schedules an action to be executed recursively after a specified relative or absolute due time.
	 * @param {Mixed} state State passed to the action to be executed.
	 * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
	 * @param {Number | Date} dueTime Relative or absolute time after which to execute the action for the first time.
	 * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	 */
	Scheduler.prototype.scheduleRecursiveFuture = function (state, dueTime, action) {
	  return this.scheduleFuture([state, action], dueTime, invokeRecDate);
	};

	/**
	 * Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions.
	 * @param {Function} handler Handler that's run if an exception is caught. The exception will be rethrown if the handler returns false.
	 * @returns {Scheduler} Wrapper around the original scheduler, enforcing exception handling.
	 */
	Scheduler.prototype.catchError = Scheduler.prototype['catch'] = function (handler) {
	  var CatchScheduler = __webpack_require__(19);
	  return new CatchScheduler(this, handler);
	};

	var defaultNow = function () {
	  return !!Date.now ? Date.now : function () {
	    return +new Date();
	  };
	}();

	/** Gets the current time according to the local machine's system clock. */
	Scheduler.now = defaultNow;

	/** Gets the current time according to the local machine's system clock. */
	Scheduler.prototype.now = defaultNow;

	/**
	 * Normalizes the specified TimeSpan value to a positive value.
	 * @param {Number} timeSpan The time span value to normalize.
	 * @returns {Number} The specified TimeSpan value if it is zero or positive; otherwise, 0
	 */
	Scheduler.normalize = function (timeSpan) {
	  timeSpan < 0 && (timeSpan = 0);
	  return timeSpan;
	};

	module.exports = Scheduler;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Represents a group of disposable resources that are disposed together.
	 * @constructor
	 */

	function CompositeDisposable() {
	  var args = [],
	      i,
	      len;
	  if (Array.isArray(arguments[0])) {
	    args = arguments[0];
	    len = args.length;
	  } else {
	    len = arguments.length;
	    args = new Array(len);
	    for (i = 0; i < len; i++) {
	      args[i] = arguments[i];
	    }
	  }
	  this.disposables = args;
	  this.isDisposed = false;
	  this.length = args.length;
	}

	/**
	 * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
	 * @param {Mixed} item Disposable to add.
	 */
	CompositeDisposable.prototype.add = function (item) {
	  if (this.isDisposed) {
	    item.dispose();
	  } else {
	    this.disposables.push(item);
	    this.length++;
	  }
	};

	/**
	 * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
	 * @param {Mixed} item Disposable to remove.
	 * @returns {Boolean} true if found; false otherwise.
	 */
	CompositeDisposable.prototype.remove = function (item) {
	  var shouldDispose = false;
	  if (!this.isDisposed) {
	    var idx = this.disposables.indexOf(item);
	    if (idx !== -1) {
	      shouldDispose = true;
	      this.disposables.splice(idx, 1);
	      this.length--;
	      item.dispose();
	    }
	  }
	  return shouldDispose;
	};

	/**
	 *  Disposes all disposables in the group and removes them from the group.
	 */
	CompositeDisposable.prototype.dispose = function () {
	  if (!this.isDisposed) {
	    this.isDisposed = true;
	    var len = this.disposables.length,
	        currentDisposables = new Array(len);
	    for (var i = 0; i < len; i++) {
	      currentDisposables[i] = this.disposables[i];
	    }
	    this.disposables = [];
	    this.length = 0;

	    for (i = 0; i < len; i++) {
	      currentDisposables[i].dispose();
	    }
	  }
	};

	module.exports = CompositeDisposable;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var Scheduler = __webpack_require__(17);
	var Disposable = __webpack_require__(12);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var inherits = __webpack_require__(6);
	var tryCatchUtils = __webpack_require__(15);
	var tryCatch = tryCatchUtils.tryCatch,
	    thrower = tryCatchUtils.thrower;

	function CatchScheduler(scheduler, handler) {
	  this._scheduler = scheduler;
	  this._handler = handler;
	  this._recursiveOriginal = null;
	  this._recursiveWrapper = null;
	  Scheduler.call(this);
	}

	inherits(CatchScheduler, Scheduler);

	CatchScheduler.prototype.schedule = function (state, action) {
	  return this._scheduler.schedule(state, this._wrap(action));
	};

	CatchScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
	  return this._scheduler.schedule(state, dueTime, this._wrap(action));
	};

	CatchScheduler.prototype.now = function () {
	  return this._scheduler.now();
	};

	CatchScheduler.prototype._clone = function (scheduler) {
	  return new CatchScheduler(scheduler, this._handler);
	};

	CatchScheduler.prototype._wrap = function (action) {
	  var parent = this;
	  return function (self, state) {
	    var res = tryCatch(action)(parent._getRecursiveWrapper(self), state);
	    if (res === global._Rx.errorObj) {
	      if (!parent._handler(res.e)) {
	        thrower(res.e);
	      }
	      return Disposable.empty;
	    }
	    return Disposable._fixup(res);
	  };
	};

	CatchScheduler.prototype._getRecursiveWrapper = function (scheduler) {
	  if (this._recursiveOriginal !== scheduler) {
	    this._recursiveOriginal = scheduler;
	    var wrapper = this._clone(scheduler);
	    wrapper._recursiveOriginal = scheduler;
	    wrapper._recursiveWrapper = wrapper;
	    this._recursiveWrapper = wrapper;
	  }
	  return this._recursiveWrapper;
	};

	CatchScheduler.prototype.schedulePeriodic = function (state, period, action) {
	  var self = this,
	      failed = false,
	      d = new SingleAssignmentDisposable();

	  d.setDisposable(this._scheduler.schedulePeriodic(state, period, function (state1) {
	    if (failed) {
	      return null;
	    }
	    var res = tryCatch(action)(state1);
	    if (res === global._Rx.errorObj) {
	      failed = true;
	      if (!self._handler(res.e)) {
	        thrower(res.e);
	      }
	      d.dispose();
	      return null;
	    }
	    return res;
	  }));

	  return d;
	};

	module.exports = CatchScheduler;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Disposable = __webpack_require__(12);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var cmp = __webpack_require__(21);

	function ScheduledItem(scheduler, state, action, dueTime, comparer) {
	  this.scheduler = scheduler;
	  this.state = state;
	  this.action = action;
	  this.dueTime = dueTime;
	  this.comparer = comparer || cmp;
	  this.disposable = new SingleAssignmentDisposable();
	}

	ScheduledItem.prototype.invoke = function () {
	  this.disposable.setDisposable(this.invokeCore());
	};

	ScheduledItem.prototype.compareTo = function (other) {
	  return this.comparer(this.dueTime, other.dueTime);
	};

	ScheduledItem.prototype.isCancelled = function () {
	  return this.disposable.isDisposed;
	};

	ScheduledItem.prototype.invokeCore = function () {
	  return Disposable._fixup(this.action(this.scheduler, this.state));
	};

	module.exports = ScheduledItem;

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function comparer(x, y) {
	  if (x > y) {
	    return 1;
	  }
	  if (y > x) {
	    return -1;
	  }
	  return 0;
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	function IndexedItem(id, value) {
	  this.id = id;
	  this.value = value;
	}

	IndexedItem.prototype.compareTo = function (other) {
	  var c = this.value.compareTo(other.value);
	  c === 0 && (c = this.id - other.id);
	  return c;
	};

	function PriorityQueue(capacity) {
	  this.items = new Array(capacity);
	  this.length = 0;
	}

	PriorityQueue.prototype.isHigherPriority = function (left, right) {
	  return this.items[left].compareTo(this.items[right]) < 0;
	};

	PriorityQueue.prototype.percolate = function (index) {
	  if (index >= this.length || index < 0) {
	    return;
	  }
	  var parent = index - 1 >> 1;
	  if (parent < 0 || parent === index) {
	    return;
	  }
	  if (this.isHigherPriority(index, parent)) {
	    var temp = this.items[index];
	    this.items[index] = this.items[parent];
	    this.items[parent] = temp;
	    this.percolate(parent);
	  }
	};

	PriorityQueue.prototype.heapify = function (index) {
	  +index || (index = 0);
	  if (index >= this.length || index < 0) {
	    return;
	  }
	  var left = 2 * index + 1,
	      right = 2 * index + 2,
	      first = index;
	  if (left < this.length && this.isHigherPriority(left, first)) {
	    first = left;
	  }
	  if (right < this.length && this.isHigherPriority(right, first)) {
	    first = right;
	  }
	  if (first !== index) {
	    var temp = this.items[index];
	    this.items[index] = this.items[first];
	    this.items[first] = temp;
	    this.heapify(first);
	  }
	};

	PriorityQueue.prototype.peek = function () {
	  return this.items[0].value;
	};

	PriorityQueue.prototype.removeAt = function (index) {
	  this.items[index] = this.items[--this.length];
	  this.items[this.length] = undefined;
	  this.heapify();
	};

	PriorityQueue.prototype.dequeue = function () {
	  var result = this.peek();
	  this.removeAt(0);
	  return result;
	};

	PriorityQueue.prototype.enqueue = function (item) {
	  var index = this.length++;
	  this.items[index] = new IndexedItem(PriorityQueue.count++, item);
	  this.percolate(index);
	};

	PriorityQueue.prototype.remove = function (item) {
	  for (var i = 0; i < this.length; i++) {
	    if (this.items[i].value === item) {
	      this.removeAt(i);
	      return true;
	    }
	  }
	  return false;
	};

	PriorityQueue.count = 0;

	module.exports = PriorityQueue;

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	function BinaryDisposable(first, second) {
	  this._first = first;
	  this._second = second;
	  this.isDisposed = false;
	}

	BinaryDisposable.prototype.dispose = function () {
	  if (!this.isDisposed) {
	    this.isDisposed = true;
	    var old1 = this._first;
	    this._first = null;
	    old1 && old1.dispose();
	    var old2 = this._second;
	    this._second = null;
	    old2 && old2.dispose();
	  }
	};

	module.exports = BinaryDisposable;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function FromPromiseObservable(p, s) {
	  this._p = p;
	  this._s = s;
	  ObservableBase.call(this);
	}

	inherits(FromPromiseObservable, ObservableBase);

	function scheduleNext(s, state) {
	  var o = state[0],
	      data = state[1];
	  o.onNext(data);
	  o.onCompleted();
	}

	function scheduleError(s, state) {
	  var o = state[0],
	      err = state[1];
	  o.onError(err);
	}

	FromPromiseObservable.prototype.subscribeCore = function (o) {
	  var sad = new SingleAssignmentDisposable(),
	      self = this;

	  this._p.then(function (data) {
	    sad.setDisposable(self._s.schedule([o, data], scheduleNext));
	  }, function (err) {
	    sad.setDisposable(self._s.schedule([o, err], scheduleError));
	  });

	  return sad;
	};

	/**
	* Converts a Promise to an Observable sequence
	* @param {Promise} An ES6 Compliant promise.
	* @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
	*/
	module.exports = function fromPromise(promise, scheduler) {
	  scheduler || (scheduler = global._Rx.defaultScheduler);
	  return new FromPromiseObservable(promise, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {'use strict';

	var Disposable = __webpack_require__(12);
	var BinaryDisposable = __webpack_require__(23);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var Scheduler = __webpack_require__(17);
	var isFunction = __webpack_require__(9);
	var tryCatchUtils = __webpack_require__(15);
	var tryCatch = tryCatchUtils.tryCatch,
	    thrower = tryCatchUtils.thrower;
	var inherits = __webpack_require__(6);

	var scheduleMethod, clearMethod;

	(function () {

	  var nextHandle = 1,
	      tasksByHandle = {},
	      currentlyRunning = false;

	  clearMethod = function (handle) {
	    delete tasksByHandle[handle];
	  };

	  function runTask(handle) {
	    if (currentlyRunning) {
	      global.setTimeout(function () {
	        runTask(handle);
	      }, 0);
	    } else {
	      var task = tasksByHandle[handle];
	      if (task) {
	        currentlyRunning = true;
	        var result = tryCatch(task)();
	        clearMethod(handle);
	        currentlyRunning = false;
	        if (result === global._Rx.errorObj) {
	          thrower(result.e);
	        }
	      }
	    }
	  }

	  var setImmediate = global.setImmediate;

	  function postMessageSupported() {
	    // Ensure not in a worker
	    if (!global.postMessage || global.importScripts) {
	      return false;
	    }
	    var isAsync = false,
	        oldHandler = global.onmessage;
	    // Test for async
	    global.onmessage = function () {
	      isAsync = true;
	    };
	    global.postMessage('', '*');
	    global.onmessage = oldHandler;

	    return isAsync;
	  }

	  // Use in order, setImmediate, nextTick, postMessage, MessageChannel, script readystatechanged, setTimeout
	  if (isFunction(setImmediate)) {
	    scheduleMethod = function (action) {
	      var id = nextHandle++;
	      tasksByHandle[id] = action;
	      setImmediate(function () {
	        runTask(id);
	      });

	      return id;
	    };
	  } else if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
	    scheduleMethod = function (action) {
	      var id = nextHandle++;
	      tasksByHandle[id] = action;
	      process.nextTick(function () {
	        runTask(id);
	      });

	      return id;
	    };
	  } else if (postMessageSupported()) {
	    var MSG_PREFIX = 'ms.rx.schedule' + Math.random();

	    var onGlobalPostMessage = function (event) {
	      // Only if we're a match to avoid any other global events
	      if (typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
	        runTask(event.data.substring(MSG_PREFIX.length));
	      }
	    };

	    global.addEventListener('message', onGlobalPostMessage, false);

	    scheduleMethod = function (action) {
	      var id = nextHandle++;
	      tasksByHandle[id] = action;
	      global.postMessage(MSG_PREFIX + id, '*');
	      return id;
	    };
	  } else if (!!global.MessageChannel) {
	    var channel = new global.MessageChannel();

	    channel.port1.onmessage = function (e) {
	      runTask(e.data);
	    };

	    scheduleMethod = function (action) {
	      var id = nextHandle++;
	      tasksByHandle[id] = action;
	      channel.port2.postMessage(id);
	      return id;
	    };
	  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {

	    scheduleMethod = function (action) {
	      var scriptElement = global.document.createElement('script');
	      var id = nextHandle++;
	      tasksByHandle[id] = action;

	      scriptElement.onreadystatechange = function () {
	        runTask(id);
	        scriptElement.onreadystatechange = null;
	        scriptElement.parentNode.removeChild(scriptElement);
	        scriptElement = null;
	      };
	      global.document.documentElement.appendChild(scriptElement);
	      return id;
	    };
	  } else {
	    scheduleMethod = function (action) {
	      var id = nextHandle++;
	      tasksByHandle[id] = action;
	      global.setTimeout(function () {
	        runTask(id);
	      }, 0);

	      return id;
	    };
	  }
	})();

	/**
	* Gets a scheduler that schedules work via a timed callback based upon platform.
	*/
	function DefaultScheduler() {
	  Scheduler.call(this);
	}

	inherits(DefaultScheduler, Scheduler);

	function scheduleAction(disposable, action, scheduler, state) {
	  return function schedule() {
	    disposable.setDisposable(Disposable._fixup(action(scheduler, state)));
	  };
	}

	function ClearDisposable(method, id) {
	  this._id = id;
	  this._method = method;
	  this.isDisposed = false;
	}

	ClearDisposable.prototype.dispose = function () {
	  if (!this.isDisposed) {
	    this.isDisposed = true;
	    this._method.call(null, this._id);
	  }
	};

	DefaultScheduler.prototype.schedule = function (state, action) {
	  var disposable = new SingleAssignmentDisposable(),
	      id = scheduleMethod(scheduleAction(disposable, action, this, state));

	  return new BinaryDisposable(disposable, new ClearDisposable(clearMethod, id));
	};

	DefaultScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
	  if (dueTime === 0) {
	    return this.schedule(state, action);
	  }

	  var disposable = new SingleAssignmentDisposable(),
	      id = global.setTimeout(scheduleAction(disposable, action, this, state), dueTime);

	  return new BinaryDisposable(disposable, new ClearDisposable(global.clearTimeout, id));
	};

	global._Rx || (global._Rx = {});
	global._Rx.defaultScheduler = new DefaultScheduler();

	Scheduler.default = global._Rx.defaultScheduler;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(26)))

/***/ },
/* 26 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isFunction = __webpack_require__(9);

	module.exports = function isPromise(p) {
	  return p && isFunction(p.then);
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var Disposable = __webpack_require__(12);
	var inherits = __webpack_require__(6);

	function NeverObservable() {
	  ObservableBase.call(this);
	}

	inherits(NeverObservable, ObservableBase);

	NeverObservable.prototype.subscribeCore = function () {
	  return Disposable.empty;
	};

	var NEVER_OBSERVABLE = new NeverObservable();

	/**
	 * Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins).
	 * @returns {Observable} An observable sequence whose observers will never get called.
	 */
	module.exports = function never() {
	  return NEVER_OBSERVABLE;
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var AsyncSubject = __webpack_require__(30);
	var asObservable = __webpack_require__(34);
	var isFunction = __webpack_require__(9);
	var tryCatch = __webpack_require__(15).tryCatch;

	function createCbHandler(o, ctx, selector) {
	  return function handler() {
	    var len = arguments.length,
	        results = new Array(len);
	    for (var i = 0; i < len; i++) {
	      results[i] = arguments[i];
	    }

	    if (isFunction(selector)) {
	      results = tryCatch(selector).apply(ctx, results);
	      if (results === global._Rx.errorObj) {
	        return o.onError(results.e);
	      }
	      o.onNext(results);
	    } else {
	      if (results.length <= 1) {
	        o.onNext(results[0]);
	      } else {
	        o.onNext(results);
	      }
	    }

	    o.onCompleted();
	  };
	}

	function createCbObservable(fn, ctx, selector, args) {
	  var o = new AsyncSubject();

	  args.push(createCbHandler(o, ctx, selector));
	  var res = tryCatch(fn).apply(ctx, args);
	  if (res === global._Rx.errorObj) {
	    o.onError(res.e);
	  }

	  return asObservable(o);
	}

	/**
	 * Converts a callback function to an observable sequence.
	 *
	 * @param {Function} fn Function with a callback as the last parameter to convert to an Observable sequence.
	 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	 * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
	 * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
	 */
	module.exports = function bindCallback(fn, ctx, selector) {
	  return function () {
	    typeof ctx === 'undefined' && (ctx = this);

	    var len = arguments.length,
	        args = new Array(len);
	    for (var i = 0; i < len; i++) {
	      args[i] = arguments[i];
	    }
	    return createCbObservable(fn, ctx, selector, args);
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Disposable = __webpack_require__(12);
	var Observable = __webpack_require__(8);
	var Observer = __webpack_require__(1);
	var InnerSubscription = __webpack_require__(31);
	var addProperties = __webpack_require__(32);
	var cloneArray = __webpack_require__(33);
	var inherits = __webpack_require__(6);

	/**
	*  Represents the result of an asynchronous operation.
	*  The last value before the OnCompleted notification, or the error received through OnError, is sent to all subscribed observers.
	*/
	function AsyncSubject() {
	  Observable.call(this);
	  this.isDisposed = false;
	  this.isStopped = false;
	  this.hasValue = false;
	  this.observers = [];
	  this.hasError = false;
	}

	inherits(AsyncSubject, Observable);

	addProperties(AsyncSubject.prototype, Observer.prototype, {
	  _subscribe: function (o) {
	    Disposable.checkDisposed(this);

	    if (!this.isStopped) {
	      this.observers.push(o);
	      return new InnerSubscription(this, o);
	    }

	    if (this.hasError) {
	      o.onError(this.error);
	    } else if (this.hasValue) {
	      o.onNext(this.value);
	      o.onCompleted();
	    } else {
	      o.onCompleted();
	    }

	    return Disposable.empty;
	  },
	  /**
	   * Indicates whether the subject has observers subscribed to it.
	   * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	   */
	  hasObservers: function () {
	    Disposable.checkDisposed(this);
	    return this.observers.length > 0;
	  },
	  /**
	   * Notifies all subscribed observers about the end of the sequence, also causing the last received value to be sent out (if any).
	   */
	  onCompleted: function () {
	    var i;
	    Disposable.checkDisposed(this);
	    if (!this.isStopped) {
	      this.isStopped = true;
	      var os = cloneArray(this.observers),
	          len = os.length;

	      if (this.hasValue) {
	        for (i = 0; i < len; i++) {
	          var o = os[i];
	          o.onNext(this.value);
	          o.onCompleted();
	        }
	      } else {
	        for (i = 0; i < len; i++) {
	          os[i].onCompleted();
	        }
	      }

	      this.observers.length = 0;
	    }
	  },
	  /**
	   * Notifies all subscribed observers about the error.
	   * @param {Mixed} error The Error to send to all observers.
	   */
	  onError: function (error) {
	    Disposable.checkDisposed(this);
	    if (!this.isStopped) {
	      this.isStopped = true;
	      this.hasError = true;
	      this.error = error;

	      for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	        os[i].onError(error);
	      }

	      this.observers.length = 0;
	    }
	  },
	  /**
	   * Sends a value to the subject. The last value received before successful termination will be sent to all subscribed and future observers.
	   * @param {Mixed} value The value to store in the subject.
	   */
	  onNext: function (value) {
	    Disposable.checkDisposed(this);
	    if (this.isStopped) {
	      return;
	    }
	    this.value = value;
	    this.hasValue = true;
	  },
	  /**
	   * Unsubscribe all observers and release resources.
	   */
	  dispose: function () {
	    this.isDisposed = true;
	    this.observers = null;
	    this.error = null;
	    this.value = null;
	  }
	});

	module.exports = AsyncSubject;

/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';

	function InnerSubscription(s, o) {
	  this._s = s;
	  this._o = o;
	}

	InnerSubscription.prototype.dispose = function () {
	  if (!this._s.isDisposed && this._o !== null) {
	    var idx = this._s.observers.indexOf(this._o);
	    this._s.observers.splice(idx, 1);
	    this._o = null;
	  }
	};

	module.exports = InnerSubscription;

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function addProperties() {
	  var obj = arguments[0];
	  for (var sources = [], i = 1, len = arguments.length; i < len; i++) {
	    sources.push(arguments[i]);
	  }
	  for (var idx = 0, ln = sources.length; idx < ln; idx++) {
	    var source = sources[idx];
	    for (var prop in source) {
	      obj[prop] = source[prop];
	    }
	  }
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function cloneArray(arr) {
	  var len = arr.length,
	      a = new Array(len);
	  for (var i = 0; i < len; i++) {
	    a[i] = arr[i];
	  }
	  return a;
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AnonymousObservable = __webpack_require__(35);

	function createAsObservable(source) {
	  return function subscribe(o) {
	    return source.subscribe(o);
	  };
	}

	/**
	 *  Hides the identity of an observable sequence.
	 * @returns {Observable} An observable sequence that hides the identity of the source sequence.
	 */
	module.exports = function asObservable(source) {
	  return new AnonymousObservable(createAsObservable(source), source);
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var inherits = __webpack_require__(6);
	var isFunction = __webpack_require__(9);
	var Observable = __webpack_require__(8);
	var Disposable = __webpack_require__(12);
	var AutoDetachObserver = __webpack_require__(13);
	var tryCatchUtils = __webpack_require__(15);
	var tryCatch = tryCatchUtils.tryCatch,
	    thrower = tryCatchUtils.thrower;

	global._Rx || (global._Rx = {});
	if (!global._Rx.currentThreadScheduler) {
	  __webpack_require__(16);
	}

	// Fix subscriber to check for undefined or function returned to decorate as Disposable
	function fixSubscriber(subscriber) {
	  return subscriber && isFunction(subscriber.dispose) ? subscriber : isFunction(subscriber) ? Disposable.create(subscriber) : Disposable.empty;
	}

	function setDisposable(s, state) {
	  var ado = state[0],
	      self = state[1];
	  var sub = tryCatch(self.__subscribe).call(self, ado);
	  if (sub === global._Rx.errorObj && !ado.fail(sub.e)) {
	    thrower(sub.e);
	  }
	  ado.setDisposable(fixSubscriber(sub));
	}

	function AnonymousObservable(subscribe, parent) {
	  this.source = parent;
	  this.__subscribe = subscribe;
	  Observable.call(this);
	}

	inherits(AnonymousObservable, Observable);

	AnonymousObservable.prototype._subscribe = function (o) {
	  var ado = new AutoDetachObserver(o),
	      state = [ado, this];

	  if (global._Rx.currentThreadScheduler.scheduleRequired()) {
	    global._Rx.currentThreadScheduler.schedule(state, setDisposable);
	  } else {
	    setDisposable(null, state);
	  }
	  return ado;
	};

	module.exports = AnonymousObservable;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var AsyncSubject = __webpack_require__(30);
	var asObservable = __webpack_require__(34);
	var isFunction = __webpack_require__(9);
	var tryCatch = __webpack_require__(15).tryCatch;

	function createNodeHandler(o, ctx, selector) {
	  return function handler() {
	    var err = arguments[0];
	    if (err) {
	      return o.onError(err);
	    }

	    var len = arguments.length,
	        results = [];
	    for (var i = 1; i < len; i++) {
	      results[i - 1] = arguments[i];
	    }

	    if (isFunction(selector)) {
	      results = tryCatch(selector).apply(ctx, results);
	      if (results === global._Rx.errorObj) {
	        return o.onError(results.e);
	      }
	      o.onNext(results);
	    } else {
	      if (results.length <= 1) {
	        o.onNext(results[0]);
	      } else {
	        o.onNext(results);
	      }
	    }

	    o.onCompleted();
	  };
	}

	function createNodeObservable(fn, ctx, selector, args) {
	  var o = new AsyncSubject();

	  args.push(createNodeHandler(o, ctx, selector));
	  var res = tryCatch(fn).apply(ctx, args);
	  if (res === global._Rx.errorObj) {
	    o.onError(res.e);
	  }

	  return asObservable(o);
	}

	/**
	 * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
	 * @param {Function} fn The function to call
	 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	 * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
	 * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
	 */
	module.exports = function bindNodeCallback(fn, ctx, selector) {
	  return function () {
	    typeof ctx === 'undefined' && (ctx = this);
	    var len = arguments.length,
	        args = new Array(len);
	    for (var i = 0; i < len; i++) {
	      args[i] = arguments[i];
	    }
	    return createNodeObservable(fn, ctx, selector, args);
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var defer = __webpack_require__(38);
	var empty = __webpack_require__(41);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var isScheduler = __webpack_require__(17).isScheduler;

	function createCase(selector, sources, defaultSourceOrScheduler) {
	  return function () {
	    isPromise(defaultSourceOrScheduler) && (defaultSourceOrScheduler = fromPromise(defaultSourceOrScheduler));
	    defaultSourceOrScheduler || (defaultSourceOrScheduler = empty());

	    isScheduler(defaultSourceOrScheduler) && (defaultSourceOrScheduler = empty(defaultSourceOrScheduler));

	    var result = sources[selector()];
	    isPromise(result) && (result = fromPromise(result));

	    return result || defaultSourceOrScheduler;
	  };
	}

	/**
	*  Uses selector to determine which source in sources to use.
	* @param {Function} selector The function which extracts the value for to test in a case statement.
	* @param {Array} sources A object which has keys which correspond to the case statement labels.
	* @param {Observable} [elseSource] The observable sequence or Promise that will be run if the sources are not matched. If this is not provided, it defaults to Rx.Observabe.empty with the specified scheduler.
	*
	* @returns {Observable} An observable sequence which is determined by a case statement.
	*/
	module.exports = function case_(selector, sources, defaultSourceOrScheduler) {
	  return defer(createCase(selector, sources, defaultSourceOrScheduler));
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var fromPromise = __webpack_require__(24);
	var throwError = __webpack_require__(39);
	var isPromise = __webpack_require__(27);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function Defer(factory) {
	  this._f = factory;
	  ObservableBase.call(this);
	}

	inherits(Defer, ObservableBase);

	Defer.prototype.subscribeCore = function (o) {
	  var result = tryCatch(this._f)();
	  if (result === global._Rx.errorObj) {
	    return throwError(result.e).subscribe(o);
	  }
	  isPromise(result) && (result = fromPromise(result));
	  return result.subscribe(o);
	};

	/**
	 *  Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.
	 *
	 * @example
	 *  var res = Rx.Observable.defer(function () { return Rx.Observable.fromArray([1,2,3]); });
	 * @param {Function} observableFactory Observable factory function to invoke for each observer that subscribes to the resulting sequence or Promise.
	 * @returns {Observable} An observable sequence whose observers trigger an invocation of the given observable factory function.
	 */
	module.exports = function observableDefer(observableFactory) {
	  return new Defer(observableFactory);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var Disposable = __webpack_require__(12);
	var Scheduler = __webpack_require__(17);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.immediateScheduler) {
	  __webpack_require__(40);
	}

	function scheduleItem(s, state) {
	  var e = state[0],
	      o = state[1];
	  o.onError(e);
	  return Disposable.empty;
	}

	function ThrowObservable(error, scheduler) {
	  this._error = error;
	  this._scheduler = scheduler;
	  ObservableBase.call(this);
	}

	inherits(ThrowObservable, ObservableBase);

	ThrowObservable.prototype.subscribeCore = function (o) {
	  var state = [this._error, o];
	  return this._scheduler === global._Rx.immediateScheduler ? scheduleItem(null, state) : this._scheduler.schedule(state, scheduleItem);
	};

	module.exports = function throwError(error, scheduler) {
	  Scheduler.isScheduler(scheduler) || (scheduler = global._Rx.immediateScheduler);
	  return new ThrowObservable(error, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var Scheduler = __webpack_require__(17);
	var Disposable = __webpack_require__(12);
	var inherits = __webpack_require__(6);

	function ImmediateScheduler() {
	  Scheduler.call(this);
	}

	inherits(ImmediateScheduler, Scheduler);

	ImmediateScheduler.prototype.schedule = function (state, action) {
	  return Disposable._fixup(action(this, state));
	};

	global._Rx || (global._Rx = {});
	global._Rx.immediateScheduler = new ImmediateScheduler();

	Scheduler.immediate = global._Rx.immediateScheduler;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var Disposable = __webpack_require__(12);
	var Scheduler = __webpack_require__(17);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.immediateScheduler) {
	  __webpack_require__(40);
	}

	function scheduleItem(s, state) {
	  state.onCompleted();
	  return Disposable.empty;
	}

	function EmptyObservable(scheduler) {
	  this._scheduler = scheduler;
	  ObservableBase.call(this);
	}

	inherits(EmptyObservable, ObservableBase);

	EmptyObservable.prototype.subscribeCore = function (o) {
	  return this.scheduler === global._Rx.immediateScheduler ? scheduleItem(null, o) : this._scheduler.schedule(o, scheduleItem);
	};

	var EMPTY_OBSERVABLE = new EmptyObservable(global._Rx.immediateScheduler);

	/**
	 *  Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.
	 *
	 * @example
	 *  var res = Rx.Observable.empty();
	 *  var res = Rx.Observable.empty(Rx.Scheduler.timeout);
	 * @param {Scheduler} [scheduler] Scheduler to send the termination call on.
	 * @returns {Observable} An observable sequence with no elements.
	 */
	module.exports = function empty(scheduler) {
	  Scheduler.isScheduler(scheduler) || (scheduler = global._Rx.immediateScheduler);
	  return scheduler === global._Rx.immediateScheduler ? EMPTY_OBSERVABLE : new EmptyObservable(scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var NAryDisposable = __webpack_require__(43);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.currentThreadScheduler) {
	  __webpack_require__(16);
	}

	function CatchObserver(state, recurse) {
	  this._state = state;
	  this._recurse = recurse;
	  AbstractObserver.call(this);
	}

	inherits(CatchObserver, AbstractObserver);

	CatchObserver.prototype.next = function (x) {
	  this._state.o.onNext(x);
	};
	CatchObserver.prototype.error = function (e) {
	  this._state.lastError = e;this._recurse(this._state);
	};
	CatchObserver.prototype.completed = function () {
	  this._state.o.onCompleted();
	};

	function CatchObservable(sources) {
	  this.sources = sources;
	  ObservableBase.call(this);
	}

	inherits(CatchObservable, ObservableBase);

	function scheduleMethod(state, recurse) {
	  if (state.isDisposed) {
	    return;
	  }
	  if (state.i < state.sources.length) {
	    var currentValue = state.sources[state.i++];
	    isPromise(currentValue) && (currentValue = fromPromise(currentValue));

	    var d = new SingleAssignmentDisposable();
	    state.subscription.setDisposable(d);
	    d.setDisposable(currentValue.subscribe(new CatchObserver(state, recurse)));
	  } else {
	    if (state.lastError !== null) {
	      state.o.onError(state.lastError);
	    } else {
	      state.o.onCompleted();
	    }
	  }
	}

	function IsDisposedDisposable(s) {
	  this._s = s;
	}

	IsDisposedDisposable.prototype.dispose = function () {
	  !this._s.isDisposed && (this._s.isDisposed = true);
	};

	CatchObservable.prototype.subscribeCore = function (o) {
	  var subscription = new SerialDisposable();
	  var state = {
	    isDisposed: false,
	    sources: this.sources,
	    i: 0,
	    subscription: subscription,
	    lastError: null,
	    o: o
	  };

	  var cancelable = global._Rx.currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
	  return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
	};

	module.exports = function catch_() {
	  var len = arguments.length,
	      args = new Array(len);
	  for (var i = 0; i < len; i++) {
	    args[i] = arguments[i];
	  }
	  return new CatchObservable(args);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';

	function NAryDisposable(disposables) {
	  this._disposables = disposables;
	  this.isDisposed = false;
	}

	NAryDisposable.prototype.dispose = function () {
	  if (!this.isDisposed) {
	    this.isDisposed = true;
	    for (var i = 0, len = this._disposables.length; i < len; i++) {
	      this._disposables[i].dispose();
	    }
	    this._disposables.length = 0;
	  }
	};

	module.exports = NAryDisposable;

/***/ },
/* 44 */
/***/ function(module, exports) {

	'use strict';

	function SerialDisposable() {
	  this.isDisposed = false;
	  this._current = null;
	}

	SerialDisposable.prototype.getDisposable = function () {
	  return this._current;
	};

	SerialDisposable.prototype.setDisposable = function (value) {
	  var shouldDispose = this.isDisposed;
	  if (!shouldDispose) {
	    var old = this._current;
	    this._current = value;
	    old && old.dispose();
	  }

	  shouldDispose && value && value.dispose();
	};

	SerialDisposable.prototype.dispose = function () {
	  if (!this.isDisposed) {
	    this.isDisposed = true;
	    var old = this._current;
	    this._current = null;
	    old && old.dispose();
	  }
	};

	module.exports = SerialDisposable;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var NAryDisposable = __webpack_require__(43);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var identity = __webpack_require__(46);
	var isFunction = __webpack_require__(9);
	var inherits = __webpack_require__(6);
	var tryCatch = __webpack_require__(15).tryCatch;

	function falseFactory() {
	  return false;
	}
	function initializeArray(n, fn) {
	  var results = new Array(n);
	  for (var i = 0; i < n; i++) {
	    results[i] = fn(i);
	  }
	  return results;
	}
	function argumentsToArray() {
	  var len = arguments.length,
	      args = new Array(len);
	  for (var i = 0; i < len; i++) {
	    args[i] = arguments[i];
	  }
	  return args;
	}

	function CombineLatestObserver(o, i, cb, state) {
	  this._o = o;
	  this._i = i;
	  this._cb = cb;
	  this._state = state;
	  AbstractObserver.call(this);
	}

	inherits(CombineLatestObserver, AbstractObserver);

	function notTheSame(i) {
	  return function (x, j) {
	    return j !== i;
	  };
	}

	CombineLatestObserver.prototype.next = function (x) {
	  this._state.values[this._i] = x;
	  this._state.hasValue[this._i] = true;
	  if (this._state.hasValueAll || (this._state.hasValueAll = this._state.hasValue.every(identity))) {
	    var res = tryCatch(this._cb).apply(null, this._state.values);
	    if (res === global._Rx.errorObj) {
	      return this._o.onError(res.e);
	    }
	    this._o.onNext(res);
	  } else if (this._state.isDone.filter(notTheSame(this._i)).every(identity)) {
	    this._o.onCompleted();
	  }
	};

	CombineLatestObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	CombineLatestObserver.prototype.completed = function () {
	  this._state.isDone[this._i] = true;
	  this._state.isDone.every(identity) && this._o.onCompleted();
	};

	function CombineLatestObservable(params, cb) {
	  this._params = params;
	  this._cb = cb;
	  ObservableBase.call(this);
	}

	inherits(CombineLatestObservable, ObservableBase);

	CombineLatestObservable.prototype.subscribeCore = function (observer) {
	  var len = this._params.length,
	      subscriptions = new Array(len);

	  var state = {
	    hasValue: initializeArray(len, falseFactory),
	    hasValueAll: false,
	    isDone: initializeArray(len, falseFactory),
	    values: new Array(len)
	  };

	  for (var i = 0; i < len; i++) {
	    var source = this._params[i],
	        sad = new SingleAssignmentDisposable();
	    subscriptions[i] = sad;
	    isPromise(source) && (source = fromPromise(source));
	    sad.setDisposable(source.subscribe(new CombineLatestObserver(observer, i, this._cb, state)));
	  }

	  return new NAryDisposable(subscriptions);
	};

	/**
	* Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
	*
	* @example
	* 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
	* 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
	* @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	*/
	module.exports = function combineLatest() {
	  var len = arguments.length,
	      args = new Array(len);
	  for (var i = 0; i < len; i++) {
	    args[i] = arguments[i];
	  }
	  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	  return new CombineLatestObservable(args, resultSelector);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 46 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function identity(x) {
	  return x;
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var Disposable = __webpack_require__(12);
	var NAryDisposable = __webpack_require__(43);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.immediateScheduler) {
	  __webpack_require__(40);
	}

	function ConcatObserver(s, fn) {
	  this._s = s;
	  this._fn = fn;
	  AbstractObserver.call(this);
	}

	inherits(ConcatObserver, AbstractObserver);

	ConcatObserver.prototype.next = function (x) {
	  this._s.o.onNext(x);
	};
	ConcatObserver.prototype.error = function (e) {
	  this._s.o.onError(e);
	};
	ConcatObserver.prototype.completed = function () {
	  this._s.i++;this._fn(this._s);
	};

	function ConcatObservable(sources) {
	  this._sources = sources;
	  ObservableBase.call(this);
	}

	inherits(ConcatObservable, ObservableBase);

	function scheduleRecursive(state, recurse) {
	  if (state.disposable.isDisposed) {
	    return;
	  }
	  if (state.i === state.sources.length) {
	    return state.o.onCompleted();
	  }

	  // Check if promise
	  var currentValue = state.sources[state.i];
	  isPromise(currentValue) && (currentValue = fromPromise(currentValue));

	  var d = new SingleAssignmentDisposable();
	  state.subscription.setDisposable(d);
	  d.setDisposable(currentValue.subscribe(new ConcatObserver(state, recurse)));
	}

	ConcatObservable.prototype.subscribeCore = function (o) {
	  var subscription = new SerialDisposable();
	  var disposable = Disposable.create();
	  var state = {
	    o: o,
	    i: 0,
	    subscription: subscription,
	    disposable: disposable,
	    sources: this._sources
	  };

	  var cancelable = global._Rx.immediateScheduler.scheduleRecursive(state, scheduleRecursive);
	  return new NAryDisposable([subscription, disposable, cancelable]);
	};

	/**
	 * Concatenates all the observable sequences.
	 * @param {Array | Arguments} args Arguments or an array to concat to the observable sequence.
	 * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
	 */
	module.exports = function concat() {
	  var len = arguments.length,
	      args = new Array(len);
	  for (var i = 0; i < len; i++) {
	    args[i] = arguments[i];
	  }
	  return new ConcatObservable(args);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AnonymousObservable = __webpack_require__(35);

	/**
	 *  Creates an observable sequence from a specified subscribe method implementation.
	 * @param {Function} subscribe Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.
	 * @returns {Observable} The observable sequence with the specified implementation for the Subscribe method.
	 */
	module.exports = function create(subscribe, parent) {
	  return new AnonymousObservable(subscribe, parent);
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var CompositeDisposable = __webpack_require__(18);
	var Disposable = __webpack_require__(12);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var isFunction = __webpack_require__(9);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function argumentsToArray() {
	  var len = arguments.length,
	      args = new Array(len);
	  for (var i = 0; i < len; i++) {
	    args[i] = arguments[i];
	  }
	  return args;
	}

	function ForkJoinObserver(o, s, i, cb, subs) {
	  this._o = o;
	  this._s = s;
	  this._i = i;
	  this._cb = cb;
	  this._subs = subs;
	  AbstractObserver.call(this);
	}

	inherits(ForkJoinObserver, AbstractObserver);

	ForkJoinObserver.prototype.next = function (x) {
	  if (!this._s.finished) {
	    this._s.hasResults[this._i] = true;
	    this._s.results[this._i] = x;
	  }
	};

	ForkJoinObserver.prototype.error = function (e) {
	  this._s.finished = true;
	  this._o.onError(e);
	  this._subs.dispose();
	};

	ForkJoinObserver.prototype.completed = function () {
	  if (!this._s.finished) {
	    if (!this._s.hasResults[this._i]) {
	      return this._o.onCompleted();
	    }
	    this._s.hasCompleted[this._i] = true;
	    for (var i = 0; i < this._s.results.length; i++) {
	      if (!this._s.hasCompleted[i]) {
	        return;
	      }
	    }
	    this._s.finished = true;

	    var res = tryCatch(this._cb).apply(null, this._s.results);
	    if (res === global._Rx.errorObj) {
	      return this._o.onError(res.e);
	    }

	    this._o.onNext(res);
	    this._o.onCompleted();
	  }
	};

	function ForkJoinObservable(sources, cb) {
	  this._sources = sources;
	  this._cb = cb;
	  ObservableBase.call(this);
	}

	inherits(ForkJoinObservable, ObservableBase);

	ForkJoinObservable.prototype.subscribeCore = function (o) {
	  if (this._sources.length === 0) {
	    o.onCompleted();
	    return Disposable.empty;
	  }

	  var count = this._sources.length;
	  var state = {
	    finished: false,
	    hasResults: new Array(count),
	    hasCompleted: new Array(count),
	    results: new Array(count)
	  };

	  var subscriptions = new CompositeDisposable();
	  for (var i = 0, len = this._sources.length; i < len; i++) {
	    var source = this._sources[i];
	    isPromise(source) && (source = fromPromise(source));
	    subscriptions.add(source.subscribe(new ForkJoinObserver(o, state, i, this._cb, subscriptions)));
	  }

	  return subscriptions;
	};

	module.exports = function forkJoin() {
	  var len = arguments.length,
	      args = new Array(len);
	  for (var i = 0; i < len; i++) {
	    args[i] = arguments[i];
	  }
	  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	  return new ForkJoinObservable(args, resultSelector);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var Scheduler = __webpack_require__(17);
	var isFunction = __webpack_require__(9);
	var $iterator$ = __webpack_require__(51);
	var bindCallback = __webpack_require__(52);
	var inherits = __webpack_require__(6);
	var tryCatch = __webpack_require__(15).tryCatch;

	global._Rx || (global._Rx = {});
	if (!global._Rx.currentThreadScheduler) {
	  __webpack_require__(16);
	}

	var doneEnumerator = { done: true, value: undefined };

	function FromObservable(iterable, fn, scheduler) {
	  this._iterable = iterable;
	  this._fn = fn;
	  this._scheduler = scheduler;
	  ObservableBase.call(this);
	}

	inherits(FromObservable, ObservableBase);

	function createScheduleMethod(o, it, fn) {
	  return function loopRecursive(i, recurse) {
	    var next = tryCatch(it.next).call(it);
	    if (next === global._Rx.errorObj) {
	      return o.onError(next.e);
	    }
	    if (next.done) {
	      return o.onCompleted();
	    }

	    var result = next.value;

	    if (isFunction(fn)) {
	      result = tryCatch(fn)(result, i);
	      if (result === global._Rx.errorObj) {
	        return o.onError(result.e);
	      }
	    }

	    o.onNext(result);
	    recurse(i + 1);
	  };
	}

	FromObservable.prototype.subscribeCore = function (o) {
	  var list = Object(this._iterable),
	      it = getIterable(list);

	  return this._scheduler.scheduleRecursive(0, createScheduleMethod(o, it, this._fn));
	};

	var maxSafeInteger = Math.pow(2, 53) - 1;

	function StringIterable(s) {
	  this._s = s;
	}

	StringIterable.prototype[$iterator$] = function () {
	  return new StringIterator(this._s);
	};

	function StringIterator(s) {
	  this._s = s;
	  this._l = s.length;
	  this._i = 0;
	}

	StringIterator.prototype[$iterator$] = function () {
	  return this;
	};

	StringIterator.prototype.next = function () {
	  return this._i < this._l ? { done: false, value: this._s.charAt(this._i++) } : doneEnumerator;
	};

	function ArrayIterable(a) {
	  this._a = a;
	}

	ArrayIterable.prototype[$iterator$] = function () {
	  return new ArrayIterator(this._a);
	};

	function ArrayIterator(a) {
	  this._a = a;
	  this._l = toLength(a);
	  this._i = 0;
	}

	ArrayIterator.prototype[$iterator$] = function () {
	  return this;
	};

	ArrayIterator.prototype.next = function () {
	  return this._i < this._l ? { done: false, value: this._a[this._i++] } : doneEnumerator;
	};

	function numberIsFinite(value) {
	  return typeof value === 'number' && global.isFinite(value);
	}

	function getIterable(o) {
	  var i = o[$iterator$],
	      it;
	  if (!i && typeof o === 'string') {
	    it = new StringIterable(o);
	    return it[$iterator$]();
	  }
	  if (!i && o.length !== undefined) {
	    it = new ArrayIterable(o);
	    return it[$iterator$]();
	  }
	  if (!i) {
	    throw new TypeError('Object is not iterable');
	  }
	  return o[$iterator$]();
	}

	function sign(value) {
	  var number = +value;
	  if (number === 0) {
	    return number;
	  }
	  if (isNaN(number)) {
	    return number;
	  }
	  return number < 0 ? -1 : 1;
	}

	function toLength(o) {
	  var len = +o.length;
	  if (isNaN(len)) {
	    return 0;
	  }
	  if (len === 0 || !numberIsFinite(len)) {
	    return len;
	  }
	  len = sign(len) * Math.floor(Math.abs(len));
	  if (len <= 0) {
	    return 0;
	  }
	  if (len > maxSafeInteger) {
	    return maxSafeInteger;
	  }
	  return len;
	}

	/**
	* This method creates a new Observable sequence from an array-like or iterable object.
	* @param {Any} arrayLike An array-like or iterable object to convert to an Observable sequence.
	* @param {Function} [mapFn] Map function to call on every element of the array.
	* @param {Any} [thisArg] The context to use calling the mapFn if provided.
	* @param {Scheduler} [scheduler] Optional scheduler to use for scheduling.  If not provided, defaults to Scheduler.currentThread.
	*/
	module.exports = function (iterable, mapFn, thisArg, scheduler) {
	  if (iterable == null) {
	    throw new Error('iterable cannot be null.');
	  }
	  if (mapFn && !isFunction(mapFn)) {
	    throw new Error('mapFn when provided must be a function');
	  }

	  var mapper;
	  if (mapFn) {
	    mapper = bindCallback(mapFn, thisArg, 2);
	  }
	  Scheduler.isScheduler(scheduler) || (scheduler = global._Rx.currentThreadScheduler);
	  return new FromObservable(iterable, mapper, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 51 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	// Shim in iterator support

	var $iterator$ = typeof global.Symbol === 'function' && global.Symbol.iterator || '_es6shim_iterator_';
	// Bug for mozilla version
	if (global.Set && typeof new global.Set()['@@iterator'] === 'function') {
	  $iterator$ = '@@iterator';
	}

	module.exports = $iterator$;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 52 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function bindCallback(func, thisArg, argCount) {
	  if (typeof thisArg === 'undefined') {
	    return func;
	  }
	  switch (argCount) {
	    case 0:
	      return function () {
	        return func.call(thisArg);
	      };
	    case 1:
	      return function (arg) {
	        return func.call(thisArg, arg);
	      };
	    case 2:
	      return function (value, index) {
	        return func.call(thisArg, value, index);
	      };
	    case 3:
	      return function (value, index, collection) {
	        return func.call(thisArg, value, index, collection);
	      };
	  }

	  return function () {
	    return func.apply(thisArg, arguments);
	  };
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var Scheduler = __webpack_require__(17);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.currentThreadScheduler) {
	  __webpack_require__(16);
	}

	function scheduleMethod(o, args) {
	  return function loopRecursive(i, recurse) {
	    if (i < args.length) {
	      o.onNext(args[i]);
	      recurse(i + 1);
	    } else {
	      o.onCompleted();
	    }
	  };
	}

	function FromArrayObservable(args, scheduler) {
	  this._args = args;
	  this._scheduler = scheduler;
	  ObservableBase.call(this);
	}

	inherits(FromArrayObservable, ObservableBase);

	FromArrayObservable.prototype.subscribeCore = function (o) {
	  return this._scheduler.scheduleRecursive(0, scheduleMethod(o, this._args));
	};

	module.exports = function fromArray(array, scheduler) {
	  Scheduler.isScheduler(scheduler) || (scheduler = global._Rx.currentThreadScheduler);
	  return new FromArrayObservable(array, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var fromEventPattern = __webpack_require__(55);
	var publish = __webpack_require__(56);
	var CompositeDisposable = __webpack_require__(18);
	var isFunction = __webpack_require__(9);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function isNodeList(el) {
	  if (global.StaticNodeList) {
	    // IE8 Specific
	    // instanceof is slower than Object#toString, but Object#toString will not work as intended in IE8
	    return el instanceof global.StaticNodeList || el instanceof global.NodeList;
	  } else {
	    return Object.prototype.toString.call(el) === '[object NodeList]';
	  }
	}

	function ListenDisposable(e, n, fn) {
	  this._e = e;
	  this._n = n;
	  this._fn = fn;
	  this._e.addEventListener(this._n, this._fn, false);
	  this.isDisposed = false;
	}

	ListenDisposable.prototype.dispose = function () {
	  if (!this.isDisposed) {
	    this._e.removeEventListener(this._n, this._fn, false);
	    this.isDisposed = true;
	  }
	};

	function createEventListener(el, eventName, handler) {
	  var disposables = new CompositeDisposable();

	  // Asume NodeList or HTMLCollection
	  var elemToString = Object.prototype.toString.call(el);
	  if (isNodeList(el) || elemToString === '[object HTMLCollection]') {
	    for (var i = 0, len = el.length; i < len; i++) {
	      disposables.add(createEventListener(el.item(i), eventName, handler));
	    }
	  } else if (el) {
	    disposables.add(new ListenDisposable(el, eventName, handler));
	  }

	  return disposables;
	}

	/**
	 * Configuration option to determine whether to use native events only
	 */
	global._Rx || (global._Rx = {});
	global._Rx.config || (global._Rx.config = {});
	global._Rx.config.useNativeEvents = false;

	function EventObservable(el, name, fn) {
	  this._el = el;
	  this._n = name;
	  this._fn = fn;
	  ObservableBase.call(this);
	}

	inherits(EventObservable, ObservableBase);

	function createHandler(o, fn) {
	  return function handler() {
	    var results = arguments[0];
	    if (isFunction(fn)) {
	      results = tryCatch(fn).apply(null, arguments);
	      if (results === global._Rx.errorObj) {
	        return o.onError(results.e);
	      }
	    }
	    o.onNext(results);
	  };
	}

	EventObservable.prototype.subscribeCore = function (o) {
	  return createEventListener(this._el, this._n, createHandler(o, this._fn));
	};

	/**
	 * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
	 * @param {Object} element The DOMElement or NodeList to attach a listener.
	 * @param {String} eventName The event name to attach the observable sequence.
	 * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	 * @returns {Observable} An observable sequence of events from the specified element and the specified event.
	 */
	module.exports = function fromEvent(element, eventName, selector) {
	  // Node.js specific
	  if (element.addListener) {
	    return fromEventPattern(function (h) {
	      element.addListener(eventName, h);
	    }, function (h) {
	      element.removeListener(eventName, h);
	    }, selector);
	  }

	  // Use only if non-native events are allowed
	  if (!global._Rx.config.useNativeEvents) {
	    // Handles jq, Angular.js, Zepto, Marionette, Ember.js
	    if (typeof element.on === 'function' && typeof element.off === 'function') {
	      return fromEventPattern(function (h) {
	        element.on(eventName, h);
	      }, function (h) {
	        element.off(eventName, h);
	      }, selector);
	    }
	  }

	  return publish(new EventObservable(element, eventName, selector)).refCount();
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var publish = __webpack_require__(56);
	var isFunction = __webpack_require__(9);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function EventPatternDisposable(del, fn, ret) {
	  this._del = del;
	  this._fn = fn;
	  this._ret = ret;
	  this.isDisposed = false;
	}

	EventPatternDisposable.prototype.dispose = function () {
	  if (!this.isDisposed) {
	    isFunction(this._del) && this._del(this._fn, this._ret);
	    this.isDisposed = true;
	  }
	};

	function EventPatternObservable(add, del, fn) {
	  this._add = add;
	  this._del = del;
	  this._fn = fn;
	  ObservableBase.call(this);
	}

	inherits(EventPatternObservable, ObservableBase);

	function createHandler(o, fn) {
	  return function handler() {
	    var results = arguments[0];
	    if (isFunction(fn)) {
	      results = tryCatch(fn).apply(null, arguments);
	      if (results === global._Rx.errorObj) {
	        return o.onError(results.e);
	      }
	    }
	    o.onNext(results);
	  };
	}

	EventPatternObservable.prototype.subscribeCore = function (o) {
	  var fn = createHandler(o, this._fn);
	  var returnValue = this._add(fn);
	  return new EventPatternDisposable(this._del, fn, returnValue);
	};

	/**
	 * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
	 * @param {Function} addHandler The function to add a handler to the emitter.
	 * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
	 * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	 * @returns {Observable} An observable sequence which wraps an event from an event emitter
	 */
	module.exports = function fromEventPattern(addHandler, removeHandler, selector) {
	  return publish(new EventPatternObservable(addHandler, removeHandler, selector)).refCount();
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Subject = __webpack_require__(57);
	var multicast = __webpack_require__(58);
	var isFunction = __webpack_require__(9);

	/**
	 * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.
	 * This operator is a specialization of Multicast using a regular Subject.
	 * @param {Function} [selector] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
	 * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	 */
	module.exports = function publish(source, fn) {
	  return fn && isFunction(fn) ? multicast(source, function () {
	    return new Subject();
	  }, fn) : multicast(source, new Subject());
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Disposable = __webpack_require__(12);
	var Observable = __webpack_require__(8);
	var Observer = __webpack_require__(1);
	var InnerSubscription = __webpack_require__(31);
	var addProperties = __webpack_require__(32);
	var cloneArray = __webpack_require__(33);
	var inherits = __webpack_require__(6);

	/**
	*  Represents an object that is both an observable sequence as well as an observer.
	*  Each notification is broadcasted to all subscribed observers.
	*/
	function Subject() {
	  Observable.call(this);
	  this.isDisposed = false;
	  this.isStopped = false;
	  this.observers = [];
	  this.hasError = false;
	}

	inherits(Subject, Observable);

	addProperties(Subject.prototype, Observer.prototype, {
	  _subscribe: function (o) {
	    Disposable.checkDisposed(this);
	    if (!this.isStopped) {
	      this.observers.push(o);
	      return new InnerSubscription(this, o);
	    }
	    if (this.hasError) {
	      o.onError(this.error);
	      return Disposable.empty;
	    }
	    o.onCompleted();
	    return Disposable.empty;
	  },
	  /**
	   * Indicates whether the subject has observers subscribed to it.
	   * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	   */
	  hasObservers: function () {
	    Disposable.checkDisposed(this);
	    return this.observers.length > 0;
	  },
	  /**
	   * Notifies all subscribed observers about the end of the sequence.
	   */
	  onCompleted: function () {
	    Disposable.checkDisposed(this);
	    if (!this.isStopped) {
	      this.isStopped = true;
	      for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	        os[i].onCompleted();
	      }

	      this.observers.length = 0;
	    }
	  },
	  /**
	   * Notifies all subscribed observers about the exception.
	   * @param {Mixed} error The exception to send to all observers.
	   */
	  onError: function (error) {
	    Disposable.checkDisposed(this);
	    if (!this.isStopped) {
	      this.isStopped = true;
	      this.error = error;
	      this.hasError = true;
	      for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	        os[i].onError(error);
	      }

	      this.observers.length = 0;
	    }
	  },
	  /**
	   * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	   * @param {Mixed} value The value to send to all observers.
	   */
	  onNext: function (value) {
	    Disposable.checkDisposed(this);
	    if (!this.isStopped) {
	      for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	        os[i].onNext(value);
	      }
	    }
	  },
	  /**
	   * Unsubscribe all observers and release resources.
	   */
	  dispose: function () {
	    this.isDisposed = true;
	    this.observers = null;
	  }
	});

	Subject.addToObject = function (operators) {
	  Object.keys(operators).forEach(function (operator) {
	    Subject[operator] = operators[operator];
	  });
	};

	Subject.addToPrototype = function (operators) {
	  Object.keys(operators).forEach(function (operator) {
	    Subject.prototype[operator] = function () {
	      var args = [this];
	      args.push.apply(args, arguments);
	      return operators[operator].apply(null, args);
	    };
	  });
	};

	module.exports = Subject;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var ConnectableObservable = __webpack_require__(59);
	var BinaryDisposable = __webpack_require__(23);
	var isFunction = __webpack_require__(9);
	var inherits = __webpack_require__(6);

	function MulticastObservable(source, fn1, fn2) {
	  this.source = source;
	  this._fn1 = fn1;
	  this._fn2 = fn2;
	  ObservableBase.call(this);
	}

	inherits(MulticastObservable, ObservableBase);

	MulticastObservable.prototype.subscribeCore = function (o) {
	  var connectable = this.source.multicast(this._fn1());
	  return new BinaryDisposable(this._fn2(connectable).subscribe(o), connectable.connect());
	};

	/**
	 * Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
	 * subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
	 * invocation. For specializations with fixed subject types, see Publish, PublishLast, and Replay.
	 * @param {Function|Subject} subjectOrSubjectSelector
	 * Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
	 * Or:
	 * Subject to push source elements into.
	 *
	 * @param {Function} [selector] Optional selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if <paramref name="subjectOrSubjectSelector" is a factory function.
	 * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	 */
	module.exports = function multicast(source, subjectOrSubjectSelector, selector) {
	  return isFunction(subjectOrSubjectSelector) ? new MulticastObservable(source, subjectOrSubjectSelector, selector) : new ConnectableObservable(source, subjectOrSubjectSelector);
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Observable = __webpack_require__(8);
	var ObservableBase = __webpack_require__(11);
	var asObservable = __webpack_require__(34);
	var inherits = __webpack_require__(6);

	function RefCountDisposable(p, s) {
	  this._p = p;
	  this._s = s;
	  this.isDisposed = false;
	}

	RefCountDisposable.prototype.dispose = function () {
	  if (!this.isDisposed) {
	    this.isDisposed = true;
	    this._s.dispose();
	    --this._p._count === 0 && this._p._connectableSubscription.dispose();
	  }
	};

	function RefCountObservable(source) {
	  this.source = source;
	  this._count = 0;
	  this._connectableSubscription = null;
	  ObservableBase.call(this);
	}

	inherits(RefCountObservable, ObservableBase);

	RefCountObservable.prototype.subscribeCore = function (o) {
	  var subscription = this.source.subscribe(o);
	  ++this._count === 1 && (this._connectableSubscription = this.source.connect());
	  return new RefCountDisposable(this, subscription);
	};

	function ConnectableObservable(source, subject) {
	  this.source = source;
	  this._connection = null;
	  this._source = asObservable(source);
	  this._subject = subject;
	  Observable.call(this);
	}

	inherits(ConnectableObservable, Observable);

	function ConnectDisposable(parent, subscription) {
	  this._p = parent;
	  this._s = subscription;
	}

	ConnectDisposable.prototype.dispose = function () {
	  if (this._s) {
	    this._s.dispose();
	    this._s = null;
	    this._p._connection = null;
	  }
	};

	ConnectableObservable.prototype.connect = function () {
	  if (!this._connection) {
	    var subscription = this._source.subscribe(this._subject);
	    this._connection = new ConnectDisposable(this, subscription);
	  }
	  return this._connection;
	};

	ConnectableObservable.prototype._subscribe = function (o) {
	  return this._subject.subscribe(o);
	};

	ConnectableObservable.prototype.refCount = function () {
	  return new RefCountObservable(this);
	};

	module.exports = ConnectableObservable;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var tryCatch = __webpack_require__(15).tryCatch;
	var isScheduler = __webpack_require__(17).isScheduler;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.currentThreadScheduler) {
	  __webpack_require__(16);
	}

	function GenerateObservable(state, cndFn, itrFn, resFn, s) {
	  this._initialState = state;
	  this._cndFn = cndFn;
	  this._itrFn = itrFn;
	  this._resFn = resFn;
	  this._s = s;
	  ObservableBase.call(this);
	}

	inherits(GenerateObservable, ObservableBase);

	function scheduleRecursive(state, recurse) {
	  if (state.first) {
	    state.first = false;
	  } else {
	    state.newState = tryCatch(state.self._itrFn)(state.newState);
	    if (state.newState === global._Rx.errorObj) {
	      return state.o.onError(state.newState.e);
	    }
	  }
	  var hasResult = tryCatch(state.self._cndFn)(state.newState);
	  if (hasResult === global._Rx.errorObj) {
	    return state.o.onError(hasResult.e);
	  }
	  if (hasResult) {
	    var result = tryCatch(state.self._resFn)(state.newState);
	    if (result === global._Rx.errorObj) {
	      return state.o.onError(result.e);
	    }
	    state.o.onNext(result);
	    recurse(state);
	  } else {
	    state.o.onCompleted();
	  }
	}

	GenerateObservable.prototype.subscribeCore = function (o) {
	  var state = {
	    o: o,
	    self: this,
	    first: true,
	    newState: this._initialState
	  };
	  return this._s.scheduleRecursive(state, scheduleRecursive);
	};

	module.exports = function generate(initialState, condition, iterate, resultSelector, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.currentThreadScheduler);
	  return new GenerateObservable(initialState, condition, iterate, resultSelector, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var tryCatch = __webpack_require__(15).tryCatch;
	var isScheduler = __webpack_require__(17).isScheduler;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function GenerateAbsoluteObservable(state, cndFn, itrFn, resFn, timeFn, s) {
	  this._state = state;
	  this._cndFn = cndFn;
	  this._itrFn = itrFn;
	  this._resFn = resFn;
	  this._timeFn = timeFn;
	  this._s = s;
	  ObservableBase.call(this);
	}

	inherits(GenerateAbsoluteObservable, ObservableBase);

	function scheduleRecursive(state, recurse) {
	  state.hasResult && state.o.onNext(state.result);

	  if (state.first) {
	    state.first = false;
	  } else {
	    state.newState = tryCatch(state.self._itrFn)(state.newState);
	    if (state.newState === global._Rx.errorObj) {
	      return state.o.onError(state.newState.e);
	    }
	  }
	  state.hasResult = tryCatch(state.self._cndFn)(state.newState);
	  if (state.hasResult === global._Rx.errorObj) {
	    return state.o.onError(state.hasResult.e);
	  }
	  if (state.hasResult) {
	    state.result = tryCatch(state.self._resFn)(state.newState);
	    if (state.result === global._Rx.errorObj) {
	      return state.o.onError(state.result.e);
	    }
	    var time = tryCatch(state.self._timeFn)(state.newState);
	    if (time === global._Rx.errorObj) {
	      return state.o.onError(time.e);
	    }
	    recurse(state, time);
	  } else {
	    state.o.onCompleted();
	  }
	}

	GenerateAbsoluteObservable.prototype.subscribeCore = function (o) {
	  var state = {
	    o: o,
	    self: this,
	    newState: this._state,
	    first: true,
	    hasResult: false
	  };
	  return this._s.scheduleRecursiveFuture(state, new Date(this._s.now()), scheduleRecursive);
	};

	module.exports = function generateAbsolute(initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  return new GenerateAbsoluteObservable(initialState, condition, iterate, resultSelector, timeSelector, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var tryCatch = __webpack_require__(15).tryCatch;
	var isScheduler = __webpack_require__(17).isScheduler;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function GenerateRelativeObservable(state, cndFn, itrFn, resFn, timeFn, s) {
	  this._state = state;
	  this._cndFn = cndFn;
	  this._itrFn = itrFn;
	  this._resFn = resFn;
	  this._timeFn = timeFn;
	  this._s = s;
	  ObservableBase.call(this);
	}

	inherits(GenerateRelativeObservable, ObservableBase);

	function scheduleRecursive(state, recurse) {
	  state.hasResult && state.o.onNext(state.result);

	  if (state.first) {
	    state.first = false;
	  } else {
	    state.newState = tryCatch(state.self._itrFn)(state.newState);
	    if (state.newState === global._Rx.errorObj) {
	      return state.o.onError(state.newState.e);
	    }
	  }
	  state.hasResult = tryCatch(state.self._cndFn)(state.newState);
	  if (state.hasResult === global._Rx.errorObj) {
	    return state.o.onError(state.hasResult.e);
	  }
	  if (state.hasResult) {
	    state.result = tryCatch(state.self._resFn)(state.newState);
	    if (state.result === global._Rx.errorObj) {
	      return state.o.onError(state.result.e);
	    }
	    var time = tryCatch(state.self._timeFn)(state.newState);
	    if (time === global._Rx.errorObj) {
	      return state.o.onError(time.e);
	    }
	    recurse(state, time);
	  } else {
	    state.o.onCompleted();
	  }
	}

	GenerateRelativeObservable.prototype.subscribeCore = function (o) {
	  var state = {
	    o: o,
	    self: this,
	    newState: this._state,
	    first: true,
	    hasResult: false
	  };
	  return this._s.scheduleRecursiveFuture(state, 0, scheduleRecursive);
	};

	module.exports = function generateRelative(initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  return new GenerateRelativeObservable(initialState, condition, iterate, resultSelector, timeSelector, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var Scheduler = __webpack_require__(17);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function IntervalObservable(period, scheduler) {
	  this._period = period;
	  this._scheduler = scheduler;
	  ObservableBase.call(this);
	}

	inherits(IntervalObservable, ObservableBase);

	function createScheduleMethod(o) {
	  return function scheduleMethod(count) {
	    o.onNext(count);
	    return count + 1;
	  };
	}

	IntervalObservable.prototype.subscribeCore = function (o) {
	  return this._scheduler.schedulePeriodic(0, this._period, createScheduleMethod(o));
	};

	/**
	*  Returns an observable sequence that produces a value after each period.
	* @param {Number} period Period for producing the values in the resulting sequence (specified as an integer denoting milliseconds).
	* @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, Rx.Scheduler.timeout is used.
	* @returns {Observable} An observable sequence that produces a value after each period.
	*/
	module.exports = function interval(period, scheduler) {
	  Scheduler.isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  return new IntervalObservable(period, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var Disposable = __webpack_require__(12);
	var Scheduler = __webpack_require__(17);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.immediateScheduler) {
	  __webpack_require__(40);
	}

	function scheduleItem(s, state) {
	  var value = state[0],
	      observer = state[1];
	  observer.onNext(value);
	  observer.onCompleted();
	  return Disposable.empty;
	}

	function JustObservable(value, scheduler) {
	  this._value = value;
	  this._scheduler = scheduler;
	  ObservableBase.call(this);
	}

	inherits(JustObservable, ObservableBase);

	JustObservable.prototype.subscribeCore = function (o) {
	  var state = [this._value, o];
	  return this._scheduler === global._Rx.immediateScheduler ? scheduleItem(null, state) : this._scheduler.schedule(state, scheduleItem);
	};

	module.exports = function just(value, scheduler) {
	  Scheduler.isScheduler(scheduler) || (scheduler = global._Rx.immediateScheduler);
	  return new JustObservable(value, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var fromArray = __webpack_require__(53);
	var mergeAll = __webpack_require__(66);
	var isScheduler = __webpack_require__(17).isScheduler;

	global._Rx || (global._Rx = {});
	if (!global._Rx.immediateScheduler) {
	  __webpack_require__(40);
	}

	module.exports = function merge() {
	  var scheduler,
	      sources = [],
	      i,
	      len = arguments.length;
	  if (!arguments[0]) {
	    scheduler = global._Rx.immediateScheduler;
	    for (i = 1; i < len; i++) {
	      sources.push(arguments[i]);
	    }
	  } else if (isScheduler(arguments[0])) {
	    scheduler = arguments[0];
	    for (i = 1; i < len; i++) {
	      sources.push(arguments[i]);
	    }
	  } else {
	    scheduler = global._Rx.immediateScheduler;
	    for (i = 0; i < len; i++) {
	      sources.push(arguments[i]);
	    }
	  }
	  return mergeAll(fromArray(sources, scheduler));
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AbstractObserver = __webpack_require__(5);
	var ObservableBase = __webpack_require__(11);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var CompositeDisposable = __webpack_require__(18);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var inherits = __webpack_require__(6);

	function InnerObserver(parent, sad) {
	  this._parent = parent;
	  this._sad = sad;
	  AbstractObserver.call(this);
	}

	inherits(InnerObserver, AbstractObserver);

	InnerObserver.prototype.next = function (x) {
	  this._parent._o.onNext(x);
	};
	InnerObserver.prototype.error = function (e) {
	  this._parent._o.onError(e);
	};
	InnerObserver.prototype.completed = function () {
	  this._parent._g.remove(this._sad);
	  this._parent._done && this._parent._g.length === 1 && this._parent._o.onCompleted();
	};

	function MergeAllObserver(o, g) {
	  this._o = o;
	  this._g = g;
	  this._done = false;
	  AbstractObserver.call(this);
	}

	inherits(MergeAllObserver, AbstractObserver);

	MergeAllObserver.prototype.next = function (innerSource) {
	  var sad = new SingleAssignmentDisposable();
	  this._g.add(sad);
	  isPromise(innerSource) && (innerSource = fromPromise(innerSource));
	  sad.setDisposable(innerSource.subscribe(new InnerObserver(this, sad)));
	};
	MergeAllObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	MergeAllObserver.prototype.completed = function () {
	  this._done = true;this._g.length === 1 && this._o.onCompleted();
	};

	function MergeAllObservable(source) {
	  this.source = source;
	  ObservableBase.call(this);
	}

	inherits(MergeAllObservable, ObservableBase);

	MergeAllObservable.prototype.subscribeCore = function (o) {
	  var g = new CompositeDisposable(),
	      m = new SingleAssignmentDisposable();
	  g.add(m);
	  m.setDisposable(this.source.subscribe(new MergeAllObserver(o, g)));
	  return g;
	};

	/**
	* Merges an observable sequence of observable sequences into an observable sequence.
	* @returns {Observable} The observable sequence that merges the elements of the inner sequences.
	*/
	module.exports = function mergeAll(sources) {
	  return new MergeAllObservable(sources);
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var fromArray = __webpack_require__(53);

	module.exports = function () {
	  var len = arguments.length,
	      args = new Array(len);
	  for (var i = 0; i < len; i++) {
	    args[i] = arguments[i];
	  }
	  return fromArray(args);
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var fromArray = __webpack_require__(53);

	/**
	*  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
	* @param {Scheduler} scheduler A scheduler to use for scheduling the arguments.
	* @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
	*/
	module.exports = function ofscheduled() {
	  var len = arguments.length,
	      args = new Array(len - 1),
	      scheduler = arguments[0];
	  for (var i = 1; i < len; i++) {
	    args[i - 1] = arguments[i];
	  }
	  return fromArray(args, scheduler);
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var AbstractObserver = __webpack_require__(5);
	var BinaryDisposable = __webpack_require__(23);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.immediateScheduler) {
	  __webpack_require__(40);
	}

	function OnErrorResumeNextObserver(state, recurse) {
	  this._state = state;
	  this._recurse = recurse;
	  AbstractObserver.call(this);
	}

	inherits(OnErrorResumeNextObserver, AbstractObserver);

	OnErrorResumeNextObserver.prototype.next = function (x) {
	  this._state.o.onNext(x);
	};
	OnErrorResumeNextObserver.prototype.error = function () {
	  this._recurse(this._state);
	};
	OnErrorResumeNextObserver.prototype.completed = function () {
	  this._recurse(this._state);
	};

	function OnErrorResumeNextObservable(sources) {
	  this.sources = sources;
	  ObservableBase.call(this);
	}

	inherits(OnErrorResumeNextObservable, ObservableBase);

	function scheduleMethod(state, recurse) {
	  if (state.pos < state.sources.length) {
	    var current = state.sources[state.pos++];
	    isPromise(current) && (current = fromPromise(current));
	    var d = new SingleAssignmentDisposable();
	    state.subscription.setDisposable(d);
	    d.setDisposable(current.subscribe(new OnErrorResumeNextObserver(state, recurse)));
	  } else {
	    state.o.onCompleted();
	  }
	}

	OnErrorResumeNextObservable.prototype.subscribeCore = function (o) {
	  var subscription = new SerialDisposable(),
	      state = {
	    pos: 0,
	    subscription: subscription,
	    o: o,
	    sources: this.sources
	  },
	      cancellable = global._Rx.immediateScheduler.scheduleRecursive(state, scheduleMethod);
	  return new BinaryDisposable(subscription, cancellable);
	};

	/**
	 * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
	 * @returns {Observable} An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.
	 */
	module.exports = function onErrorResumeNext() {
	  var len = arguments.length,
	      sources = new Array(len);
	  for (var i = 0; i < len; i++) {
	    sources[i] = arguments[i];
	  }
	  return new OnErrorResumeNextObservable(sources);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var Scheduler = __webpack_require__(17);
	var inherits = __webpack_require__(6);

	function scheduleMethod(o, obj, keys) {
	  return function loopRecursive(i, recurse) {
	    if (i < keys.length) {
	      var key = keys[i];
	      o.onNext([key, obj[key]]);
	      recurse(i + 1);
	    } else {
	      o.onCompleted();
	    }
	  };
	}

	function PairsObservable(o, scheduler) {
	  this._o = o;
	  this._keys = Object.keys(o);
	  this._scheduler = scheduler;
	  ObservableBase.call(this);
	}

	inherits(PairsObservable, ObservableBase);

	PairsObservable.prototype.subscribeCore = function (o) {
	  return this._scheduler.scheduleRecursive(0, scheduleMethod(o, this._o, this._keys));
	};

	module.exports = function pairs(obj, scheduler) {
	  Scheduler.isScheduler(scheduler) || (scheduler = global._Rx.currentThreadScheduler);
	  return new PairsObservable(obj, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var Scheduler = __webpack_require__(17);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.currentThreadScheduler) {
	  __webpack_require__(16);
	}

	function RangeObservable(start, count, scheduler) {
	  this.start = start;
	  this.rangeCount = count;
	  this.scheduler = scheduler;
	  ObservableBase.call(this);
	}

	inherits(RangeObservable, ObservableBase);

	function loopRecursive(start, count, o) {
	  return function loop(i, recurse) {
	    if (i < count) {
	      o.onNext(start + i);
	      recurse(i + 1);
	    } else {
	      o.onCompleted();
	    }
	  };
	}

	RangeObservable.prototype.subscribeCore = function (o) {
	  return this.scheduler.scheduleRecursive(0, loopRecursive(this.start, this.rangeCount, o));
	};

	/**
	*  Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
	* @param {Number} start The value of the first integer in the sequence.
	* @param {Number} count The number of sequential integers to generate.
	* @param {Scheduler} [scheduler] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.
	* @returns {Observable} An observable sequence that contains a range of sequential integral numbers.
	*/
	module.exports = function range(start, count, scheduler) {
	  Scheduler.isScheduler(scheduler) || (scheduler = global._Rx.currentThreadScheduler);
	  return new RangeObservable(start, count, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var just = __webpack_require__(64);
	var repeat = __webpack_require__(73);
	var isScheduler = __webpack_require__(17).isScheduler;

	global._Rx || (global._Rx = {});
	if (!global._Rx.currentThreadScheduler) {
	  __webpack_require__(16);
	}

	module.exports = function repeatValue(value, repeatCount, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.currentThreadScheduler);
	  return repeat(just(value, scheduler), repeatCount);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var AbstractObserver = __webpack_require__(5);
	var NAryDisposable = __webpack_require__(43);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.currentThreadScheduler) {
	  __webpack_require__(16);
	}

	var $iterator$ = '@@iterator';

	function repeatValue(value, count) {
	  count == null && (count = -1);
	  return {
	    '@@iterator': function () {
	      return {
	        remaining: count,
	        next: function () {
	          if (this.remaining === 0) {
	            return { done: true, value: undefined };
	          }
	          if (this.remaining > 0) {
	            this.remaining--;
	          }
	          return { done: false, value: value };
	        }
	      };
	    }
	  };
	}

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

	function ConcatObserver(state, recurse) {
	  this._state = state;
	  this._recurse = recurse;
	  AbstractObserver.call(this);
	}

	inherits(ConcatObserver, AbstractObserver);

	ConcatObserver.prototype.next = function (x) {
	  this._state.o.onNext(x);
	};
	ConcatObserver.prototype.error = function (e) {
	  this._state.o.onError(e);
	};
	ConcatObserver.prototype.completed = function () {
	  this._recurse(this._state);
	};

	function ConcatObservable(sources) {
	  this.sources = sources;
	  ObservableBase.call(this);
	}

	inherits(ConcatObservable, ObservableBase);

	function scheduleMethod(state, recurse) {
	  if (state.isDisposed) {
	    return;
	  }
	  var currentItem = state.e.next();
	  if (currentItem.done) {
	    return state.o.onCompleted();
	  }

	  // Check if promise
	  var currentValue = currentItem.value;
	  isPromise(currentValue) && (currentValue = fromPromise(currentValue));

	  var d = new SingleAssignmentDisposable();
	  state.subscription.setDisposable(d);
	  d.setDisposable(currentValue.subscribe(new ConcatObserver(state, recurse)));
	}

	ConcatObservable.prototype.subscribeCore = function (o) {
	  var subscription = new SerialDisposable();
	  var state = {
	    isDisposed: false,
	    o: o,
	    subscription: subscription,
	    e: this.sources[$iterator$]()
	  };

	  var cancelable = global._Rx.currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
	  return new NAryDisposable([subscription, cancelable, createDisposable(state)]);
	};

	module.exports = function repeat(source, repeatCount) {
	  return new ConcatObservable(repeatValue(source, repeatCount));
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var fromArray = __webpack_require__(50);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var AbstractObserver = __webpack_require__(5);
	var BinaryDisposable = __webpack_require__(23);
	var isEqual = __webpack_require__(75);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	var $iterator$ = typeof global.Symbol === 'function' && global.Symbol.iterator || '_es6shim_iterator_';
	// Bug for mozilla version
	if (global.Set && typeof new global.Set()['@@iterator'] === 'function') {
	  $iterator$ = '@@iterator';
	}

	function isIterable(o) {
	  return o && o[$iterator$] !== undefined;
	}

	function isArrayLike(o) {
	  return o && o.length !== undefined;
	}

	function FirstObserver(state) {
	  this._s = state;
	  AbstractObserver.call(this);
	}

	inherits(FirstObserver, AbstractObserver);

	FirstObserver.prototype.next = function (x) {
	  if (this._s.qr.length > 0) {
	    var v = this._s.qr.shift();
	    var equal = tryCatch(this._s.cmp)(v, x);
	    if (equal === global._Rx.errorObj) {
	      return this._s.o.onError(equal.e);
	    }
	    if (!equal) {
	      this._s.o.onNext(false);
	      this._s.o.onCompleted();
	    }
	  } else if (this._s.doner) {
	    this._s.o.onNext(false);
	    this._s.o.onCompleted();
	  } else {
	    this._s.ql.push(x);
	  }
	};

	FirstObserver.prototype.error = function (e) {
	  this._s.o.onError(e);
	};

	FirstObserver.prototype.completed = function () {
	  this._s.donel = true;
	  if (this._s.ql.length === 0) {
	    if (this._s.qr.length > 0) {
	      this._s.o.onNext(false);
	      this._s.o.onCompleted();
	    } else if (this._s.doner) {
	      this._s.o.onNext(true);
	      this._s.o.onCompleted();
	    }
	  }
	};

	function SecondObserver(state) {
	  this._s = state;
	  AbstractObserver.call(this);
	}

	inherits(SecondObserver, AbstractObserver);

	SecondObserver.prototype.next = function (x) {
	  if (this._s.ql.length > 0) {
	    var v = this._s.ql.shift();
	    var equal = tryCatch(this._s.cmp)(v, x);
	    if (equal === global._Rx.errorObj) {
	      return this._s.o.onError(equal.e);
	    }
	    if (!equal) {
	      this._s.o.onNext(false);
	      this._s.o.onCompleted();
	    }
	  } else if (this._s.donel) {
	    this._s.o.onNext(false);
	    this._s.o.onCompleted();
	  } else {
	    this._s.qr.push(x);
	  }
	};

	SecondObserver.prototype.error = function (e) {
	  this._s.o.onError(e);
	};

	SecondObserver.prototype.completed = function () {
	  this._s.doner = true;
	  if (this._s.qr.length === 0) {
	    if (this._s.ql.length > 0) {
	      this._s.o.onNext(false);
	      this._s.o.onCompleted();
	    } else if (this._s.donel) {
	      this._s.o.onNext(true);
	      this._s.o.onCompleted();
	    }
	  }
	};

	function SequenceEqualObservable(first, second, comparer) {
	  this._first = first;
	  this._second = second;
	  this._cmp = comparer;
	  ObservableBase.call(this);
	}

	inherits(SequenceEqualObservable, ObservableBase);

	SequenceEqualObservable.prototype.subscribeCore = function (o) {
	  (isArrayLike(this._first) || isIterable(this._first)) && (this._first = fromArray(this._first));
	  isPromise(this._first) && (this._first = fromPromise(this._first));

	  (isArrayLike(this._second) || isIterable(this._second)) && (this._second = fromArray(this._second));
	  isPromise(this._second) && (this._second = fromPromise(this._second));

	  var state = {
	    o: o,
	    donel: false,
	    doner: false,
	    ql: [],
	    qr: [],
	    cmp: this._cmp
	  };

	  return new BinaryDisposable(this._first.subscribe(new FirstObserver(state)), this._second.subscribe(new SecondObserver(state)));
	};

	module.exports = function sequenceEqual(first, second, comparer) {
	  comparer || (comparer = isEqual);
	  return new SequenceEqualObservable(first, second, comparer);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 75 */
/***/ function(module, exports) {

	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

	var objectProto = Object.prototype,
	    hasOwnProperty = objectProto.hasOwnProperty,
	    objToString = objectProto.toString,
	    MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

	var keys = Object.keys || function () {
	  var hasOwnProperty = Object.prototype.hasOwnProperty,
	      hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
	      dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
	      dontEnumsLength = dontEnums.length;

	  return function (obj) {
	    if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
	      throw new TypeError('Object.keys called on non-object');
	    }

	    var result = [],
	        prop,
	        i;

	    for (prop in obj) {
	      if (hasOwnProperty.call(obj, prop)) {
	        result.push(prop);
	      }
	    }

	    if (hasDontEnumBug) {
	      for (i = 0; i < dontEnumsLength; i++) {
	        if (hasOwnProperty.call(obj, dontEnums[i])) {
	          result.push(dontEnums[i]);
	        }
	      }
	    }
	    return result;
	  };
	}();

	function equalObjects(object, other, equalFunc, isLoose, stackA, stackB) {
	  var objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;

	  if (objLength !== othLength && !isLoose) {
	    return false;
	  }
	  var index = objLength,
	      key;
	  while (index--) {
	    key = objProps[index];
	    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
	      return false;
	    }
	  }
	  var skipCtor = isLoose;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key],
	        result;

	    if (!(result === undefined ? equalFunc(objValue, othValue, isLoose, stackA, stackB) : result)) {
	      return false;
	    }
	    skipCtor || (skipCtor = key === 'constructor');
	  }
	  if (!skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    if (objCtor !== othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor === 'function' && objCtor instanceof objCtor && typeof othCtor === 'function' && othCtor instanceof othCtor)) {
	      return false;
	    }
	  }
	  return true;
	}

	function equalByTag(object, other, tag) {
	  switch (tag) {
	    case boolTag:
	    case dateTag:
	      return +object === +other;

	    case errorTag:
	      return object.name === other.name && object.message === other.message;

	    case numberTag:
	      return object !== +object ? other !== +other : object === +other;

	    case regexpTag:
	    case stringTag:
	      return object === other + '';
	  }
	  return false;
	}

	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type === 'object' || type === 'function');
	}

	function isObjectLike(value) {
	  return !!value && typeof value === 'object';
	}

	function isLength(value) {
	  return typeof value === 'number' && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER;
	}

	var isHostObject = function () {
	  try {
	    Object({ 'toString': 0 } + '');
	  } catch (e) {
	    return function () {
	      return false;
	    };
	  }
	  return function (value) {
	    return typeof value.toString !== 'function' && typeof (value + '') === 'string';
	  };
	}();

	function isTypedArray(value) {
	  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	}

	var isArray = Array.isArray || function (value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) === arrayTag;
	};

	function arraySome(array, predicate) {
	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	function equalArrays(array, other, equalFunc, isLoose, stackA, stackB) {
	  var index = -1,
	      arrLength = array.length,
	      othLength = other.length;

	  if (arrLength !== othLength && !(isLoose && othLength > arrLength)) {
	    return false;
	  }
	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index],
	        result;

	    if (result !== undefined) {
	      if (result) {
	        continue;
	      }
	      return false;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (isLoose) {
	      if (!arraySome(other, function (othValue) {
	        return arrValue === othValue || equalFunc(arrValue, othValue, isLoose, stackA, stackB);
	      })) {
	        return false;
	      }
	    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, isLoose, stackA, stackB))) {
	      return false;
	    }
	  }
	  return true;
	}

	function baseIsEqualDeep(object, other, equalFunc, isLoose, stackA, stackB) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;

	  if (!objIsArr) {
	    objTag = objToString.call(object);
	    if (objTag === argsTag) {
	      objTag = objectTag;
	    } else if (objTag !== objectTag) {
	      objIsArr = isTypedArray(object);
	    }
	  }
	  if (!othIsArr) {
	    othTag = objToString.call(other);
	    if (othTag === argsTag) {
	      othTag = objectTag;
	    } else if (othTag !== objectTag) {
	      othIsArr = isTypedArray(other);
	    }
	  }
	  var objIsObj = objTag === objectTag && !isHostObject(object),
	      othIsObj = othTag === objectTag && !isHostObject(other),
	      isSameTag = objTag === othTag;

	  if (isSameTag && !(objIsArr || objIsObj)) {
	    return equalByTag(object, other, objTag);
	  }
	  if (!isLoose) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	    if (objIsWrapped || othIsWrapped) {
	      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, isLoose, stackA, stackB);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  // For more information on detecting circular references see https://es5.github.io/#JO.
	  stackA || (stackA = []);
	  stackB || (stackB = []);

	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] === object) {
	      return stackB[length] === other;
	    }
	  }
	  // Add `object` and `other` to the stack of traversed objects.
	  stackA.push(object);
	  stackB.push(other);

	  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, isLoose, stackA, stackB);

	  stackA.pop();
	  stackB.pop();

	  return result;
	}

	function baseIsEqual(value, other, isLoose, stackA, stackB) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || !isObject(value) && !isObjectLike(other)) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, isLoose, stackA, stackB);
	}

	module.exports = function (value, other) {
	  return baseIsEqual(value, other);
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toAsync = __webpack_require__(77);

	module.exports = function start(func, context, scheduler) {
	  return toAsync(func, context, scheduler)();
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var AsyncSubject = __webpack_require__(30);
	var asObservable = __webpack_require__(34);
	var isScheduler = __webpack_require__(17).isScheduler;
	var tryCatch = __webpack_require__(15).tryCatch;

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function scheduleMethod(s, state) {
	  var result = tryCatch(state.func).apply(state.context, state.args);
	  if (result === global._Rx.errorObj) {
	    return state.subject.onError(result.e);
	  }
	  state.subject.onNext(result);
	  state.subject.onCompleted();
	}

	module.exports = function toAsync(func, context, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  return function asyncFn() {
	    var subject = new AsyncSubject(),
	        len = arguments.length,
	        args = new Array(len);
	    for (var i = 0; i < len; i++) {
	      args[i] = arguments[i];
	    }
	    var state = {
	      subject: subject,
	      args: args,
	      func: func,
	      context: context
	    };

	    scheduler.schedule(state, scheduleMethod);
	    return asObservable(subject);
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var fromPromise = __webpack_require__(24);
	var throwError = __webpack_require__(39);
	var tryCatch = __webpack_require__(15).tryCatch;

	module.exports = function startAsync(functionAsync) {
	  var promise = tryCatch(functionAsync)();
	  if (promise === global._Rx.errorObj) {
	    return throwError(promise.e);
	  }
	  return fromPromise(promise);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var defer = __webpack_require__(38);
	var interval = __webpack_require__(63);
	var Scheduler = __webpack_require__(17);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function TimerObservable(dt, s) {
	  this._dt = dt;
	  this._s = s;
	  ObservableBase.call(this);
	}

	inherits(TimerObservable, ObservableBase);

	function scheduleTimer(s, o) {
	  o.onNext(0);
	  o.onCompleted();
	}

	TimerObservable.prototype.subscribeCore = function (o) {
	  return this._s.scheduleFuture(o, this._dt, scheduleTimer);
	};

	function TimerPeriodObservable(dt, period, scheduler) {
	  this._dt = dt;
	  this._period = Scheduler.normalize(period);
	  this._scheduler = scheduler;
	  ObservableBase.call(this);
	}

	inherits(TimerPeriodObservable, ObservableBase);

	function scheduleTimerPeriod(state, recurse) {
	  if (state.p > 0) {
	    var now = state.scheduler.now();
	    state.dt = new Date(state.dt.getTime() + state.p);
	    state.dt.getTime() <= now && (state.dt = new Date(now + state.p));
	  }
	  state.o.onNext(state.i++);
	  recurse(state, new Date(state.dt));
	}

	TimerPeriodObservable.prototype.subscribeCore = function (o) {
	  var state = {
	    o: o,
	    i: 0,
	    p: this._period,
	    dt: this._dt,
	    scheduler: this._scheduler
	  };
	  return this._scheduler.scheduleRecursiveFuture(state, this._dt, scheduleTimerPeriod);
	};

	function timerRelativeAndPeriod(dt, period, scheduler) {
	  if (dt === period) {
	    return interval(dt, scheduler);
	  }
	  return defer(function () {
	    return new TimerPeriodObservable(new Date(scheduler.now() + dt), period, scheduler);
	  });
	}

	/**
	 *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
	 * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
	 * @param {Mixed} [periodOrScheduler]  Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
	 * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, the timeout scheduler is used.
	 * @returns {Observable} An observable sequence that produces a value after due time has elapsed and then each period.
	 */
	module.exports = function timer(dueTime, periodOrScheduler, scheduler) {
	  var period;
	  Scheduler.isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  if (periodOrScheduler != null && typeof periodOrScheduler === 'number') {
	    period = periodOrScheduler;
	  } else if (Scheduler.isScheduler(periodOrScheduler)) {
	    scheduler = periodOrScheduler;
	  }
	  if ((dueTime instanceof Date || typeof dueTime === 'number') && period === undefined) {
	    return new TimerObservable(dueTime, scheduler);
	  }
	  if (dueTime instanceof Date && period !== undefined) {
	    return new TimerPeriodObservable(dueTime, periodOrScheduler, scheduler);
	  }
	  return timerRelativeAndPeriod(dueTime, period, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var throwError = __webpack_require__(39);
	var CompositeDisposable = __webpack_require__(18);
	var inherits = __webpack_require__(6);

	__webpack_require__(81);

	function WhenObserver(map, o) {
	  this._map = map;
	  this._o = o;
	  AbstractObserver.call(this);
	}

	inherits(WhenObserver, AbstractObserver);

	WhenObserver.prototype.next = function (x) {
	  this._o.onNext(x);
	};
	WhenObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};
	WhenObserver.prototype.error = function (e) {
	  this._map.forEach(function (v) {
	    v.onError(e);
	  });
	  this._o.onError(e);
	};

	function WhenObservable(plans) {
	  this._plans = plans;
	  ObservableBase.call(this);
	}

	inherits(WhenObservable, ObservableBase);

	WhenObservable.prototype.subscribeCore = function (o) {
	  var activePlans = [],
	      externalSubscriptions = new global.Map(),
	      outObserver = new WhenObserver(externalSubscriptions, o);

	  try {
	    for (var i = 0, len = this._plans.length; i < len; i++) {
	      activePlans.push(this._plans[i].activate(externalSubscriptions, outObserver, function (activePlan) {
	        var idx = activePlans.indexOf(activePlan);
	        activePlans.splice(idx, 1);
	        activePlans.length === 0 && o.onCompleted();
	      }));
	    }
	  } catch (e) {
	    return throwError(e).subscribe(o);
	  }
	  var group = new CompositeDisposable();
	  externalSubscriptions.forEach(function (joinObserver) {
	    joinObserver.subscribe();
	    group.add(joinObserver);
	  });

	  return group;
	};

	/**
	 *  Joins together the results from several patterns.
	 *
	 *  @param plans A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.
	 *  @returns {Observable} Observable sequence with the results form matching several patterns.
	 */
	module.exports = function when() {
	  var len = arguments.length,
	      plans = new Array(len);
	  for (var i = 0; i < len; i++) {
	    plans[i] = arguments[i];
	  }
	  return new WhenObservable(plans);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	if (!__webpack_require__(82)()) {
		Object.defineProperty(__webpack_require__(83), 'Map',
			{ value: __webpack_require__(84), configurable: true, enumerable: false,
				writable: true });
	}


/***/ },
/* 82 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var map, iterator, result;
		if (typeof Map !== 'function') return false;
		try {
			// WebKit doesn't support arguments and crashes
			map = new Map([['raz', 'one'], ['dwa', 'two'], ['trzy', 'three']]);
		} catch (e) {
			return false;
		}
		if (String(map) !== '[object Map]') return false;
		if (map.size !== 3) return false;
		if (typeof map.clear !== 'function') return false;
		if (typeof map.delete !== 'function') return false;
		if (typeof map.entries !== 'function') return false;
		if (typeof map.forEach !== 'function') return false;
		if (typeof map.get !== 'function') return false;
		if (typeof map.has !== 'function') return false;
		if (typeof map.keys !== 'function') return false;
		if (typeof map.set !== 'function') return false;
		if (typeof map.values !== 'function') return false;

		iterator = map.entries();
		result = iterator.next();
		if (result.done !== false) return false;
		if (!result.value) return false;
		if (result.value[0] !== 'raz') return false;
		if (result.value[1] !== 'one') return false;

		return true;
	};


/***/ },
/* 83 */
/***/ function(module, exports) {

	'use strict';

	module.exports = new Function("return this")();


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var clear          = __webpack_require__(85)
	  , eIndexOf       = __webpack_require__(87)
	  , setPrototypeOf = __webpack_require__(93)
	  , callable       = __webpack_require__(98)
	  , validValue     = __webpack_require__(86)
	  , d              = __webpack_require__(99)
	  , ee             = __webpack_require__(111)
	  , Symbol         = __webpack_require__(112)
	  , iterator       = __webpack_require__(117)
	  , forOf          = __webpack_require__(121)
	  , Iterator       = __webpack_require__(131)
	  , isNative       = __webpack_require__(134)

	  , call = Function.prototype.call
	  , defineProperties = Object.defineProperties, getPrototypeOf = Object.getPrototypeOf
	  , MapPoly;

	module.exports = MapPoly = function (/*iterable*/) {
		var iterable = arguments[0], keys, values, self;
		if (!(this instanceof MapPoly)) throw new TypeError('Constructor requires \'new\'');
		if (isNative && setPrototypeOf && (Map !== MapPoly)) {
			self = setPrototypeOf(new Map(), getPrototypeOf(this));
		} else {
			self = this;
		}
		if (iterable != null) iterator(iterable);
		defineProperties(self, {
			__mapKeysData__: d('c', keys = []),
			__mapValuesData__: d('c', values = [])
		});
		if (!iterable) return self;
		forOf(iterable, function (value) {
			var key = validValue(value)[0];
			value = value[1];
			if (eIndexOf.call(keys, key) !== -1) return;
			keys.push(key);
			values.push(value);
		}, self);
		return self;
	};

	if (isNative) {
		if (setPrototypeOf) setPrototypeOf(MapPoly, Map);
		MapPoly.prototype = Object.create(Map.prototype, {
			constructor: d(MapPoly)
		});
	}

	ee(defineProperties(MapPoly.prototype, {
		clear: d(function () {
			if (!this.__mapKeysData__.length) return;
			clear.call(this.__mapKeysData__);
			clear.call(this.__mapValuesData__);
			this.emit('_clear');
		}),
		delete: d(function (key) {
			var index = eIndexOf.call(this.__mapKeysData__, key);
			if (index === -1) return false;
			this.__mapKeysData__.splice(index, 1);
			this.__mapValuesData__.splice(index, 1);
			this.emit('_delete', index, key);
			return true;
		}),
		entries: d(function () { return new Iterator(this, 'key+value'); }),
		forEach: d(function (cb/*, thisArg*/) {
			var thisArg = arguments[1], iterator, result;
			callable(cb);
			iterator = this.entries();
			result = iterator._next();
			while (result !== undefined) {
				call.call(cb, thisArg, this.__mapValuesData__[result],
					this.__mapKeysData__[result], this);
				result = iterator._next();
			}
		}),
		get: d(function (key) {
			var index = eIndexOf.call(this.__mapKeysData__, key);
			if (index === -1) return;
			return this.__mapValuesData__[index];
		}),
		has: d(function (key) {
			return (eIndexOf.call(this.__mapKeysData__, key) !== -1);
		}),
		keys: d(function () { return new Iterator(this, 'key'); }),
		set: d(function (key, value) {
			var index = eIndexOf.call(this.__mapKeysData__, key), emit;
			if (index === -1) {
				index = this.__mapKeysData__.push(key) - 1;
				emit = true;
			}
			this.__mapValuesData__[index] = value;
			if (emit) this.emit('_add', index, key);
			return this;
		}),
		size: d.gs(function () { return this.__mapKeysData__.length; }),
		values: d(function () { return new Iterator(this, 'value'); }),
		toString: d(function () { return '[object Map]'; })
	}));
	Object.defineProperty(MapPoly.prototype, Symbol.iterator, d(function () {
		return this.entries();
	}));
	Object.defineProperty(MapPoly.prototype, Symbol.toStringTag, d('c', 'Map'));


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	// Inspired by Google Closure:
	// http://closure-library.googlecode.com/svn/docs/
	// closure_goog_array_array.js.html#goog.array.clear

	'use strict';

	var value = __webpack_require__(86);

	module.exports = function () {
		value(this).length = 0;
		return this;
	};


/***/ },
/* 86 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (value) {
		if (value == null) throw new TypeError("Cannot use null or undefined");
		return value;
	};


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toPosInt = __webpack_require__(88)
	  , value    = __webpack_require__(86)

	  , indexOf = Array.prototype.indexOf
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , abs = Math.abs, floor = Math.floor;

	module.exports = function (searchElement/*, fromIndex*/) {
		var i, l, fromIndex, val;
		if (searchElement === searchElement) { //jslint: ignore
			return indexOf.apply(this, arguments);
		}

		l = toPosInt(value(this).length);
		fromIndex = arguments[1];
		if (isNaN(fromIndex)) fromIndex = 0;
		else if (fromIndex >= 0) fromIndex = floor(fromIndex);
		else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

		for (i = fromIndex; i < l; ++i) {
			if (hasOwnProperty.call(this, i)) {
				val = this[i];
				if (val !== val) return i; //jslint: ignore
			}
		}
		return -1;
	};


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toInteger = __webpack_require__(89)

	  , max = Math.max;

	module.exports = function (value) { return max(0, toInteger(value)); };


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var sign = __webpack_require__(90)

	  , abs = Math.abs, floor = Math.floor;

	module.exports = function (value) {
		if (isNaN(value)) return 0;
		value = Number(value);
		if ((value === 0) || !isFinite(value)) return value;
		return sign(value) * floor(abs(value));
	};


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(91)()
		? Math.sign
		: __webpack_require__(92);


/***/ },
/* 91 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var sign = Math.sign;
		if (typeof sign !== 'function') return false;
		return ((sign(10) === 1) && (sign(-20) === -1));
	};


/***/ },
/* 92 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (value) {
		value = Number(value);
		if (isNaN(value) || (value === 0)) return value;
		return (value > 0) ? 1 : -1;
	};


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(94)()
		? Object.setPrototypeOf
		: __webpack_require__(95);


/***/ },
/* 94 */
/***/ function(module, exports) {

	'use strict';

	var create = Object.create, getPrototypeOf = Object.getPrototypeOf
	  , x = {};

	module.exports = function (/*customCreate*/) {
		var setPrototypeOf = Object.setPrototypeOf
		  , customCreate = arguments[0] || create;
		if (typeof setPrototypeOf !== 'function') return false;
		return getPrototypeOf(setPrototypeOf(customCreate(null), x)) === x;
	};


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	// Big thanks to @WebReflection for sorting this out
	// https://gist.github.com/WebReflection/5593554

	'use strict';

	var isObject      = __webpack_require__(96)
	  , value         = __webpack_require__(86)

	  , isPrototypeOf = Object.prototype.isPrototypeOf
	  , defineProperty = Object.defineProperty
	  , nullDesc = { configurable: true, enumerable: false, writable: true,
			value: undefined }
	  , validate;

	validate = function (obj, prototype) {
		value(obj);
		if ((prototype === null) || isObject(prototype)) return obj;
		throw new TypeError('Prototype must be null or an object');
	};

	module.exports = (function (status) {
		var fn, set;
		if (!status) return null;
		if (status.level === 2) {
			if (status.set) {
				set = status.set;
				fn = function (obj, prototype) {
					set.call(validate(obj, prototype), prototype);
					return obj;
				};
			} else {
				fn = function (obj, prototype) {
					validate(obj, prototype).__proto__ = prototype;
					return obj;
				};
			}
		} else {
			fn = function self(obj, prototype) {
				var isNullBase;
				validate(obj, prototype);
				isNullBase = isPrototypeOf.call(self.nullPolyfill, obj);
				if (isNullBase) delete self.nullPolyfill.__proto__;
				if (prototype === null) prototype = self.nullPolyfill;
				obj.__proto__ = prototype;
				if (isNullBase) defineProperty(self.nullPolyfill, '__proto__', nullDesc);
				return obj;
			};
		}
		return Object.defineProperty(fn, 'level', { configurable: false,
			enumerable: false, writable: false, value: status.level });
	}((function () {
		var x = Object.create(null), y = {}, set
		  , desc = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__');

		if (desc) {
			try {
				set = desc.set; // Opera crashes at this point
				set.call(x, y);
			} catch (ignore) { }
			if (Object.getPrototypeOf(x) === y) return { set: set, level: 2 };
		}

		x.__proto__ = y;
		if (Object.getPrototypeOf(x) === y) return { level: 2 };

		x = {};
		x.__proto__ = y;
		if (Object.getPrototypeOf(x) === y) return { level: 1 };

		return false;
	}())));

	__webpack_require__(97);


/***/ },
/* 96 */
/***/ function(module, exports) {

	'use strict';

	var map = { function: true, object: true };

	module.exports = function (x) {
		return ((x != null) && map[typeof x]) || false;
	};


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	// Workaround for http://code.google.com/p/v8/issues/detail?id=2804

	'use strict';

	var create = Object.create, shim;

	if (!__webpack_require__(94)()) {
		shim = __webpack_require__(95);
	}

	module.exports = (function () {
		var nullObject, props, desc;
		if (!shim) return create;
		if (shim.level !== 1) return create;

		nullObject = {};
		props = {};
		desc = { configurable: false, enumerable: false, writable: true,
			value: undefined };
		Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
			if (name === '__proto__') {
				props[name] = { configurable: true, enumerable: false, writable: true,
					value: undefined };
				return;
			}
			props[name] = desc;
		});
		Object.defineProperties(nullObject, props);

		Object.defineProperty(shim, 'nullPolyfill', { configurable: false,
			enumerable: false, writable: false, value: nullObject });

		return function (prototype, props) {
			return create((prototype === null) ? nullObject : prototype, props);
		};
	}());


/***/ },
/* 98 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (fn) {
		if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
		return fn;
	};


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign        = __webpack_require__(100)
	  , normalizeOpts = __webpack_require__(106)
	  , isCallable    = __webpack_require__(107)
	  , contains      = __webpack_require__(108)

	  , d;

	d = module.exports = function (dscr, value/*, options*/) {
		var c, e, w, options, desc;
		if ((arguments.length < 2) || (typeof dscr !== 'string')) {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (dscr == null) {
			c = w = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
			w = contains.call(dscr, 'w');
		}

		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};

	d.gs = function (dscr, get, set/*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== 'string') {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (get == null) {
			get = undefined;
		} else if (!isCallable(get)) {
			options = get;
			get = set = undefined;
		} else if (set == null) {
			set = undefined;
		} else if (!isCallable(set)) {
			options = set;
			set = undefined;
		}
		if (dscr == null) {
			c = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
		}

		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(101)()
		? Object.assign
		: __webpack_require__(102);


/***/ },
/* 101 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var assign = Object.assign, obj;
		if (typeof assign !== 'function') return false;
		obj = { foo: 'raz' };
		assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
		return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
	};


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys  = __webpack_require__(103)
	  , value = __webpack_require__(86)

	  , max = Math.max;

	module.exports = function (dest, src/*, …srcn*/) {
		var error, i, l = max(arguments.length, 2), assign;
		dest = Object(value(dest));
		assign = function (key) {
			try { dest[key] = src[key]; } catch (e) {
				if (!error) error = e;
			}
		};
		for (i = 1; i < l; ++i) {
			src = arguments[i];
			keys(src).forEach(assign);
		}
		if (error !== undefined) throw error;
		return dest;
	};


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(104)()
		? Object.keys
		: __webpack_require__(105);


/***/ },
/* 104 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		try {
			Object.keys('primitive');
			return true;
		} catch (e) { return false; }
	};


/***/ },
/* 105 */
/***/ function(module, exports) {

	'use strict';

	var keys = Object.keys;

	module.exports = function (object) {
		return keys(object == null ? object : Object(object));
	};


/***/ },
/* 106 */
/***/ function(module, exports) {

	'use strict';

	var forEach = Array.prototype.forEach, create = Object.create;

	var process = function (src, obj) {
		var key;
		for (key in src) obj[key] = src[key];
	};

	module.exports = function (options/*, …options*/) {
		var result = create(null);
		forEach.call(arguments, function (options) {
			if (options == null) return;
			process(Object(options), result);
		});
		return result;
	};


/***/ },
/* 107 */
/***/ function(module, exports) {

	// Deprecated

	'use strict';

	module.exports = function (obj) { return typeof obj === 'function'; };


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(109)()
		? String.prototype.contains
		: __webpack_require__(110);


/***/ },
/* 109 */
/***/ function(module, exports) {

	'use strict';

	var str = 'razdwatrzy';

	module.exports = function () {
		if (typeof str.contains !== 'function') return false;
		return ((str.contains('dwa') === true) && (str.contains('foo') === false));
	};


/***/ },
/* 110 */
/***/ function(module, exports) {

	'use strict';

	var indexOf = String.prototype.indexOf;

	module.exports = function (searchString/*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d        = __webpack_require__(99)
	  , callable = __webpack_require__(98)

	  , apply = Function.prototype.apply, call = Function.prototype.call
	  , create = Object.create, defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , descriptor = { configurable: true, enumerable: false, writable: true }

	  , on, once, off, emit, methods, descriptors, base;

	on = function (type, listener) {
		var data;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) {
			data = descriptor.value = create(null);
			defineProperty(this, '__ee__', descriptor);
			descriptor.value = null;
		} else {
			data = this.__ee__;
		}
		if (!data[type]) data[type] = listener;
		else if (typeof data[type] === 'object') data[type].push(listener);
		else data[type] = [data[type], listener];

		return this;
	};

	once = function (type, listener) {
		var once, self;

		callable(listener);
		self = this;
		on.call(this, type, once = function () {
			off.call(self, type, once);
			apply.call(listener, this, arguments);
		});

		once.__eeOnceListener__ = listener;
		return this;
	};

	off = function (type, listener) {
		var data, listeners, candidate, i;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) return this;
		data = this.__ee__;
		if (!data[type]) return this;
		listeners = data[type];

		if (typeof listeners === 'object') {
			for (i = 0; (candidate = listeners[i]); ++i) {
				if ((candidate === listener) ||
						(candidate.__eeOnceListener__ === listener)) {
					if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
					else listeners.splice(i, 1);
				}
			}
		} else {
			if ((listeners === listener) ||
					(listeners.__eeOnceListener__ === listener)) {
				delete data[type];
			}
		}

		return this;
	};

	emit = function (type) {
		var i, l, listener, listeners, args;

		if (!hasOwnProperty.call(this, '__ee__')) return;
		listeners = this.__ee__[type];
		if (!listeners) return;

		if (typeof listeners === 'object') {
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

			listeners = listeners.slice();
			for (i = 0; (listener = listeners[i]); ++i) {
				apply.call(listener, this, args);
			}
		} else {
			switch (arguments.length) {
			case 1:
				call.call(listeners, this);
				break;
			case 2:
				call.call(listeners, this, arguments[1]);
				break;
			case 3:
				call.call(listeners, this, arguments[1], arguments[2]);
				break;
			default:
				l = arguments.length;
				args = new Array(l - 1);
				for (i = 1; i < l; ++i) {
					args[i - 1] = arguments[i];
				}
				apply.call(listeners, this, args);
			}
		}
	};

	methods = {
		on: on,
		once: once,
		off: off,
		emit: emit
	};

	descriptors = {
		on: d(on),
		once: d(once),
		off: d(off),
		emit: d(emit)
	};

	base = defineProperties({}, descriptors);

	module.exports = exports = function (o) {
		return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
	};
	exports.methods = methods;


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(113)() ? Symbol : __webpack_require__(114);


/***/ },
/* 113 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var symbol;
		if (typeof Symbol !== 'function') return false;
		symbol = Symbol('test symbol');
		try { String(symbol); } catch (e) { return false; }
		if (typeof Symbol.iterator === 'symbol') return true;

		// Return 'true' for polyfills
		if (typeof Symbol.isConcatSpreadable !== 'object') return false;
		if (typeof Symbol.iterator !== 'object') return false;
		if (typeof Symbol.toPrimitive !== 'object') return false;
		if (typeof Symbol.toStringTag !== 'object') return false;
		if (typeof Symbol.unscopables !== 'object') return false;

		return true;
	};


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	// ES2015 Symbol polyfill for environments that do not support it (or partially support it_

	'use strict';

	var d              = __webpack_require__(99)
	  , validateSymbol = __webpack_require__(115)

	  , create = Object.create, defineProperties = Object.defineProperties
	  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
	  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null);

	if (typeof Symbol === 'function') NativeSymbol = Symbol;

	var generateName = (function () {
		var created = create(null);
		return function (desc) {
			var postfix = 0, name, ie11BugWorkaround;
			while (created[desc + (postfix || '')]) ++postfix;
			desc += (postfix || '');
			created[desc] = true;
			name = '@@' + desc;
			defineProperty(objPrototype, name, d.gs(null, function (value) {
				// For IE11 issue see:
				// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
				//    ie11-broken-getters-on-dom-objects
				// https://github.com/medikoo/es6-symbol/issues/12
				if (ie11BugWorkaround) return;
				ie11BugWorkaround = true;
				defineProperty(this, name, d(value));
				ie11BugWorkaround = false;
			}));
			return name;
		};
	}());

	// Internal constructor (not one exposed) for creating Symbol instances.
	// This one is used to ensure that `someSymbol instanceof Symbol` always return false
	HiddenSymbol = function Symbol(description) {
		if (this instanceof HiddenSymbol) throw new TypeError('TypeError: Symbol is not a constructor');
		return SymbolPolyfill(description);
	};

	// Exposed `Symbol` constructor
	// (returns instances of HiddenSymbol)
	module.exports = SymbolPolyfill = function Symbol(description) {
		var symbol;
		if (this instanceof Symbol) throw new TypeError('TypeError: Symbol is not a constructor');
		symbol = create(HiddenSymbol.prototype);
		description = (description === undefined ? '' : String(description));
		return defineProperties(symbol, {
			__description__: d('', description),
			__name__: d('', generateName(description))
		});
	};
	defineProperties(SymbolPolyfill, {
		for: d(function (key) {
			if (globalSymbols[key]) return globalSymbols[key];
			return (globalSymbols[key] = SymbolPolyfill(String(key)));
		}),
		keyFor: d(function (s) {
			var key;
			validateSymbol(s);
			for (key in globalSymbols) if (globalSymbols[key] === s) return key;
		}),

		// If there's native implementation of given symbol, let's fallback to it
		// to ensure proper interoperability with other native functions e.g. Array.from
		hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
		isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
			SymbolPolyfill('isConcatSpreadable')),
		iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
		match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
		replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
		search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
		species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
		split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
		toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
		toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
		unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
	});

	// Internal tweaks for real symbol producer
	defineProperties(HiddenSymbol.prototype, {
		constructor: d(SymbolPolyfill),
		toString: d('', function () { return this.__name__; })
	});

	// Proper implementation of methods exposed on Symbol.prototype
	// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
	defineProperties(SymbolPolyfill.prototype, {
		toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
		valueOf: d(function () { return validateSymbol(this); })
	});
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('',
		function () { return validateSymbol(this); }));
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

	// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

	// Note: It's important to define `toPrimitive` as last one, as some implementations
	// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
	// And that may invoke error in definition flow:
	// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isSymbol = __webpack_require__(116);

	module.exports = function (value) {
		if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
		return value;
	};


/***/ },
/* 116 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (x) {
		return (x && ((typeof x === 'symbol') || (x['@@toStringTag'] === 'Symbol'))) || false;
	};


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isIterable = __webpack_require__(118);

	module.exports = function (value) {
		if (!isIterable(value)) throw new TypeError(value + " is not iterable");
		return value;
	};


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments    = __webpack_require__(119)
	  , isString       = __webpack_require__(120)
	  , iteratorSymbol = __webpack_require__(112).iterator

	  , isArray = Array.isArray;

	module.exports = function (value) {
		if (value == null) return false;
		if (isArray(value)) return true;
		if (isString(value)) return true;
		if (isArguments(value)) return true;
		return (typeof value[iteratorSymbol] === 'function');
	};


/***/ },
/* 119 */
/***/ function(module, exports) {

	'use strict';

	var toString = Object.prototype.toString

	  , id = toString.call((function () { return arguments; }()));

	module.exports = function (x) { return (toString.call(x) === id); };


/***/ },
/* 120 */
/***/ function(module, exports) {

	'use strict';

	var toString = Object.prototype.toString

	  , id = toString.call('');

	module.exports = function (x) {
		return (typeof x === 'string') || (x && (typeof x === 'object') &&
			((x instanceof String) || (toString.call(x) === id))) || false;
	};


/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments = __webpack_require__(119)
	  , callable    = __webpack_require__(98)
	  , isString    = __webpack_require__(120)
	  , get         = __webpack_require__(122)

	  , isArray = Array.isArray, call = Function.prototype.call
	  , some = Array.prototype.some;

	module.exports = function (iterable, cb/*, thisArg*/) {
		var mode, thisArg = arguments[2], result, doBreak, broken, i, l, char, code;
		if (isArray(iterable) || isArguments(iterable)) mode = 'array';
		else if (isString(iterable)) mode = 'string';
		else iterable = get(iterable);

		callable(cb);
		doBreak = function () { broken = true; };
		if (mode === 'array') {
			some.call(iterable, function (value) {
				call.call(cb, thisArg, value, doBreak);
				if (broken) return true;
			});
			return;
		}
		if (mode === 'string') {
			l = iterable.length;
			for (i = 0; i < l; ++i) {
				char = iterable[i];
				if ((i + 1) < l) {
					code = char.charCodeAt(0);
					if ((code >= 0xD800) && (code <= 0xDBFF)) char += iterable[++i];
				}
				call.call(cb, thisArg, char, doBreak);
				if (broken) break;
			}
			return;
		}
		result = iterable.next();

		while (!result.done) {
			call.call(cb, thisArg, result.value, doBreak);
			if (broken) return;
			result = iterable.next();
		}
	};


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments    = __webpack_require__(119)
	  , isString       = __webpack_require__(120)
	  , ArrayIterator  = __webpack_require__(123)
	  , StringIterator = __webpack_require__(130)
	  , iterable       = __webpack_require__(117)
	  , iteratorSymbol = __webpack_require__(112).iterator;

	module.exports = function (obj) {
		if (typeof iterable(obj)[iteratorSymbol] === 'function') return obj[iteratorSymbol]();
		if (isArguments(obj)) return new ArrayIterator(obj);
		if (isString(obj)) return new StringIterator(obj);
		return new ArrayIterator(obj);
	};


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var setPrototypeOf = __webpack_require__(93)
	  , contains       = __webpack_require__(108)
	  , d              = __webpack_require__(99)
	  , Iterator       = __webpack_require__(124)

	  , defineProperty = Object.defineProperty
	  , ArrayIterator;

	ArrayIterator = module.exports = function (arr, kind) {
		if (!(this instanceof ArrayIterator)) return new ArrayIterator(arr, kind);
		Iterator.call(this, arr);
		if (!kind) kind = 'value';
		else if (contains.call(kind, 'key+value')) kind = 'key+value';
		else if (contains.call(kind, 'key')) kind = 'key';
		else kind = 'value';
		defineProperty(this, '__kind__', d('', kind));
	};
	if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

	ArrayIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(ArrayIterator),
		_resolve: d(function (i) {
			if (this.__kind__ === 'value') return this.__list__[i];
			if (this.__kind__ === 'key+value') return [i, this.__list__[i]];
			return i;
		}),
		toString: d(function () { return '[object Array Iterator]'; })
	});


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var clear    = __webpack_require__(85)
	  , assign   = __webpack_require__(100)
	  , callable = __webpack_require__(98)
	  , value    = __webpack_require__(86)
	  , d        = __webpack_require__(99)
	  , autoBind = __webpack_require__(125)
	  , Symbol   = __webpack_require__(112)

	  , defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , Iterator;

	module.exports = Iterator = function (list, context) {
		if (!(this instanceof Iterator)) return new Iterator(list, context);
		defineProperties(this, {
			__list__: d('w', value(list)),
			__context__: d('w', context),
			__nextIndex__: d('w', 0)
		});
		if (!context) return;
		callable(context.on);
		context.on('_add', this._onAdd);
		context.on('_delete', this._onDelete);
		context.on('_clear', this._onClear);
	};

	defineProperties(Iterator.prototype, assign({
		constructor: d(Iterator),
		_next: d(function () {
			var i;
			if (!this.__list__) return;
			if (this.__redo__) {
				i = this.__redo__.shift();
				if (i !== undefined) return i;
			}
			if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
			this._unBind();
		}),
		next: d(function () { return this._createResult(this._next()); }),
		_createResult: d(function (i) {
			if (i === undefined) return { done: true, value: undefined };
			return { done: false, value: this._resolve(i) };
		}),
		_resolve: d(function (i) { return this.__list__[i]; }),
		_unBind: d(function () {
			this.__list__ = null;
			delete this.__redo__;
			if (!this.__context__) return;
			this.__context__.off('_add', this._onAdd);
			this.__context__.off('_delete', this._onDelete);
			this.__context__.off('_clear', this._onClear);
			this.__context__ = null;
		}),
		toString: d(function () { return '[object Iterator]'; })
	}, autoBind({
		_onAdd: d(function (index) {
			if (index >= this.__nextIndex__) return;
			++this.__nextIndex__;
			if (!this.__redo__) {
				defineProperty(this, '__redo__', d('c', [index]));
				return;
			}
			this.__redo__.forEach(function (redo, i) {
				if (redo >= index) this.__redo__[i] = ++redo;
			}, this);
			this.__redo__.push(index);
		}),
		_onDelete: d(function (index) {
			var i;
			if (index >= this.__nextIndex__) return;
			--this.__nextIndex__;
			if (!this.__redo__) return;
			i = this.__redo__.indexOf(index);
			if (i !== -1) this.__redo__.splice(i, 1);
			this.__redo__.forEach(function (redo, i) {
				if (redo > index) this.__redo__[i] = --redo;
			}, this);
		}),
		_onClear: d(function () {
			if (this.__redo__) clear.call(this.__redo__);
			this.__nextIndex__ = 0;
		})
	})));

	defineProperty(Iterator.prototype, Symbol.iterator, d(function () {
		return this;
	}));
	defineProperty(Iterator.prototype, Symbol.toStringTag, d('', 'Iterator'));


/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var copy       = __webpack_require__(126)
	  , map        = __webpack_require__(127)
	  , callable   = __webpack_require__(98)
	  , validValue = __webpack_require__(86)

	  , bind = Function.prototype.bind, defineProperty = Object.defineProperty
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , define;

	define = function (name, desc, bindTo) {
		var value = validValue(desc) && callable(desc.value), dgs;
		dgs = copy(desc);
		delete dgs.writable;
		delete dgs.value;
		dgs.get = function () {
			if (hasOwnProperty.call(this, name)) return value;
			desc.value = bind.call(value, (bindTo == null) ? this : this[bindTo]);
			defineProperty(this, name, desc);
			return this[name];
		};
		return dgs;
	};

	module.exports = function (props/*, bindTo*/) {
		var bindTo = arguments[1];
		return map(props, function (desc, name) {
			return define(name, desc, bindTo);
		});
	};


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign = __webpack_require__(100)
	  , value  = __webpack_require__(86);

	module.exports = function (obj) {
		var copy = Object(value(obj));
		if (copy !== obj) return copy;
		return assign({}, obj);
	};


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var callable = __webpack_require__(98)
	  , forEach  = __webpack_require__(128)

	  , call = Function.prototype.call;

	module.exports = function (obj, cb/*, thisArg*/) {
		var o = {}, thisArg = arguments[2];
		callable(cb);
		forEach(obj, function (value, key, obj, index) {
			o[key] = call.call(cb, thisArg, value, key, obj, index);
		});
		return o;
	};


/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(129)('forEach');


/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	// Internal method, used by iteration functions.
	// Calls a function for each key-value pair found in object
	// Optionally takes compareFn to iterate object in specific order

	'use strict';

	var callable = __webpack_require__(98)
	  , value    = __webpack_require__(86)

	  , bind = Function.prototype.bind, call = Function.prototype.call, keys = Object.keys
	  , propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

	module.exports = function (method, defVal) {
		return function (obj, cb/*, thisArg, compareFn*/) {
			var list, thisArg = arguments[2], compareFn = arguments[3];
			obj = Object(value(obj));
			callable(cb);

			list = keys(obj);
			if (compareFn) {
				list.sort((typeof compareFn === 'function') ? bind.call(compareFn, obj) : undefined);
			}
			if (typeof method !== 'function') method = list[method];
			return call.call(method, list, function (key, index) {
				if (!propertyIsEnumerable.call(obj, key)) return defVal;
				return call.call(cb, thisArg, obj[key], key, obj, index);
			});
		};
	};


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	// Thanks @mathiasbynens
	// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols

	'use strict';

	var setPrototypeOf = __webpack_require__(93)
	  , d              = __webpack_require__(99)
	  , Iterator       = __webpack_require__(124)

	  , defineProperty = Object.defineProperty
	  , StringIterator;

	StringIterator = module.exports = function (str) {
		if (!(this instanceof StringIterator)) return new StringIterator(str);
		str = String(str);
		Iterator.call(this, str);
		defineProperty(this, '__length__', d('', str.length));

	};
	if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

	StringIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(StringIterator),
		_next: d(function () {
			if (!this.__list__) return;
			if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
			this._unBind();
		}),
		_resolve: d(function (i) {
			var char = this.__list__[i], code;
			if (this.__nextIndex__ === this.__length__) return char;
			code = char.charCodeAt(0);
			if ((code >= 0xD800) && (code <= 0xDBFF)) return char + this.__list__[this.__nextIndex__++];
			return char;
		}),
		toString: d(function () { return '[object String Iterator]'; })
	});


/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var setPrototypeOf    = __webpack_require__(93)
	  , d                 = __webpack_require__(99)
	  , Iterator          = __webpack_require__(124)
	  , toStringTagSymbol = __webpack_require__(112).toStringTag
	  , kinds             = __webpack_require__(132)

	  , defineProperties = Object.defineProperties
	  , unBind = Iterator.prototype._unBind
	  , MapIterator;

	MapIterator = module.exports = function (map, kind) {
		if (!(this instanceof MapIterator)) return new MapIterator(map, kind);
		Iterator.call(this, map.__mapKeysData__, map);
		if (!kind || !kinds[kind]) kind = 'key+value';
		defineProperties(this, {
			__kind__: d('', kind),
			__values__: d('w', map.__mapValuesData__)
		});
	};
	if (setPrototypeOf) setPrototypeOf(MapIterator, Iterator);

	MapIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(MapIterator),
		_resolve: d(function (i) {
			if (this.__kind__ === 'value') return this.__values__[i];
			if (this.__kind__ === 'key') return this.__list__[i];
			return [this.__list__[i], this.__values__[i]];
		}),
		_unBind: d(function () {
			this.__values__ = null;
			unBind.call(this);
		}),
		toString: d(function () { return '[object Map Iterator]'; })
	});
	Object.defineProperty(MapIterator.prototype, toStringTagSymbol,
		d('c', 'Map Iterator'));


/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(133)('key',
		'value', 'key+value');


/***/ },
/* 133 */
/***/ function(module, exports) {

	'use strict';

	var forEach = Array.prototype.forEach, create = Object.create;

	module.exports = function (arg/*, …args*/) {
		var set = create(null);
		forEach.call(arguments, function (name) { set[name] = true; });
		return set;
	};


/***/ },
/* 134 */
/***/ function(module, exports) {

	// Exports true if environment provides native `Map` implementation,
	// whatever that is.

	'use strict';

	module.exports = (function () {
		if (typeof Map === 'undefined') return false;
		return (Object.prototype.toString.call(new Map()) === '[object Map]');
	}());


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var throwError = __webpack_require__(39);
	var BinaryDisposable = __webpack_require__(23);
	var Disposable = __webpack_require__(12);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function UsingObservable(resFn, obsFn) {
	  this._resFn = resFn;
	  this._obsFn = obsFn;
	  ObservableBase.call(this);
	}

	inherits(UsingObservable, ObservableBase);

	UsingObservable.prototype.subscribeCore = function (o) {
	  var disposable = Disposable.empty;
	  var resource = tryCatch(this._resFn)();
	  if (resource === global._Rx.errorObj) {
	    return new BinaryDisposable(throwError(resource.e).subscribe(o), disposable);
	  }
	  resource && (disposable = resource);
	  var source = tryCatch(this._obsFn)(resource);
	  if (source === global._Rx.errorObj) {
	    return new BinaryDisposable(throwError(source.e).subscribe(o), disposable);
	  }
	  return new BinaryDisposable(source.subscribe(o), disposable);
	};

	/**
	 * Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
	 * @param {Function} resourceFactory Factory function to obtain a resource object.
	 * @param {Function} observableFactory Factory function to obtain an observable sequence that depends on the obtained resource.
	 * @returns {Observable} An observable sequence whose lifetime controls the lifetime of the dependent resource object.
	 */
	module.exports = function using(resourceFactory, observableFactory) {
	  return new UsingObservable(resourceFactory, observableFactory);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var NAryDisposable = __webpack_require__(43);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var identity = __webpack_require__(46);
	var isFunction = __webpack_require__(9);
	var inherits = __webpack_require__(6);
	var tryCatch = __webpack_require__(15).tryCatch;

	function falseFactory() {
	  return false;
	}
	function emptyArrayFactory() {
	  return [];
	}
	function initializeArray(n, fn) {
	  var results = new Array(n);
	  for (var i = 0; i < n; i++) {
	    results[i] = fn(i);
	  }
	  return results;
	}
	function argumentsToArray() {
	  var len = arguments.length,
	      args = new Array(len);
	  for (var i = 0; i < len; i++) {
	    args[i] = arguments[i];
	  }
	  return args;
	}

	function ZipObserver(o, i, p, q, d) {
	  this._o = o;
	  this._i = i;
	  this._p = p;
	  this._q = q;
	  this._d = d;
	  AbstractObserver.call(this);
	}

	inherits(ZipObserver, AbstractObserver);

	function notEmpty(x) {
	  return x.length > 0;
	}
	function shiftEach(x) {
	  return x.shift();
	}
	function notTheSame(i) {
	  return function (x, j) {
	    return j !== i;
	  };
	}

	ZipObserver.prototype.next = function (x) {
	  this._q[this._i].push(x);
	  if (this._q.every(notEmpty)) {
	    var queuedValues = this._q.map(shiftEach);
	    var res = tryCatch(this._p._cb).apply(null, queuedValues);
	    if (res === global._Rx.errorObj) {
	      return this._o.onError(res.e);
	    }
	    this._o.onNext(res);
	  } else if (this._d.filter(notTheSame(this._i)).every(identity)) {
	    this._o.onCompleted();
	  }
	};

	ZipObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	ZipObserver.prototype.completed = function () {
	  this._d[this._i] = true;
	  this._d.every(identity) && this._o.onCompleted();
	};

	function ZipObservable(s, cb) {
	  this._s = s;
	  this._cb = cb;
	  ObservableBase.call(this);
	}

	inherits(ZipObservable, ObservableBase);

	ZipObservable.prototype.subscribeCore = function (observer) {
	  var n = this._s.length,
	      subscriptions = new Array(n),
	      done = initializeArray(n, falseFactory),
	      q = initializeArray(n, emptyArrayFactory);

	  for (var i = 0; i < n; i++) {
	    var source = this._s[i],
	        sad = new SingleAssignmentDisposable();
	    subscriptions[i] = sad;
	    isPromise(source) && (source = fromPromise(source));
	    sad.setDisposable(source.subscribe(new ZipObserver(observer, i, this, q, done)));
	  }

	  return new NAryDisposable(subscriptions);
	};

	/**
	* Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
	* The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
	* @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
	*/
	module.exports = function zip() {
	  if (arguments.length === 0) {
	    throw new Error('invalid arguments');
	  }
	  var len = arguments.length,
	      args = new Array(len);
	  for (var i = 0; i < len; i++) {
	    args[i] = arguments[i];
	  }
	  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	  return new ZipObservable(args, resultSelector);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Pattern = __webpack_require__(138);

	module.exports = function and(left, right) {
	  return new Pattern([left, right]);
	};

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Plan = __webpack_require__(139);

	/**
	 * @constructor
	 * Represents a join pattern over observable sequences.
	 */
	function Pattern(patterns) {
	  this._patterns = patterns;
	}

	/**
	 *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
	 *  @param other Observable sequence to match in addition to the current pattern.
	 *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
	 */
	Pattern.prototype.and = function (other) {
	  return new Pattern(this._patterns.concat(other));
	};

	/**
	 *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
	 *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
	 *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
	 */
	Pattern.prototype.thenDo = function (selector) {
	  return new Plan(this, selector);
	};

	module.exports = Pattern;

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ActivePlan = __webpack_require__(140);
	var JoinObserver = __webpack_require__(141);
	var tryCatch = __webpack_require__(15).tryCatch;

	function planCreateObserver(externalSubscriptions, observable, onError) {
	  var entry = externalSubscriptions.get(observable);
	  if (!entry) {
	    var observer = new JoinObserver(observable, onError);
	    externalSubscriptions.set(observable, observer);
	    return observer;
	  }
	  return entry;
	}

	function Plan(expression, selector) {
	  this._expression = expression;
	  this._selector = selector;
	}

	function handleOnError(o) {
	  return function (e) {
	    o.onError(e);
	  };
	}
	function handleOnNext(self, observer) {
	  return function onNext() {
	    var result = tryCatch(self._selector).apply(self, arguments);
	    if (result === global._Rx.errorObj) {
	      return observer.onError(result.e);
	    }
	    observer.onNext(result);
	  };
	}

	Plan.prototype.activate = function (externalSubscriptions, observer, deactivate) {
	  var joinObservers = [],
	      errHandler = handleOnError(observer);
	  for (var i = 0, len = this._expression._patterns.length; i < len; i++) {
	    joinObservers.push(planCreateObserver(externalSubscriptions, this._expression._patterns[i], errHandler));
	  }
	  var activePlan = new ActivePlan(joinObservers, handleOnNext(this, observer), function () {
	    for (var j = 0, jlen = joinObservers.length; j < jlen; j++) {
	      joinObservers[j].removeActivePlan(activePlan);
	    }
	    deactivate(activePlan);
	  });
	  for (i = 0, len = joinObservers.length; i < len; i++) {
	    joinObservers[i].addActivePlan(activePlan);
	  }
	  return activePlan;
	};

	module.exports = Plan;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	__webpack_require__(81);

	function ActivePlan(joinObserverArray, onNext, onCompleted) {
	  this._joinObserverArray = joinObserverArray;
	  this._onNext = onNext;
	  this._onCompleted = onCompleted;
	  this._joinObservers = new global.Map();
	  for (var i = 0, len = this._joinObserverArray.length; i < len; i++) {
	    var joinObserver = this._joinObserverArray[i];
	    this._joinObservers.set(joinObserver, joinObserver);
	  }
	}

	ActivePlan.prototype.dequeue = function () {
	  this._joinObservers.forEach(function (v) {
	    v._queue.shift();
	  });
	};

	ActivePlan.prototype.match = function () {
	  var i,
	      len,
	      hasValues = true;
	  for (i = 0, len = this._joinObserverArray.length; i < len; i++) {
	    if (this._joinObserverArray[i]._queue.length === 0) {
	      hasValues = false;
	      break;
	    }
	  }
	  if (hasValues) {
	    var firstValues = [],
	        isCompleted = false;
	    for (i = 0, len = this._joinObserverArray.length; i < len; i++) {
	      firstValues.push(this._joinObserverArray[i]._queue[0]);
	      this._joinObserverArray[i]._queue[0].kind === 'C' && (isCompleted = true);
	    }
	    if (isCompleted) {
	      this._onCompleted();
	    } else {
	      this.dequeue();
	      var values = [];
	      for (i = 0, len = firstValues.length; i < firstValues.length; i++) {
	        values.push(firstValues[i].value);
	      }
	      this._onNext.apply(this, values);
	    }
	  }
	};

	module.exports = ActivePlan;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AbstractObserver = __webpack_require__(5);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var materialize = __webpack_require__(142);
	var noop = __webpack_require__(3);
	var inherits = __webpack_require__(6);

	function JoinObserver(source, onError) {
	  AbstractObserver.call(this);
	  this._source = source;
	  this._onError = onError;
	  this._queue = [];
	  this._activePlans = [];
	  this._subscription = new SingleAssignmentDisposable();
	  this.isDisposed = false;
	}

	inherits(JoinObserver, AbstractObserver);

	JoinObserver.prototype.next = function (notification) {
	  if (!this.isDisposed) {
	    if (notification.kind === 'E') {
	      return this._onError(notification.error);
	    }
	    this._queue.push(notification);
	    var activePlans = this._activePlans.slice(0);
	    for (var i = 0, len = activePlans.length; i < len; i++) {
	      activePlans[i].match();
	    }
	  }
	};

	JoinObserver.prototype.error = noop;
	JoinObserver.prototype.completed = noop;

	JoinObserver.prototype.addActivePlan = function (activePlan) {
	  this._activePlans.push(activePlan);
	};

	JoinObserver.prototype.subscribe = function () {
	  this._subscription.setDisposable(materialize(this._source).subscribe(this));
	};

	JoinObserver.prototype.removeActivePlan = function (activePlan) {
	  this._activePlans.splice(this._activePlans.indexOf(activePlan), 1);
	  this._activePlans.length === 0 && this.dispose();
	};

	JoinObserver.prototype.dispose = function () {
	  AbstractObserver.prototype.dispose.call(this);
	  if (!this.isDisposed) {
	    this.isDisposed = true;
	    this._subscription.dispose();
	  }
	};

	module.exports = JoinObserver;

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var Notification = __webpack_require__(143);
	var inherits = __webpack_require__(6);

	function MaterializeObserver(o) {
	  this._o = o;
	  AbstractObserver.call(this);
	}

	inherits(MaterializeObserver, AbstractObserver);

	MaterializeObserver.prototype.next = function (x) {
	  this._o.onNext(Notification.createOnNext(x));
	};
	MaterializeObserver.prototype.error = function (e) {
	  this._o.onNext(Notification.createOnError(e));this._o.onCompleted();
	};
	MaterializeObserver.prototype.completed = function () {
	  this._o.onNext(Notification.createOnCompleted());this._o.onCompleted();
	};

	function MaterializeObservable(source) {
	  this.source = source;
	  ObservableBase.call(this);
	}

	inherits(MaterializeObservable, ObservableBase);

	MaterializeObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new MaterializeObserver(o));
	};

	/**
	 *  Materializes the implicit notifications of an observable sequence as explicit notification values.
	 * @returns {Observable} An observable sequence containing the materialized notification values from the source sequence.
	 */
	module.exports = function materialize(source) {
	  return new MaterializeObservable(source);
	};

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var AnonymousObservable = __webpack_require__(35);
	var Scheduler = __webpack_require__(17);
	var errors = __webpack_require__(7);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.immediateScheduler) {
	  __webpack_require__(40);
	}

	function Notification() {}

	Notification.prototype._accept = function (onNext, onError, onCompleted) {
	  throw new errors.NotImplementedError();
	};

	Notification.prototype._acceptObserver = function (onNext, onError, onCompleted) {
	  throw new errors.NotImplementedError();
	};

	/**
	 * Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.
	 * @param {Function | Observer} observerOrOnNext Function to invoke for an OnNext notification or Observer to invoke the notification on..
	 * @param {Function} onError Function to invoke for an OnError notification.
	 * @param {Function} onCompleted Function to invoke for an OnCompleted notification.
	 * @returns {Any} Result produced by the observation.
	 */
	Notification.prototype.accept = function (observerOrOnNext, onError, onCompleted) {
	  return observerOrOnNext && typeof observerOrOnNext === 'object' ? this._acceptObserver(observerOrOnNext) : this._accept(observerOrOnNext, onError, onCompleted);
	};

	/**
	 * Returns an observable sequence with a single notification.
	 *
	 * @memberOf Notifications
	 * @param {Scheduler} [scheduler] Scheduler to send out the notification calls on.
	 * @returns {Observable} The observable sequence that surfaces the behavior of the notification upon subscription.
	 */
	Notification.prototype.toObservable = function (scheduler) {
	  var self = this;
	  Scheduler.isScheduler(scheduler) || (scheduler = global._Rx.immediateScheduler);
	  return new AnonymousObservable(function (o) {
	    return scheduler.schedule(self, function (_, notification) {
	      notification._acceptObserver(o);
	      notification.kind === 'N' && o.onCompleted();
	    });
	  });
	};

	function OnNextNotification(value) {
	  this.value = value;
	  this.kind = 'N';
	}

	inherits(OnNextNotification, Notification);

	OnNextNotification.prototype._accept = function (onNext) {
	  return onNext(this.value);
	};

	OnNextNotification.prototype._acceptObserver = function (o) {
	  return o.onNext(this.value);
	};

	OnNextNotification.prototype.toString = function () {
	  return 'OnNext(' + this.value + ')';
	};

	function OnErrorNotification(error) {
	  this.error = error;
	  this.kind = 'E';
	}

	inherits(OnErrorNotification, Notification);

	OnErrorNotification.prototype._accept = function (onNext, onError) {
	  return onError(this.error);
	};

	OnErrorNotification.prototype._acceptObserver = function (o) {
	  return o.onError(this.error);
	};

	OnErrorNotification.prototype.toString = function () {
	  return 'OnError(' + this.error + ')';
	};

	function OnCompletedNotification() {
	  this.kind = 'C';
	}

	inherits(OnCompletedNotification, Notification);

	OnCompletedNotification.prototype._accept = function (onNext, onError, onCompleted) {
	  return onCompleted();
	};

	OnCompletedNotification.prototype._acceptObserver = function (o) {
	  return o.onCompleted();
	};

	OnCompletedNotification.prototype.toString = function () {
	  return 'OnCompleted()';
	};

	/**
	* Creates an object that represents an OnNext notification to an observer.
	* @param {Any} value The value contained in the notification.
	* @returns {Notification} The OnNext notification containing the value.
	*/
	Notification.createOnNext = function (value) {
	  return new OnNextNotification(value);
	};

	/**
	* Creates an object that represents an OnError notification to an observer.
	* @param {Any} error The exception contained in the notification.
	* @returns {Notification} The OnError notification containing the exception.
	*/
	Notification.createOnError = function (error) {
	  return new OnErrorNotification(error);
	};

	/**
	* Creates an object that represents an OnCompleted notification to an observer.
	* @returns {Notification} The OnCompleted notification.
	*/
	Notification.createOnCompleted = function () {
	  return new OnCompletedNotification();
	};

	module.exports = Notification;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var EmptyError = __webpack_require__(7).EmptyError;
	var isFunction = __webpack_require__(9);
	var bindCallback = __webpack_require__(52);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function AverageObserver(o, fn, s) {
	  this._o = o;
	  this._fn = fn;
	  this._s = s;
	  this._c = 0;
	  this._t = 0;
	  AbstractObserver.call(this);
	}

	inherits(AverageObserver, AbstractObserver);

	AverageObserver.prototype.next = function (x) {
	  if (this._fn) {
	    var r = tryCatch(this._fn)(x, this._c++, this._s);
	    if (r === global._Rx.errorObj) {
	      return this._o.onError(r.e);
	    }
	    this._t += r;
	  } else {
	    this._c++;
	    this._t += x;
	  }
	};
	AverageObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	AverageObserver.prototype.completed = function () {
	  if (this._c === 0) {
	    return this._o.onError(new EmptyError());
	  }
	  this._o.onNext(this._t / this._c);
	  this._o.onCompleted();
	};

	function AverageObservable(source, fn) {
	  this.source = source;
	  this._fn = fn;
	  ObservableBase.call(this);
	}

	inherits(AverageObservable, ObservableBase);

	AverageObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new AverageObserver(o, this._fn, this.source));
	};

	/**
	 * Computes the average of an observable sequence of values that are in the sequence or obtained by invoking a transform function on each element of the input sequence if present.
	 * @param {Function} [selector] A transform function to apply to each element.
	 * @param {Any} [thisArg] Object to use as this when executing callback.
	 * @returns {Observable} An observable sequence containing a single element with the average of the sequence of values.
	 */
	module.exports = function average(source, keySelector, thisArg) {
	  var fn;
	  isFunction(keySelector) && (fn = bindCallback(keySelector, thisArg, 3));
	  return new AverageObservable(source, fn);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var flatMap = __webpack_require__(146);
	var window = __webpack_require__(150);

	function toArray(x) {
	  return x.toArray();
	}

	module.exports = function buffer(source, windowOpeningsOrClosingSelector, windowClosingSelector) {
	  return flatMap(window(source, windowOpeningsOrClosingSelector, windowClosingSelector), toArray);
	};

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var FlatMapObservable = __webpack_require__(147);
	var mergeAll = __webpack_require__(66);

	module.exports = function flatMap(source, selector, resultSelector, thisArg) {
	  var obs = new FlatMapObservable(source, selector, resultSelector, thisArg);
	  return mergeAll(obs);
	};

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var AbstractObserver = __webpack_require__(5);
	var ObservableBase = __webpack_require__(11);
	var observableFrom = __webpack_require__(50);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var isArrayLike = __webpack_require__(148);
	var isIterable = __webpack_require__(149);
	var bindCallback = __webpack_require__(52);
	var isFunction = __webpack_require__(9);
	var inherits = __webpack_require__(6);
	var tryCatchUtils = __webpack_require__(15);
	var tryCatch = tryCatchUtils.tryCatch;

	function FlatMapObserver(o, selector, resultSelector, source) {
	  this.i = 0;
	  this._fn = selector;
	  this._resFn = resultSelector;
	  this.source = source;
	  this._o = o;
	  AbstractObserver.call(this);
	}

	inherits(FlatMapObserver, AbstractObserver);

	FlatMapObserver.prototype._wrapResult = function (result, x, i) {
	  return isFunction(this._resFn) ? result.map(function (y, i2) {
	    return this._resFn(x, y, i, i2);
	  }, this) : result;
	};

	FlatMapObserver.prototype.next = function (x) {
	  var i = this.i++;
	  var result = tryCatch(this._fn)(x, i, this.source);
	  if (result === global._Rx.errorObj) {
	    return this._o.onError(result.e);
	  }

	  isPromise(result) && (result = fromPromise(result));
	  (isArrayLike(result) || isIterable(result)) && (result = observableFrom(result));
	  this._o.onNext(this._wrapResult(result, x, i));
	};
	FlatMapObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	FlatMapObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function FlatMapObservable(source, fn, resultFn, thisArg) {
	  this._resFn = isFunction(resultFn) ? resultFn : null;
	  this._fn = bindCallback(isFunction(fn) ? fn : function () {
	    return fn;
	  }, thisArg, 3);
	  this.source = source;
	  ObservableBase.call(this);
	}

	inherits(FlatMapObservable, ObservableBase);

	FlatMapObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new FlatMapObserver(o, this._fn, this._resFn, this));
	};

	module.exports = FlatMapObservable;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 148 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function isArrayLike(o) {
	  return o && o.length !== undefined;
	};

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $iterator$ = __webpack_require__(51);

	module.exports = function isIterable(o) {
	  return o && o[$iterator$] !== undefined;
	};

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var CompositeDisposable = __webpack_require__(18);
	var RefCountDisposable = __webpack_require__(151);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var AnonymousObservable = __webpack_require__(35);
	var Subject = __webpack_require__(57);
	var empty = __webpack_require__(41);
	var fromPromise = __webpack_require__(24);
	var groupJoin = __webpack_require__(152);
	var take = __webpack_require__(154);
	var addRef = __webpack_require__(153);
	var isPromise = __webpack_require__(27);
	var isFunction = __webpack_require__(9);
	var noop = __webpack_require__(3);
	var tryCatch = __webpack_require__(15).tryCatch;

	function returnWindow(x, win) {
	  return win;
	}

	function observableWindowWithOpenings(source, windowOpenings, windowClosingSelector) {
	  return groupJoin(windowOpenings, source, windowClosingSelector, empty, returnWindow);
	}

	function observableWindowWithBoundaries(source, windowBoundaries) {
	  return new AnonymousObservable(function (o) {
	    var win = new Subject(),
	        d = new CompositeDisposable(),
	        r = new RefCountDisposable(d);

	    o.onNext(addRef(win, r));

	    d.add(source.subscribe(function (x) {
	      win.onNext(x);
	    }, function (err) {
	      win.onError(err);
	      o.onError(err);
	    }, function () {
	      win.onCompleted();
	      o.onCompleted();
	    }));

	    isPromise(windowBoundaries) && (windowBoundaries = fromPromise(windowBoundaries));

	    d.add(windowBoundaries.subscribe(function () {
	      win.onCompleted();
	      win = new Subject();
	      o.onNext(addRef(win, r));
	    }, function (err) {
	      win.onError(err);
	      o.onError(err);
	    }, function () {
	      win.onCompleted();
	      o.onCompleted();
	    }));

	    return r;
	  }, source);
	}

	function observableWindowWithClosingSelector(source, windowClosingSelector) {
	  return new AnonymousObservable(function (o) {
	    var m = new SerialDisposable(),
	        d = new CompositeDisposable(m),
	        r = new RefCountDisposable(d),
	        win = new Subject();
	    o.onNext(addRef(win, r));
	    d.add(source.subscribe(function (x) {
	      win.onNext(x);
	    }, function (err) {
	      win.onError(err);
	      o.onError(err);
	    }, function () {
	      win.onCompleted();
	      o.onCompleted();
	    }));

	    function createWindowClose() {
	      var windowClose = tryCatch(windowClosingSelector)();
	      if (windowClose === global._Rx.errorObj) {
	        return o.onError(windowClose.e);
	      }
	      isPromise(windowClose) && (windowClose = fromPromise(windowClose));

	      var m1 = new SingleAssignmentDisposable();
	      m.setDisposable(m1);
	      m1.setDisposable(take(windowClose, 1).subscribe(noop, function (err) {
	        win.onError(err);
	        o.onError(err);
	      }, function () {
	        win.onCompleted();
	        win = new Subject();
	        o.onNext(addRef(win, r));
	        createWindowClose();
	      }));
	    }

	    createWindowClose();
	    return r;
	  }, source);
	}

	/**
	 *  Projects each element of an observable sequence into zero or more windows.
	 *
	 *  @param {Mixed} windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
	 *  @param {Function} [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
	 *  @returns {Observable} An observable sequence of windows.
	 */
	module.exports = function window(source, windowOpeningsOrClosingSelector, windowClosingSelector) {
	  if (!windowClosingSelector && !isFunction(windowOpeningsOrClosingSelector)) {
	    return observableWindowWithBoundaries(source, windowOpeningsOrClosingSelector);
	  }
	  return isFunction(windowOpeningsOrClosingSelector) ? observableWindowWithClosingSelector(source, windowOpeningsOrClosingSelector) : observableWindowWithOpenings(source, windowOpeningsOrClosingSelector, windowClosingSelector);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Disposable = __webpack_require__(12);

	function InnerDisposable(disposable) {
	  this.disposable = disposable;
	  this.disposable.count++;
	  this.isInnerDisposed = false;
	}

	InnerDisposable.prototype.dispose = function () {
	  if (!this.disposable.isDisposed && !this.isInnerDisposed) {
	    this.isInnerDisposed = true;
	    this.disposable.count--;
	    if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
	      this.disposable.isDisposed = true;
	      this.disposable.underlyingDisposable.dispose();
	    }
	  }
	};

	/**
	 * Represents a disposable resource that only disposes its underlying disposable resource when all dependent disposable objects have been disposed.
	 */
	function RefCountDisposable(disposable) {
	  this.underlyingDisposable = disposable;
	  this.isDisposed = false;
	  this.isPrimaryDisposed = false;
	  this.count = 0;
	}

	/**
	 * Disposes the underlying disposable only when all dependent disposables have been disposed
	 */
	RefCountDisposable.prototype.dispose = function () {
	  if (!this.isDisposed && !this.isPrimaryDisposed) {
	    this.isPrimaryDisposed = true;
	    if (this.count === 0) {
	      this.isDisposed = true;
	      this.underlyingDisposable.dispose();
	    }
	  }
	};

	/**
	 * Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.
	 * @returns {Disposable} A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.
	 */
	RefCountDisposable.prototype.getDisposable = function () {
	  return this.isDisposed ? Disposable.empty : new InnerDisposable(this);
	};

	module.exports = RefCountDisposable;

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var AnonymousObservable = __webpack_require__(35); // TODO: Get rid of
	var CompositeDisposable = __webpack_require__(18);
	var RefCountDisposable = __webpack_require__(151);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var Subject = __webpack_require__(57);
	var addRef = __webpack_require__(153);
	var noop = __webpack_require__(3);
	var tryCatch = __webpack_require__(15).tryCatch;

	__webpack_require__(81);

	module.exports = function groupJoin(left, right, leftDurationSelector, rightDurationSelector, resultSelector) {
	  return new AnonymousObservable(function (o) {
	    var group = new CompositeDisposable();
	    var r = new RefCountDisposable(group);
	    var leftMap = new global.Map(),
	        rightMap = new global.Map();
	    var leftId = 0,
	        rightId = 0;
	    var handleError = function (e) {
	      return function (v) {
	        v.onError(e);
	      };
	    };

	    group.add(left.subscribe(function (value) {
	      var s = new Subject();
	      var id = leftId++;
	      leftMap.set(id, s);

	      var result = tryCatch(resultSelector)(value, addRef(s, r));
	      if (result === global._Rx.errorObj) {
	        leftMap.forEach(handleError(result.e));
	        return o.onError(result.e);
	      }
	      o.onNext(result);

	      rightMap.forEach(function (v) {
	        s.onNext(v);
	      });

	      var md = new SingleAssignmentDisposable();
	      group.add(md);

	      var duration = tryCatch(leftDurationSelector)(value);
	      if (duration === global._Rx.errorObj) {
	        leftMap.forEach(handleError(duration.e));
	        return o.onError(duration.e);
	      }

	      md.setDisposable(duration.take(1).subscribe(noop, function (e) {
	        leftMap.forEach(handleError(e));
	        o.onError(e);
	      }, function () {
	        leftMap['delete'](id) && s.onCompleted();
	        group.remove(md);
	      }));
	    }, function (e) {
	      leftMap.forEach(handleError(e));
	      o.onError(e);
	    }, function () {
	      o.onCompleted();
	    }));

	    group.add(right.subscribe(function (value) {
	      var id = rightId++;
	      rightMap.set(id, value);

	      var md = new SingleAssignmentDisposable();
	      group.add(md);

	      var duration = tryCatch(rightDurationSelector)(value);
	      if (duration === global._Rx.errorObj) {
	        leftMap.forEach(handleError(duration.e));
	        return o.onError(duration.e);
	      }

	      md.setDisposable(duration.take(1).subscribe(noop, function (e) {
	        leftMap.forEach(handleError(e));
	        o.onError(e);
	      }, function () {
	        rightMap['delete'](id);
	        group.remove(md);
	      }));

	      leftMap.forEach(function (v) {
	        v.onNext(value);
	      });
	    }, function (e) {
	      leftMap.forEach(handleError(e));
	      o.onError(e);
	    }));

	    return r;
	  }, left);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var BinaryDisposable = __webpack_require__(23);
	var inherits = __webpack_require__(6);

	function AddRefObservable(xs, r) {
	  this._xs = xs;
	  this._r = r;
	  ObservableBase.call(this);
	}

	inherits(AddRefObservable, ObservableBase);

	AddRefObservable.prototype.subscribeCore = function (o) {
	  return new BinaryDisposable(this._r.getDisposable(), this._xs.subscribe(o));
	};

	module.exports = function addRef(xs, r) {
	  return new AddRefObservable(xs, r);
	};

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AbstractObserver = __webpack_require__(5);
	var ObservableBase = __webpack_require__(11);
	var empty = __webpack_require__(41);
	var errors = __webpack_require__(7);
	var inherits = __webpack_require__(6);

	function TakeObserver(o, c) {
	  this._o = o;
	  this._c = c;
	  this._r = c;
	  AbstractObserver.call(this);
	}

	inherits(TakeObserver, AbstractObserver);

	TakeObserver.prototype.next = function (x) {
	  if (this._r-- > 0) {
	    this._o.onNext(x);
	    this._r <= 0 && this._o.onCompleted();
	  }
	};

	TakeObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	TakeObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function TakeObservable(source, count) {
	  this.source = source;
	  this._count = count;
	  ObservableBase.call(this);
	}

	inherits(TakeObservable, ObservableBase);

	TakeObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new TakeObserver(o, this._count));
	};

	/**
	 *  Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
	 * @param {Number} count The number of elements to return.
	 * @param {Scheduler} [scheduler] Scheduler used to produce an OnCompleted message in case <paramref name="count count</paramref> is set to 0.
	 * @returns {Observable} An observable sequence that contains the specified number of elements from the start of the input sequence.
	 */
	module.exports = function (source, count, scheduler) {
	  if (count < 0) {
	    throw new errors.ArgumentOutOfRangeError();
	  }
	  if (count === 0) {
	    return empty(scheduler);
	  }
	  return new TakeObservable(source, count);
	};

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var filter = __webpack_require__(156);
	var flatMap = __webpack_require__(146);
	var windowCount = __webpack_require__(157);

	function toArray(x) {
	  return x.toArray();
	}
	function notEmpty(x) {
	  return x.length > 0;
	}

	module.exports = function bufferCount(source, count, skip) {
	  typeof skip !== 'number' && (skip = count);
	  return filter(flatMap(windowCount(source, count, skip), toArray), notEmpty);
	};

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var bindCallback = __webpack_require__(52);
	var inherits = __webpack_require__(6);
	var tryCatch = __webpack_require__(15).tryCatch;

	function FilterObserver(o, predicate, source) {
	  this._o = o;
	  this._fn = predicate;
	  this.source = source;
	  this._i = 0;
	  AbstractObserver.call(this);
	}

	inherits(FilterObserver, AbstractObserver);

	FilterObserver.prototype.next = function (x) {
	  var shouldYield = tryCatch(this._fn)(x, this._i++, this.source);
	  if (shouldYield === global._Rx.errorObj) {
	    return this._o.onError(shouldYield.e);
	  }
	  shouldYield && this._o.onNext(x);
	};

	FilterObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	FilterObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function FilterObservable(source, predicate, thisArg) {
	  this.source = source;
	  this._fn = bindCallback(predicate, thisArg, 3);
	  ObservableBase.call(this);
	}

	inherits(FilterObservable, ObservableBase);

	FilterObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new FilterObserver(o, this._fn, this));
	};

	function innerPredicate(fn, self) {
	  return function (x, i, o) {
	    return self._fn(x, i, o) && fn.call(this, x, i, o);
	  };
	}

	FilterObservable.prototype.internalFilter = function (fn, thisArg) {
	  return new FilterObservable(this.source, innerPredicate(fn, this), thisArg);
	};

	/**
	*  Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
	* @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
	* @param {Any} [thisArg] Object to use as this when executing callback.
	* @returns {Observable} An observable sequence that contains elements from the input sequence that satisfy the condition.
	*/
	module.exports = function filter(source, predicate, thisArg) {
	  return source instanceof FilterObservable ? source.internalFilter(predicate, thisArg) : new FilterObservable(source, predicate, thisArg);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var Subject = __webpack_require__(57);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var RefCountDisposable = __webpack_require__(151);
	var ArgumentOutOfRangeError = __webpack_require__(7).ArgumentOutOfRangeError;
	var addRef = __webpack_require__(153);
	var inherits = __webpack_require__(6);

	function createWindow(state) {
	  var s = new Subject();
	  state.q.push(s);
	  state.o.onNext(addRef(s, state.refCountDisposable));
	}

	function WindowCountObserver(state) {
	  this._s = state;
	  AbstractObserver.call(this);
	}

	inherits(WindowCountObserver, AbstractObserver);

	WindowCountObserver.prototype.next = function (x) {
	  for (var i = 0, len = this._s.q.length; i < len; i++) {
	    this._s.q[i].onNext(x);
	  }
	  var c = this._s.n - this._s.count + 1;
	  c >= 0 && c % this._s.skip === 0 && this._s.q.shift().onCompleted();
	  ++this._s.n % this._s.skip === 0 && createWindow(this._s);
	};

	WindowCountObserver.prototype.error = function (e) {
	  while (this._s.q.length > 0) {
	    this._s.q.shift().onError(e);
	  }
	  this._s.o.onError(e);
	};

	WindowCountObserver.prototype.completed = function () {
	  while (this._s.q.length > 0) {
	    this._s.q.shift().onCompleted();
	  }
	  this._s.o.onCompleted();
	};

	function WindowCountObservable(source, count, skip) {
	  this.source = source;
	  this._count = count;
	  this._skip = skip;
	  ObservableBase.call(this);
	}

	inherits(WindowCountObservable, ObservableBase);

	WindowCountObservable.prototype.subscribeCore = function (o) {
	  var m = new SingleAssignmentDisposable(),
	      refCountDisposable = new RefCountDisposable(m);

	  var state = {
	    m: m,
	    refCountDisposable: refCountDisposable,
	    q: [],
	    n: 0,
	    count: this._count,
	    skip: this._skip,
	    o: o
	  };

	  createWindow(state);
	  m.setDisposable(this.source.subscribe(new WindowCountObserver(state)));

	  return refCountDisposable;
	};

	module.exports = function (source, count, skip) {
	  +count || (count = 0);
	  Math.abs(count) === Infinity && (count = 0);
	  if (count <= 0) {
	    throw new ArgumentOutOfRangeError();
	  }
	  skip == null && (skip = count);
	  +skip || (skip = 0);
	  Math.abs(skip) === Infinity && (skip = 0);

	  if (skip <= 0) {
	    throw new ArgumentOutOfRangeError();
	  }
	  return new WindowCountObservable(source, count, skip);
	};

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var flatMap = __webpack_require__(146);
	var windowTime = __webpack_require__(159);

	function toArray(x) {
	  return x.toArray();
	}

	module.exports = function bufferTime(source, timeSpan, timeShiftOrScheduler, scheduler) {
	  return flatMap(windowTime(source, timeSpan, timeShiftOrScheduler, scheduler), toArray);
	};

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var Subject = __webpack_require__(57);
	var CompositeDisposable = __webpack_require__(18);
	var RefCountDisposable = __webpack_require__(151);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var addRef = __webpack_require__(153);
	var isScheduler = __webpack_require__(17).isScheduler;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
		__webpack_require__(25);
	}

	function WindowTimeObserver(state) {
		this._state = state;
		AbstractObserver.call(this);
	}

	inherits(WindowTimeObserver, AbstractObserver);

	WindowTimeObserver.prototype.next = function (x) {
		for (var i = 0, len = this._state.q.length; i < len; i++) {
			this._state.q[i].onNext(x);
		}
	};

	WindowTimeObserver.prototype.error = function (e) {
		for (var i = 0, len = this._state.q.length; i < len; i++) {
			this._state.q[i].onError(e);
		}
		this._state.o.onError(e);
	};

	WindowTimeObserver.prototype.completed = function () {
		for (var i = 0, len = this._state.q.length; i < len; i++) {
			this._state.q[i].onCompleted();
		}
		this._state.o.onCompleted();
	};

	function WindowTimeObservable(source, timeSpan, timeShift, scheduler) {
		this.source = source;
		this._timeSpan = timeSpan;
		this._timeShift = timeShift;
		this._scheduler = scheduler;
		ObservableBase.call(this);
	}

	inherits(WindowTimeObservable, ObservableBase);

	WindowTimeObservable.prototype.subscribeCore = function (o) {
		var self = this;
		var groupDisposable,
		    nextShift = self._timeShift,
		    nextSpan = self._timeSpan,
		    q = [],
		    refCountDisposable,
		    timerD = new SerialDisposable(),
		    totalTime = 0;
		groupDisposable = new CompositeDisposable(timerD), refCountDisposable = new RefCountDisposable(groupDisposable);

		function createTimer() {
			var m = new SingleAssignmentDisposable(),
			    isSpan = false,
			    isShift = false;
			timerD.setDisposable(m);
			if (nextSpan === nextShift) {
				isSpan = true;
				isShift = true;
			} else if (nextSpan < nextShift) {
				isSpan = true;
			} else {
				isShift = true;
			}
			var newTotalTime = isSpan ? nextSpan : nextShift,
			    ts = newTotalTime - totalTime;
			totalTime = newTotalTime;
			if (isSpan) {
				nextSpan += self._timeShift;
			}
			if (isShift) {
				nextShift += self._timeShift;
			}
			m.setDisposable(self._scheduler.scheduleFuture(null, ts, function () {
				if (isShift) {
					var s = new Subject();
					q.push(s);
					o.onNext(addRef(s, refCountDisposable));
				}
				isSpan && q.shift().onCompleted();
				createTimer();
			}));
		}
		q.push(new Subject());
		o.onNext(addRef(q[0], refCountDisposable));
		createTimer();
		groupDisposable.add(self.source.subscribe(new WindowTimeObserver({ q: q, o: o })));
		return refCountDisposable;
	};

	module.exports = function (source, timeSpan, timeShiftOrScheduler, scheduler) {
		var timeShift;
		timeShiftOrScheduler == null && (timeShift = timeSpan);
		isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
		if (typeof timeShiftOrScheduler === 'number') {
			timeShift = timeShiftOrScheduler;
		} else if (isScheduler(timeShiftOrScheduler)) {
			timeShift = timeSpan;
			scheduler = timeShiftOrScheduler;
		}
		return new WindowTimeObservable(source, timeSpan, timeShift, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var flatMap = __webpack_require__(146);
	var windowTimeOrCount = __webpack_require__(161);

	function toArray(x) {
	  return x.toArray();
	}

	module.exports = function bufferTimeOrCount(source, timeSpan, count, scheduler) {
	  return flatMap(windowTimeOrCount(source, timeSpan, count, scheduler), toArray);
	};

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var AnonymousObservable = __webpack_require__(35);
	var Subject = __webpack_require__(57);
	var CompositeDisposable = __webpack_require__(18);
	var RefCountDisposable = __webpack_require__(151);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var addRef = __webpack_require__(153);
	var isScheduler = __webpack_require__(17).isScheduler;

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	module.exports = function windowTimeOrCount(source, timeSpan, count, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  return new AnonymousObservable(function (observer) {
	    var timerD = new SerialDisposable(),
	        groupDisposable = new CompositeDisposable(timerD),
	        refCountDisposable = new RefCountDisposable(groupDisposable),
	        n = 0,
	        windowId = 0,
	        s = new Subject();

	    function createTimer(id) {
	      var m = new SingleAssignmentDisposable();
	      timerD.setDisposable(m);
	      m.setDisposable(scheduler.scheduleFuture(null, timeSpan, function () {
	        if (id !== windowId) {
	          return;
	        }
	        n = 0;
	        var newId = ++windowId;
	        s.onCompleted();
	        s = new Subject();
	        observer.onNext(addRef(s, refCountDisposable));
	        createTimer(newId);
	      }));
	    }

	    observer.onNext(addRef(s, refCountDisposable));
	    createTimer(0);

	    groupDisposable.add(source.subscribe(function (x) {
	      var newId = 0,
	          newWindow = false;
	      s.onNext(x);
	      if (++n === count) {
	        newWindow = true;
	        n = 0;
	        newId = ++windowId;
	        s.onCompleted();
	        s = new Subject();
	        observer.onNext(addRef(s, refCountDisposable));
	      }
	      newWindow && createTimer(newId);
	    }, function (e) {
	      s.onError(e);
	      observer.onError(e);
	    }, function () {
	      s.onCompleted();
	      observer.onCompleted();
	    }));
	    return refCountDisposable;
	  }, source);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var bindCallback = __webpack_require__(52);
	var tryCatch = __webpack_require__(15).tryCatch;
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var inherits = __webpack_require__(6);

	function CatchObserver(o, s, fn) {
	  this._o = o;
	  this._s = s;
	  this._fn = fn;
	  AbstractObserver.call(this);
	}

	inherits(CatchObserver, AbstractObserver);

	CatchObserver.prototype.next = function (x) {
	  this._o.onNext(x);
	};
	CatchObserver.prototype.completed = function () {
	  return this._o.onCompleted();
	};
	CatchObserver.prototype.error = function (e) {
	  var result = tryCatch(this._fn)(e);
	  if (result === global._Rx.errorObj) {
	    return this._o.onError(result.e);
	  }
	  isPromise(result) && (result = fromPromise(result));

	  var d = new SingleAssignmentDisposable();
	  this._s.setDisposable(d);
	  d.setDisposable(result.subscribe(this._o));
	};

	function CatchObservable(source, fn) {
	  this.source = source;
	  this._fn = fn;
	  ObservableBase.call(this);
	}

	inherits(CatchObservable, ObservableBase);

	CatchObservable.prototype.subscribeCore = function (o) {
	  var d1 = new SingleAssignmentDisposable(),
	      subscription = new SerialDisposable();
	  subscription.setDisposable(d1);
	  d1.setDisposable(this.source.subscribe(new CatchObserver(o, subscription, this._fn)));
	  return subscription;
	};

	/**
	 * Continues an observable sequence that is terminated by an exception with the next observable sequence.
	 * @param {Mixed} handlerOrSecond Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.
	 * @returns {Observable} An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.
	 */
	module.exports = function catchHandler(source, handler, thisArg) {
	  var fn = bindCallback(handler, thisArg, 1);
	  return new CatchObservable(source, fn);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var mergeConcat = __webpack_require__(164);

	module.exports = function concatAll(sources) {
	  return mergeConcat(sources, 1);
	};

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var CompositeDisposable = __webpack_require__(18);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var inherits = __webpack_require__(6);

	function InnerObserver(parent, sad) {
	  this._p = parent;
	  this._sad = sad;
	  AbstractObserver.call(this);
	}

	inherits(InnerObserver, AbstractObserver);

	InnerObserver.prototype.next = function (x) {
	  this._p._o.onNext(x);
	};
	InnerObserver.prototype.error = function (e) {
	  this._p._o.onError(e);
	};
	InnerObserver.prototype.completed = function () {
	  this._p._g.remove(this._sad);
	  if (this._p._q.length > 0) {
	    this._p.handleSubscribe(this._p._q.shift());
	  } else {
	    this._p._activeCount--;
	    this._p._done && this._p._activeCount === 0 && this._p._o.onCompleted();
	  }
	};

	function MergeObserver(o, max, g) {
	  this._o = o;
	  this._max = max;
	  this._g = g;
	  this._done = false;
	  this._q = [];
	  this._activeCount = 0;
	  AbstractObserver.call(this);
	}

	inherits(MergeObserver, AbstractObserver);

	MergeObserver.prototype.handleSubscribe = function (xs) {
	  var sad = new SingleAssignmentDisposable();
	  this._g.add(sad);
	  isPromise(xs) && (xs = fromPromise(xs));
	  sad.setDisposable(xs.subscribe(new InnerObserver(this, sad)));
	};

	MergeObserver.prototype.next = function (innerSource) {
	  if (this._activeCount < this._max) {
	    this._activeCount++;
	    this.handleSubscribe(innerSource);
	  } else {
	    this._q.push(innerSource);
	  }
	};
	MergeObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	MergeObserver.prototype.completed = function () {
	  this._done = true;this._activeCount === 0 && this._o.onCompleted();
	};

	function MergeObservable(source, maxConcurrent) {
	  this.source = source;
	  this._maxConcurrent = maxConcurrent;
	  ObservableBase.call(this);
	}

	inherits(MergeObservable, ObservableBase);

	MergeObservable.prototype.subscribeCore = function (observer) {
	  var g = new CompositeDisposable();
	  g.add(this.source.subscribe(new MergeObserver(observer, this._maxConcurrent, g)));
	  return g;
	};

	/**
	* Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
	* Or merges two observable sequences into a single observable sequence.
	* @param {Mixed} [maxConcurrentOrOther] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.
	* @returns {Observable} The observable sequence that merges the elements of the inner sequences.
	*/
	module.exports = function mergeConcat(source, maxConcurrent) {
	  return new MergeObservable(source, maxConcurrent);
	};

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var bindCallback = __webpack_require__(52);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function CountObserver(o, fn, s) {
	  this._o = o;
	  this._fn = fn;
	  this._s = s;
	  this._i = 0;
	  this._c = 0;
	  AbstractObserver.call(this);
	}

	inherits(CountObserver, AbstractObserver);

	CountObserver.prototype.next = function (x) {
	  if (this._fn) {
	    var result = tryCatch(this._fn)(x, this._i++, this._s);
	    if (result === global._Rx.errorObj) {
	      return this._o.onError(result.e);
	    }
	    Boolean(result) && this._c++;
	  } else {
	    this._c++;
	  }
	};
	CountObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	CountObserver.prototype.completed = function () {
	  this._o.onNext(this._c);
	  this._o.onCompleted();
	};

	function CountObservable(source, fn) {
	  this.source = source;
	  this._fn = fn;
	  ObservableBase.call(this);
	}

	inherits(CountObservable, ObservableBase);

	CountObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new CountObserver(o, this._fn, this.source));
	};

	module.exports = function count(source, predicate, thisArg) {
	  var fn = bindCallback(predicate, thisArg, 3);
	  return new CountObservable(source, fn);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var BinaryDisposable = __webpack_require__(23);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var isFunction = __webpack_require__(9);
	var isScheduler = __webpack_require__(17).isScheduler;
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function DebounceObserver(o, dt, scheduler, cancelable) {
	  this._o = o;
	  this._d = dt;
	  this._scheduler = scheduler;
	  this._c = cancelable;
	  this._v = null;
	  this._hv = false;
	  this._id = 0;
	  AbstractObserver.call(this);
	}

	inherits(DebounceObserver, AbstractObserver);

	DebounceObserver.prototype.next = function (x) {
	  this._hv = true;
	  this._v = x;
	  var currentId = ++this._id,
	      d = new SingleAssignmentDisposable();
	  this._c.setDisposable(d);
	  d.setDisposable(this._scheduler.scheduleFuture(this, this._d, function (_, self) {
	    self._hv && self._id === currentId && self._o.onNext(x);
	    self._hv = false;
	  }));
	};

	DebounceObserver.prototype.error = function (e) {
	  this._c.dispose();
	  this._o.onError(e);
	  this._hv = false;
	  this._id++;
	};

	DebounceObserver.prototype.completed = function () {
	  this._c.dispose();
	  this._hv && this._o.onNext(this._v);
	  this._o.onCompleted();
	  this._hv = false;
	  this._id++;
	};

	function DebounceObservable(source, dt, s) {
	  isScheduler(s) || (s = global._Rx.defaultScheduler);
	  this.source = source;
	  this._dt = dt;
	  this._s = s;
	  ObservableBase.call(this);
	}

	inherits(DebounceObservable, ObservableBase);

	DebounceObservable.prototype.subscribeCore = function (o) {
	  var cancelable = new SerialDisposable();
	  return new BinaryDisposable(this.source.subscribe(new DebounceObserver(o, this._dt, this._s, cancelable)), cancelable);
	};

	function DebounceSelectorObserver(s) {
	  this._s = s;
	  AbstractObserver.call(this);
	}

	inherits(DebounceSelectorObserver, AbstractObserver);

	DebounceSelectorObserver.prototype.next = function (x) {
	  var throttle = tryCatch(this._s.fn)(x);
	  if (throttle === global._Rx.errorObj) {
	    return this._s.o.onError(throttle.e);
	  }

	  isPromise(throttle) && (throttle = fromPromise(throttle));

	  this._s.hasValue = true;
	  this._s.value = x;
	  this._s.id++;
	  var currentId = this._s.id,
	      d = new SingleAssignmentDisposable();
	  this._s.cancelable.setDisposable(d);

	  var self = this;
	  d.setDisposable(throttle.subscribe(function () {
	    self._s.hasValue && self._s.id === currentId && self._s.o.onNext(self._s.value);
	    self._s.hasValue = false;
	    d.dispose();
	  }, function (e) {
	    self._s.o.onError(e);
	  }, function () {
	    self._s.hasValue && self._s.id === currentId && self._s.o.onNext(self._s.value);
	    self._s.hasValue = false;
	    d.dispose();
	  }));
	};

	DebounceSelectorObserver.prototype.error = function (e) {
	  this._s.cancelable.dispose();
	  this._s.o.onError(e);
	  this._s.hasValue = false;
	  this._s.id++;
	};

	DebounceSelectorObserver.prototype.completed = function () {
	  this._s.cancelable.dispose();
	  this._s.hasValue && this._s.o.onNext(this._s.value);
	  this._s.o.onCompleted();
	  this._s.hasValue = false;
	  this._s.id++;
	};

	function DebounceSelectorObservable(source, fn) {
	  this.source = source;
	  this._fn = fn;
	  ObservableBase.call(this);
	}

	inherits(DebounceSelectorObservable, ObservableBase);

	DebounceSelectorObservable.prototype.subscribeCore = function (o) {
	  var state = {
	    value: null,
	    hasValue: false,
	    cancelable: new SerialDisposable(),
	    id: 0,
	    o: o,
	    fn: this._fn
	  };

	  return new BinaryDisposable(state.cancelable, this.source.subscribe(new DebounceSelectorObserver(state)));
	};

	module.exports = function debounce() {
	  var source = arguments[0];
	  if (isFunction(arguments[1])) {
	    return new DebounceSelectorObservable(source, arguments[1]);
	  } else if (typeof arguments[1] === 'number') {
	    return new DebounceObservable(source, arguments[1], arguments[2]);
	  } else {
	    throw new Error('Invalid arguments');
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var inherits = __webpack_require__(6);

	function DefaultIfEmptyObserver(o, d) {
	  this._o = o;
	  this._d = d;
	  this._f = false;
	  AbstractObserver.call(this);
	}

	inherits(DefaultIfEmptyObserver, AbstractObserver);

	DefaultIfEmptyObserver.prototype.next = function (x) {
	  this._f = true;
	  this._o.onNext(x);
	};
	DefaultIfEmptyObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	DefaultIfEmptyObserver.prototype.completed = function () {
	  !this._f && this._o.onNext(this._d);
	  this._o.onCompleted();
	};

	function DefaultIfEmptyObservable(source, defaultValue) {
	  this.source = source;
	  this._d = defaultValue;
	  ObservableBase.call(this);
	}

	inherits(DefaultIfEmptyObservable, ObservableBase);

	DefaultIfEmptyObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new DefaultIfEmptyObserver(o, this._d));
	};

	/**
	 *  Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.
	 * @param defaultValue The value to return if the sequence is empty. If not provided, this defaults to null.
	 * @returns {Observable} An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself.
	 */
	module.exports = function defaultIfEmpty(source, defaultValue) {
	  return new DefaultIfEmptyObservable(source, defaultValue);
	};

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var materialize = __webpack_require__(142);
	var timestamp = __webpack_require__(169);
	var isObservable = __webpack_require__(8).isObservable;
	var AbstractObserver = __webpack_require__(5);
	var BinaryDisposable = __webpack_require__(23);
	var CompositeDisposable = __webpack_require__(18);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var isFunction = __webpack_require__(9);
	var isScheduler = __webpack_require__(17).isScheduler;
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function scheduleRelative(state, recurse) {
	  if (state.error) {
	    return;
	  }
	  state.running = true;

	  var result;
	  do {
	    result = null;
	    if (state.q.length > 0 && state.q[0].timestamp - state.scheduler.now() <= 0) {
	      result = state.q.shift().value;
	    }
	    if (result) {
	      result.accept(state.o);
	    }
	  } while (result);

	  var shouldRecurse = false;
	  var recurseDueTime = 0;

	  if (state.q.length > 0) {
	    shouldRecurse = true;
	    recurseDueTime = Math.max(0, state.q[0].timestamp - state.scheduler.now());
	  } else {
	    state.active = false;
	  }

	  state.running = false;
	  if (state.error) {
	    state.o.onError(state.error);
	  } else if (shouldRecurse) {
	    recurse(state, recurseDueTime);
	  }
	}

	function DelayRelativeObserver(state) {
	  this._s = state;
	  AbstractObserver.call(this);
	}

	inherits(DelayRelativeObserver, AbstractObserver);

	DelayRelativeObserver.prototype.next = function (notification) {
	  var shouldRun;
	  if (notification.value.kind === 'E') {
	    this._s.q = [];
	    this._s.q.push(notification);
	    this._s.error = notification.value.error;
	    shouldRun = !this._s.running;
	  } else {
	    this._s.q.push({ value: notification.value, timestamp: notification.timestamp + this._s.dueTime });
	    shouldRun = !this._s.active;
	    this._s.active = true;
	  }
	  if (shouldRun) {
	    if (this._s.error) {
	      this._s.o.onError(this._s.error);
	    } else {
	      var d = new SingleAssignmentDisposable();
	      this._s.cancelable.setDisposable(d);
	      d.setDisposable(this._s.scheduler.scheduleRecursiveFuture(this._s, this._s.dueTime, scheduleRelative));
	    }
	  }
	};

	DelayRelativeObserver.prototype.error = function (e) {
	  throw e;
	};
	DelayRelativeObserver.prototype.completed = function () {};

	function DelayRelativeObservable(source, dueTime, scheduler) {
	  this.source = source;
	  this._dueTime = dueTime;
	  this._scheduler = scheduler;
	  ObservableBase.call(this);
	}

	inherits(DelayRelativeObservable, ObservableBase);

	DelayRelativeObservable.prototype.subscribeCore = function (o) {
	  var state = {
	    active: false,
	    cancelable: new SerialDisposable(),
	    error: null,
	    q: [],
	    running: false,
	    o: o,
	    dueTime: this._dueTime,
	    scheduler: this._scheduler
	  };

	  var subscription = timestamp(materialize(this.source), this._scheduler).subscribe(new DelayRelativeObserver(state));

	  return new BinaryDisposable(subscription, state.cancelable);
	};

	function DelayAbsoluteObservable(source, dueTime, scheduler) {
	  this.source = source;
	  this._dueTime = dueTime;
	  this._scheduler = scheduler;
	  ObservableBase.call(this);
	}

	inherits(DelayAbsoluteObservable, ObservableBase);

	DelayAbsoluteObservable.prototype.subscribe = function (o) {
	  var obs = new DelayRelativeObservable(this.source, this._dueTime - this._scheduler.now(), this._scheduler);
	  return obs.subscribe(o);
	};

	function DelaySelectorObseravble(source, subscriptionDelay, delayDurationSelector) {
	  this.source = source;
	  this._selector = null;
	  this._subDelay = null;
	  if (isFunction(subscriptionDelay)) {
	    this._selector = subscriptionDelay;
	  } else {
	    this._subDelay = subscriptionDelay;
	    this._selector = delayDurationSelector;
	  }
	  ObservableBase.call(this);
	}

	inherits(DelaySelectorObseravble, ObservableBase);

	DelaySelectorObseravble.prototype.subscribeCore = function (o) {
	  var delays = new CompositeDisposable(),
	      atEnd = false,
	      subscription = new SerialDisposable(),
	      selector = this._selector,
	      subDelay = this._subDelay,
	      source = this.source;

	  function start() {
	    subscription.setDisposable(source.subscribe(function (x) {
	      var delay = tryCatch(selector)(x);
	      if (delay === global._Rx.errorObj) {
	        return o.onError(delay.e);
	      }
	      var d = new SingleAssignmentDisposable();
	      delays.add(d);
	      d.setDisposable(delay.subscribe(function () {
	        o.onNext(x);
	        delays.remove(d);
	        done();
	      }, function (e) {
	        o.onError(e);
	      }, function () {
	        o.onNext(x);
	        delays.remove(d);
	        done();
	      }));
	    }, function (e) {
	      o.onError(e);
	    }, function () {
	      atEnd = true;
	      subscription.dispose();
	      done();
	    }));
	  }

	  function done() {
	    atEnd && delays.length === 0 && o.onCompleted();
	  }

	  if (!subDelay) {
	    start();
	  } else {
	    subscription.setDisposable(subDelay.subscribe(start, function (e) {
	      o.onError(e);
	    }, start));
	  }

	  return new BinaryDisposable(subscription, delays);
	};

	/**
	 *  Time shifts the observable sequence by dueTime.
	 *  The relative time intervals between the values are preserved.
	 *
	 * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
	 * @param {Scheduler} [scheduler] Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.
	 * @returns {Observable} Time-shifted sequence.
	 */
	module.exports = function delay() {
	  var source = arguments[0],
	      firstArg = arguments[1];
	  if (typeof firstArg === 'number' || firstArg instanceof Date) {
	    var dueTime = firstArg,
	        scheduler = arguments[2];
	    isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	    return dueTime instanceof Date ? new DelayAbsoluteObservable(source, dueTime, scheduler) : new DelayRelativeObservable(source, dueTime, scheduler);
	  } else if (isObservable(firstArg) || isFunction(firstArg)) {
	    return new DelaySelectorObseravble(source, firstArg, arguments[2]);
	  } else {
	    throw new Error('Invalid arguments');
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var isScheduler = __webpack_require__(17).isScheduler;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function TimestampObserver(o, s) {
	  this._o = o;
	  this._s = s;
	  AbstractObserver.call(this);
	}

	inherits(TimestampObserver, AbstractObserver);

	TimestampObserver.prototype.next = function (x) {
	  this._o.onNext({ value: x, timestamp: this._s.now() });
	};
	TimestampObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	TimestampObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function TimestampObservable(source, s) {
	  this.source = source;
	  this._s = s;
	  ObservableBase.call(this);
	}

	inherits(TimestampObservable, ObservableBase);

	TimestampObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new TimestampObserver(o, this._s));
	};

	module.exports = function timestamp(source, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  return new TimestampObservable(source, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var SerialDisposable = __webpack_require__(44);
	var isScheduler = __webpack_require__(17).isScheduler;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function DelaySubscription(source, dt, s) {
	  this.source = source;
	  this._dt = dt;
	  this._s = s;
	  ObservableBase.call(this);
	}

	inherits(DelaySubscription, ObservableBase);

	function scheduleMethod(s, state) {
	  var source = state[0],
	      o = state[1],
	      d = state[2];
	  d.setDisposable(source.subscribe(o));
	}

	DelaySubscription.prototype.subscribeCore = function (o) {
	  var d = new SerialDisposable();
	  d.setDisposable(this._s.scheduleFuture([this.source, o, d], this._dt, scheduleMethod));
	  return d;
	};

	/**
	 *  Time shifts the observable sequence by delaying the subscription with the specified relative time duration, using the specified scheduler to run timers.
	 * @param {Number} dueTime Relative or absolute time shift of the subscription.
	 * @param {Scheduler} [scheduler]  Scheduler to run the subscription delay timer on. If not specified, the timeout scheduler is used.
	 * @returns {Observable} Time-shifted sequence.
	 */
	module.exports = function delaySubscription(source, dueTime, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  return new DelaySubscription(source, dueTime, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var inherits = __webpack_require__(6);

	function DematerializeObserver(o) {
	  this._o = o;
	  AbstractObserver.call(this);
	}

	inherits(DematerializeObserver, AbstractObserver);

	DematerializeObserver.prototype.next = function (x) {
	  x.accept(this._o);
	};
	DematerializeObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	DematerializeObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function DematerializeObservable(source) {
	  this.source = source;
	  ObservableBase.call(this);
	}

	inherits(DematerializeObservable, ObservableBase);

	DematerializeObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new DematerializeObserver(o));
	};

	/**
	 * Dematerializes the explicit notification values of an observable sequence as implicit notifications.
	 * @returns {Observable} An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.
	 */
	module.exports = function dematerialize(source) {
	  return new DematerializeObservable(source);
	};

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var isFunction = __webpack_require__(9);
	var tryCatch = __webpack_require__(15).tryCatch;
	var isEqual = __webpack_require__(75);
	var inherits = __webpack_require__(6);

	function arrayIndexOfComparer(array, item, comparer) {
	  for (var i = 0, len = array.length; i < len; i++) {
	    if (comparer(array[i], item)) {
	      return i;
	    }
	  }
	  return -1;
	}

	function HashSet(cmp) {
	  this._cmp = cmp;
	  this._set = [];
	}

	HashSet.prototype.push = function (v) {
	  var retValue = arrayIndexOfComparer(this._set, v, this._cmp) === -1;
	  retValue && this._set.push(v);
	  return retValue;
	};

	function DistinctObserver(o, keyFn, cmpFn) {
	  this._o = o;
	  this._keyFn = keyFn;
	  this._h = new HashSet(cmpFn);
	  AbstractObserver.call(this);
	}

	inherits(DistinctObserver, AbstractObserver);

	DistinctObserver.prototype.next = function (x) {
	  var key = x;
	  if (isFunction(this._keyFn)) {
	    key = tryCatch(this._keyFn)(x);
	    if (key === global._Rx.errorObj) {
	      return this._o.onError(key.e);
	    }
	  }
	  this._h.push(key) && this._o.onNext(x);
	};

	DistinctObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	DistinctObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function DistinctObservable(source, keyFn, cmpFn) {
	  this.source = source;
	  this._keyFn = keyFn;
	  this._cmpFn = cmpFn;
	  ObservableBase.call(this);
	}

	inherits(DistinctObservable, ObservableBase);

	DistinctObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new DistinctObserver(o, this._keyFn, this._cmpFn));
	};

	module.exports = function distinct(source, keySelector, comparer) {
	  comparer || (comparer = isEqual);
	  return new DistinctObservable(source, keySelector, comparer);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var isFunction = __webpack_require__(9);
	var isEqual = __webpack_require__(75);
	var inherits = __webpack_require__(6);
	var tryCatch = __webpack_require__(15).tryCatch;

	function DistinctUntilChangedObserver(o, fn, cmp) {
	  this._o = o;
	  this._fn = fn;
	  this._cmp = cmp;
	  this._hk = false;
	  this._k = null;
	  AbstractObserver.call(this);
	}

	inherits(DistinctUntilChangedObserver, AbstractObserver);

	DistinctUntilChangedObserver.prototype.next = function (x) {
	  var key = x,
	      comparerEquals;
	  if (isFunction(this._fn)) {
	    key = tryCatch(this._fn)(x);
	    if (key === global._Rx.errorObj) {
	      return this._o.onError(key.e);
	    }
	  }
	  if (this._hk) {
	    comparerEquals = tryCatch(this._cmp)(this._k, key);
	    if (comparerEquals === global._Rx.errorObj) {
	      return this._o.onError(comparerEquals.e);
	    }
	  }
	  if (!this._hk || !comparerEquals) {
	    this._hk = true;
	    this._k = key;
	    this._o.onNext(x);
	  }
	};
	DistinctUntilChangedObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	DistinctUntilChangedObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function DistinctUntilChangedObservable(source, fn, cmp) {
	  this.source = source;
	  this._fn = fn;
	  this._cmp = cmp;
	  ObservableBase.call(this);
	}

	inherits(DistinctUntilChangedObservable, ObservableBase);

	DistinctUntilChangedObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new DistinctUntilChangedObserver(o, this._fn, this._cmp));
	};

	/**
	*  Returns an observable sequence that contains only distinct contiguous elements according to the keyFn and the comparer.
	* @param {Function} [keyFn] A function to compute the comparison key for each element. If not provided, it projects the value.
	* @param {Function} [comparer] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.
	* @returns {Observable} An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.
	*/
	module.exports = function distinctUntilChanged(source, keyFn, comparer) {
	  comparer || (comparer = isEqual);
	  return new DistinctUntilChangedObservable(source, keyFn, comparer);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var create = __webpack_require__(2);
	var isFunction = __webpack_require__(9);
	var noop = __webpack_require__(3);
	var inherits = __webpack_require__(6);
	var tryCatch = __webpack_require__(15).tryCatch;

	function TapObserver(o, p) {
	  this._o = o;
	  this._t = !p._oN || isFunction(p._oN) ? create(p._oN || noop, p._oE || noop, p._oC || noop) : p._oN;
	  this.isStopped = false;
	  AbstractObserver.call(this);
	}

	inherits(TapObserver, AbstractObserver);

	TapObserver.prototype.next = function (x) {
	  var res = tryCatch(this._t.onNext).call(this._t, x);
	  if (res === global._Rx.errorObj) {
	    this._o.onError(res.e);
	  }
	  this._o.onNext(x);
	};

	TapObserver.prototype.error = function (e) {
	  var res = tryCatch(this._t.onError).call(this._t, e);
	  if (res === global._Rx.errorObj) {
	    return this._o.onError(res.e);
	  }
	  this._o.onError(e);
	};

	TapObserver.prototype.completed = function () {
	  var res = tryCatch(this._t.onCompleted).call(this._t);
	  if (res === global._Rx.errorObj) {
	    return this._o.onError(res.e);
	  }
	  this._o.onCompleted();
	};

	function TapObservable(source, observerOrOnNext, onError, onCompleted) {
	  this.source = source;
	  this._oN = observerOrOnNext;
	  this._oE = onError;
	  this._oC = onCompleted;
	  ObservableBase.call(this);
	}

	inherits(TapObservable, ObservableBase);

	TapObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new TapObserver(o, this));
	};

	/**
	*  Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
	*  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	* @param {Function | Observer} observerOrOnNext Action to invoke for each element in the observable sequence or an o.
	* @param {Function} [onError]  Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
	* @param {Function} [onCompleted]  Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
	* @returns {Observable} The source sequence with the side-effecting behavior applied.
	*/
	module.exports = function tap(source, observerOrOnNext, onError, onCompleted) {
	  return new TapObservable(source, observerOrOnNext, onError, onCompleted);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var bindCallback = __webpack_require__(52);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function EveryObserver(o, fn, s) {
	  this._o = o;
	  this._fn = fn;
	  this._s = s;
	  this._i = 0;
	  AbstractObserver.call(this);
	}

	inherits(EveryObserver, AbstractObserver);

	EveryObserver.prototype.next = function (x) {
	  var result = tryCatch(this._fn)(x, this._i++, this._s);
	  if (result === global._Rx.errorObj) {
	    return this._o.onError(result.e);
	  }
	  if (!Boolean(result)) {
	    this._o.onNext(false);
	    this._o.onCompleted();
	  }
	};
	EveryObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	EveryObserver.prototype.completed = function () {
	  this._o.onNext(true);
	  this._o.onCompleted();
	};

	function EveryObservable(source, fn) {
	  this.source = source;
	  this._fn = fn;
	  ObservableBase.call(this);
	}

	inherits(EveryObservable, ObservableBase);

	EveryObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new EveryObserver(o, this._fn, this.source));
	};

	module.exports = function every(source, predicate, thisArg) {
	  var fn = bindCallback(predicate, thisArg, 3);
	  return new EveryObservable(source, fn);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var inherits = __webpack_require__(6);
	var bindCallback = __webpack_require__(52);
	var tryCatchUtils = __webpack_require__(15);
	var tryCatch = tryCatchUtils.tryCatch,
	    thrower = tryCatchUtils.thrower;

	function FinallyDisposable(s, fn) {
	  this.isDisposed = false;
	  this._s = s;
	  this._fn = fn;
	}

	FinallyDisposable.prototype.dispose = function () {
	  if (!this.isDisposed) {
	    var res = tryCatch(this._s.dispose).call(this._s);
	    this._fn();
	    res === global._Rx.errorObj && thrower(res.e);
	  }
	};

	function FinallyObservable(source, fn, thisArg) {
	  this.source = source;
	  this._fn = bindCallback(fn, thisArg, 0);
	  ObservableBase.call(this);
	}

	inherits(FinallyObservable, ObservableBase);

	FinallyObservable.prototype.subscribeCore = function (o) {
	  var d = tryCatch(this.source.subscribe).call(this.source, o);
	  if (d === global._Rx.errorObj) {
	    this._fn();
	    thrower(d.e);
	  }

	  return new FinallyDisposable(d, this._fn);
	};

	/**
	 *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
	 * @param {Function} finallyAction Action to invoke after the source observable sequence terminates.
	 * @returns {Observable} Source sequence with the action-invoking termination behavior applied.
	 */
	module.exports = function finally_(source, action, thisArg) {
	  return new FinallyObservable(source, action, thisArg);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var FindValueObservable = __webpack_require__(178);

	module.exports = function find(source, predicate, thisArg) {
	  return new FindValueObservable(source, predicate, thisArg, false);
	};

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var bindCallback = __webpack_require__(52);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function FindValueObserver(observer, source, callback, yieldIndex) {
	  this._o = observer;
	  this._s = source;
	  this._cb = callback;
	  this._y = yieldIndex;
	  this._i = 0;
	  AbstractObserver.call(this);
	}

	inherits(FindValueObserver, AbstractObserver);

	FindValueObserver.prototype.next = function (x) {
	  var shouldRun = tryCatch(this._cb)(x, this._i, this._s);
	  if (shouldRun === global._Rx.errorObj) {
	    return this._o.onError(shouldRun.e);
	  }
	  if (shouldRun) {
	    this._o.onNext(this._y ? this._i : x);
	    this._o.onCompleted();
	  } else {
	    this._i++;
	  }
	};

	FindValueObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};

	FindValueObserver.prototype.completed = function () {
	  this._y && this._o.onNext(-1);
	  this._o.onCompleted();
	};

	function FindValueObservable(source, cb, thisArg, yieldIndex) {
	  this.source = source;
	  this._cb = bindCallback(cb, thisArg, 3);
	  this._yieldIndex = yieldIndex;
	  ObservableBase.call(this);
	}

	inherits(FindValueObservable, ObservableBase);

	FindValueObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new FindValueObserver(o, this.source, this._cb, this._yieldIndex));
	};

	module.exports = FindValueObservable;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var FindValueObservable = __webpack_require__(178);

	module.exports = function findIndex(source, predicate, thisArg) {
	  return new FindValueObservable(source, predicate, thisArg, true);
	};

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var EmptyError = __webpack_require__(7).EmptyError;
	var bindCallback = __webpack_require__(52);
	var isFunction = __webpack_require__(9);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function FirstObserver(o, obj, s) {
	  this._o = o;
	  this._obj = obj;
	  this._s = s;
	  this._i = 0;
	  AbstractObserver.call(this);
	}

	inherits(FirstObserver, AbstractObserver);

	FirstObserver.prototype.next = function (x) {
	  if (this._obj.predicate) {
	    var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
	    if (res === global._Rx.errorObj) {
	      return this._o.onError(res.e);
	    }
	    if (Boolean(res)) {
	      this._o.onNext(x);
	      this._o.onCompleted();
	    }
	  } else if (!this._obj.predicate) {
	    this._o.onNext(x);
	    this._o.onCompleted();
	  }
	};
	FirstObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	FirstObserver.prototype.completed = function () {
	  if (this._obj.defaultValue === undefined) {
	    this._o.onError(new EmptyError());
	  } else {
	    this._o.onNext(this._obj.defaultValue);
	    this._o.onCompleted();
	  }
	};

	function FirstObservable(source, obj) {
	  this.source = source;
	  this._obj = obj;
	  ObservableBase.call(this);
	}

	inherits(FirstObservable, ObservableBase);

	FirstObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new FirstObserver(o, this._obj, this.source));
	};

	module.exports = function first() {
	  var obj = {},
	      source = arguments[0];
	  if (typeof arguments[1] === 'object') {
	    obj = arguments[1];
	  } else {
	    obj = {
	      predicate: arguments[1],
	      thisArg: arguments[2],
	      defaultValue: arguments[3]
	    };
	  }
	  if (isFunction(obj.predicate)) {
	    var fn = obj.predicate;
	    obj.predicate = bindCallback(fn, obj.thisArg, 3);
	  }
	  return new FirstObservable(source, obj);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var FlatMapObservable = __webpack_require__(147);
	var switchLatest = __webpack_require__(182);

	module.exports = function flatMapLatest(source, selector, resultSelector, thisArg) {
	  return switchLatest(new FlatMapObservable(source, selector, resultSelector, thisArg));
	};

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var BinaryDisposable = __webpack_require__(23);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var inherits = __webpack_require__(6);

	function InnerObserver(p, id) {
	  this._p = p;
	  this._id = id;
	  AbstractObserver.call(this);
	}

	inherits(InnerObserver, AbstractObserver);

	InnerObserver.prototype.next = function (x) {
	  this._p._latest === this._id && this._p._o.onNext(x);
	};
	InnerObserver.prototype.error = function (e) {
	  this._p._latest === this._id && this._p._o.onError(e);
	};
	InnerObserver.prototype.completed = function () {
	  if (this._p._latest === this._id) {
	    this._p._hasLatest = false;
	    this._p._stopped && this._p._o.onCompleted();
	  }
	};

	function SwitchObserver(o, inner) {
	  this._o = o;
	  this._inner = inner;
	  this._stopped = false;
	  this._latest = 0;
	  this._hasLatest = false;
	  AbstractObserver.call(this);
	}

	inherits(SwitchObserver, AbstractObserver);

	SwitchObserver.prototype.next = function (innerSource) {
	  var d = new SingleAssignmentDisposable(),
	      id = ++this._latest;
	  this._hasLatest = true;
	  this._inner.setDisposable(d);
	  isPromise(innerSource) && (innerSource = fromPromise(innerSource));
	  d.setDisposable(innerSource.subscribe(new InnerObserver(this, id)));
	};
	SwitchObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	SwitchObserver.prototype.completed = function () {
	  this._stopped = true;!this._hasLatest && this._o.onCompleted();
	};

	function SwitchObservable(source) {
	  this.source = source;
	  ObservableBase.call(this);
	}

	inherits(SwitchObservable, ObservableBase);

	SwitchObservable.prototype.subscribeCore = function (o) {
	  var inner = new SerialDisposable(),
	      s = this.source.subscribe(new SwitchObserver(o, inner));
	  return new BinaryDisposable(s, inner);
	};

	/**
	* Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
	* @returns {Observable} The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.
	*/
	module.exports = function switch_(source) {
	  return new SwitchObservable(source);
	};

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var noop = __webpack_require__(3);
	var inherits = __webpack_require__(6);

	function IgnoreElementsObserver(o) {
	  this._o = o;
	  AbstractObserver.call(this);
	}

	inherits(IgnoreElementsObserver, AbstractObserver);

	IgnoreElementsObserver.prototype.next = noop;
	IgnoreElementsObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	IgnoreElementsObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function IgnoreElementsObservable(source) {
	  this.source = source;
	  ObservableBase.call(this);
	}

	inherits(IgnoreElementsObservable, ObservableBase);

	IgnoreElementsObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new IgnoreElementsObserver(o));
	};

	/**
	 *  Ignores all elements in an observable sequence leaving only the termination messages.
	 * @returns {Observable} An empty observable sequence that signals termination, successful or exceptional, of the source sequence.
	 */
	module.exports = function ignoreElements(source) {
	  return new IgnoreElementsObservable(source);
	};

/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var Disposable = __webpack_require__(12);
	var inherits = __webpack_require__(6);

	function IncludesObserver(o, elem, n) {
	  this._o = o;
	  this._elem = elem;
	  this._n = n;
	  this._i = 0;
	  AbstractObserver.call(this);
	}

	inherits(IncludesObserver, AbstractObserver);

	function comparer(a, b) {
	  return a === 0 && b === 0 || a === b || isNaN(a) && isNaN(b);
	}

	IncludesObserver.prototype.next = function (x) {
	  if (this._i++ >= this._n && comparer(x, this._elem)) {
	    this._o.onNext(true);
	    this._o.onCompleted();
	  }
	};
	IncludesObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	IncludesObserver.prototype.completed = function () {
	  this._o.onNext(false);this._o.onCompleted();
	};

	function IncludesObservable(source, elem, idx) {
	  var n = +idx || 0;
	  Math.abs(n) === Infinity && (n = 0);

	  this.source = source;
	  this._elem = elem;
	  this._n = n;
	  ObservableBase.call(this);
	}

	inherits(IncludesObservable, ObservableBase);

	IncludesObservable.prototype.subscribeCore = function (o) {
	  if (this._n < 0) {
	    o.onNext(false);
	    o.onCompleted();
	    return Disposable.empty;
	  }

	  return this.source.subscribe(new IncludesObserver(o, this._elem, this._n));
	};

	module.exports = function includes(source, searchElement, fromIndex) {
	  return new IncludesObservable(source, searchElement, fromIndex);
	};

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var Disposable = __webpack_require__(12);
	var inherits = __webpack_require__(6);

	function IndexOfObserver(o, e, n) {
	  this._o = o;
	  this._e = e;
	  this._n = n;
	  this._i = 0;
	  AbstractObserver.call(this);
	}

	inherits(IndexOfObserver, AbstractObserver);

	IndexOfObserver.prototype.next = function (x) {
	  if (this._i >= this._n && x === this._e) {
	    this._o.onNext(this._i);
	    this._o.onCompleted();
	  }
	  this._i++;
	};
	IndexOfObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	IndexOfObserver.prototype.completed = function () {
	  this._o.onNext(-1);this._o.onCompleted();
	};

	function IndexOfObservable(source, e, n) {
	  this.source = source;
	  this._e = e;
	  this._n = n;
	  ObservableBase.call(this);
	}

	inherits(IndexOfObservable, ObservableBase);

	IndexOfObservable.prototype.subscribeCore = function (o) {
	  if (this._n < 0) {
	    o.onNext(-1);
	    o.onCompleted();
	    return Disposable.empty;
	  }

	  return this.source.subscribe(new IndexOfObserver(o, this._e, this._n));
	};

	module.exports = function indexOf(source, searchElement, fromIndex) {
	  var n = +fromIndex || 0;
	  Math.abs(n) === Infinity && (n = 0);
	  return new IndexOfObservable(source, searchElement, n);
	};

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var inherits = __webpack_require__(6);

	function IsEmptyObserver(o) {
	  this._o = o;
	  AbstractObserver.call(this);
	}

	inherits(IsEmptyObserver, AbstractObserver);

	IsEmptyObserver.prototype.next = function () {
	  this._o.onNext(false);
	  this._o.onCompleted();
	};
	IsEmptyObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	IsEmptyObserver.prototype.completed = function () {
	  this._o.onNext(true);
	  this._o.onCompleted();
	};

	function IsEmptyObservable(source) {
	  this.source = source;
	  ObservableBase.call(this);
	}

	inherits(IsEmptyObservable, ObservableBase);

	IsEmptyObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new IsEmptyObserver(o));
	};

	module.exports = function isEmpty(source) {
	  return new IsEmptyObservable(source);
	};

/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var AnonymousObservable = __webpack_require__(35); // TODO: Get rid of
	var take = __webpack_require__(154);
	var CompositeDisposable = __webpack_require__(18);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var noop = __webpack_require__(3);
	var tryCatch = __webpack_require__(15).tryCatch;

	__webpack_require__(81);

	module.exports = function join(left, right, leftDurationSelector, rightDurationSelector, resultSelector) {
	  return new AnonymousObservable(function (o) {
	    var group = new CompositeDisposable();
	    var leftDone = false,
	        rightDone = false;
	    var leftId = 0,
	        rightId = 0;
	    var leftMap = new global.Map(),
	        rightMap = new global.Map();
	    var handleError = function (e) {
	      o.onError(e);
	    };

	    group.add(left.subscribe(function (value) {
	      var id = leftId++,
	          md = new SingleAssignmentDisposable();

	      leftMap.set(id, value);
	      group.add(md);

	      var duration = tryCatch(leftDurationSelector)(value);
	      if (duration === global._Rx.errorObj) {
	        return o.onError(duration.e);
	      }

	      md.setDisposable(take(duration, 1).subscribe(noop, handleError, function () {
	        leftMap['delete'](id) && leftMap.size === 0 && leftDone && o.onCompleted();
	        group.remove(md);
	      }));

	      rightMap.forEach(function (v) {
	        var result = tryCatch(resultSelector)(value, v);
	        if (result === global._Rx.errorObj) {
	          return o.onError(result.e);
	        }
	        o.onNext(result);
	      });
	    }, handleError, function () {
	      leftDone = true;
	      (rightDone || leftMap.size === 0) && o.onCompleted();
	    }));

	    group.add(right.subscribe(function (value) {
	      var id = rightId++,
	          md = new SingleAssignmentDisposable();

	      rightMap.set(id, value);
	      group.add(md);

	      var duration = tryCatch(rightDurationSelector)(value);
	      if (duration === global._Rx.errorObj) {
	        return o.onError(duration.e);
	      }

	      md.setDisposable(take(duration, 1).subscribe(noop, handleError, function () {
	        rightMap['delete'](id) && rightMap.size === 0 && rightDone && o.onCompleted();
	        group.remove(md);
	      }));

	      leftMap.forEach(function (v) {
	        var result = tryCatch(resultSelector)(v, value);
	        if (result === global._Rx.errorObj) {
	          return o.onError(result.e);
	        }
	        o.onNext(result);
	      });
	    }, handleError, function () {
	      rightDone = true;
	      (leftDone || rightMap.size === 0) && o.onCompleted();
	    }));
	    return group;
	  }, left);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var EmptyError = __webpack_require__(7).EmptyError;
	var bindCallback = __webpack_require__(52);
	var isFunction = __webpack_require__(9);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function LastObserver(o, obj, s) {
	  this._o = o;
	  this._obj = obj;
	  this._s = s;
	  this._i = 0;
	  this._hv = false;
	  this._v = null;
	  AbstractObserver.call(this);
	}

	inherits(LastObserver, AbstractObserver);

	LastObserver.prototype.next = function (x) {
	  var shouldYield = false;
	  if (this._obj.predicate) {
	    var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
	    if (res === global._Rx.errorObj) {
	      return this._o.onError(res.e);
	    }
	    Boolean(res) && (shouldYield = true);
	  } else if (!this._obj.predicate) {
	    shouldYield = true;
	  }
	  if (shouldYield) {
	    this._hv = true;
	    this._v = x;
	  }
	};
	LastObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	LastObserver.prototype.completed = function () {
	  if (this._hv) {
	    this._o.onNext(this._v);
	    this._o.onCompleted();
	  } else if (this._obj.defaultValue === undefined) {
	    this._o.onError(new EmptyError());
	  } else {
	    this._o.onNext(this._obj.defaultValue);
	    this._o.onCompleted();
	  }
	};

	function LastObservable(source, obj) {
	  this.source = source;
	  this._obj = obj;
	  ObservableBase.call(this);
	}

	inherits(LastObservable, ObservableBase);

	LastObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new LastObserver(o, this._obj, this.source));
	};

	module.exports = function last() {
	  var obj = {},
	      source = arguments[0];
	  if (typeof arguments[1] === 'object') {
	    obj = arguments[1];
	  } else {
	    obj = {
	      predicate: arguments[1],
	      thisArg: arguments[2],
	      defaultValue: arguments[3]
	    };
	  }
	  if (isFunction(obj.predicate)) {
	    var fn = obj.predicate;
	    obj.predicate = bindCallback(fn, obj.thisArg, 3);
	  }
	  return new LastObservable(source, obj);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var Disposable = __webpack_require__(12);
	var inherits = __webpack_require__(6);

	function LastIndexOfObserver(o, e, n) {
	  this._o = o;
	  this._e = e;
	  this._n = n;
	  this._v = 0;
	  this._hv = false;
	  this._i = 0;
	  AbstractObserver.call(this);
	}

	inherits(LastIndexOfObserver, AbstractObserver);

	LastIndexOfObserver.prototype.next = function (x) {
	  if (this._i >= this._n && x === this._e) {
	    this._hv = true;
	    this._v = this._i;
	  }
	  this._i++;
	};
	LastIndexOfObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	LastIndexOfObserver.prototype.completed = function () {
	  if (this._hv) {
	    this._o.onNext(this._v);
	  } else {
	    this._o.onNext(-1);
	  }
	  this._o.onCompleted();
	};

	function LastIndexOfObservable(source, e, n) {
	  this.source = source;
	  this._e = e;
	  this._n = n;
	  ObservableBase.call(this);
	}

	inherits(LastIndexOfObservable, ObservableBase);

	LastIndexOfObservable.prototype.subscribeCore = function (o) {
	  if (this._n < 0) {
	    o.onNext(-1);
	    o.onCompleted();
	    return Disposable.empty;
	  }

	  return this.source.subscribe(new LastIndexOfObserver(o, this._e, this._n));
	};

	module.exports = function lastIndexOf(source, searchElement, fromIndex) {
	  var n = +fromIndex || 0;
	  Math.abs(n) === Infinity && (n = 0);
	  return new LastIndexOfObservable(source, searchElement, n);
	};

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var bindCallback = __webpack_require__(52);
	var isFunction = __webpack_require__(9);
	var inherits = __webpack_require__(6);
	var tryCatch = __webpack_require__(15).tryCatch;

	function MapObserver(o, selector, source) {
	  this._o = o;
	  this._fn = selector;
	  this._s = source;
	  this._i = 0;
	  AbstractObserver.call(this);
	}

	inherits(MapObserver, AbstractObserver);

	MapObserver.prototype.next = function (x) {
	  var result = tryCatch(this._fn)(x, this._i++, this._s);
	  if (result === global._Rx.errorObj) {
	    return this._o.onError(result.e);
	  }
	  this._o.onNext(result);
	};

	MapObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	MapObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function MapObservable(source, fn, thisArg) {
	  this.source = source;
	  this._fn = bindCallback(fn, thisArg, 3);
	  ObservableBase.call(this);
	}

	inherits(MapObservable, ObservableBase);

	function innerMap(fn, self) {
	  return function (x, i, o) {
	    return fn.call(this, self._fn(x, i, o), i, o);
	  };
	}

	MapObservable.prototype.internalMap = function (fn, thisArg) {
	  return new MapObservable(this.source, innerMap(fn, this), thisArg);
	};

	MapObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new MapObserver(o, this._fn, this));
	};

	module.exports = function map(source, fn, thisArg) {
	  var thisFn = isFunction(fn) ? fn : function () {
	    return fn;
	  };
	  return source instanceof MapObservable ? source.internalMap(thisFn, thisArg) : new MapObservable(source, thisFn, thisArg);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var maxBy = __webpack_require__(192);
	var firstOnly = __webpack_require__(194);
	var identity = __webpack_require__(46);

	module.exports = function max(source, comparer) {
	  return maxBy(source, identity, comparer).map(firstOnly);
	};

/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ExtremaByObservable = __webpack_require__(193);

	function defaultComparer(x, y) {
	  return x > y ? 1 : y > x ? -1 : 0;
	}

	module.exports = function maxBy(source, keySelector, comparer) {
	  comparer || (comparer = defaultComparer);
	  return new ExtremaByObservable(source, keySelector, comparer);
	};

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function ExtremaByObserver(o, k, c) {
	  this._o = o;
	  this._k = k;
	  this._c = c;
	  this._v = null;
	  this._hv = false;
	  this._l = [];
	  AbstractObserver.call(this);
	}

	inherits(ExtremaByObserver, AbstractObserver);

	ExtremaByObserver.prototype.next = function (x) {
	  var key = tryCatch(this._k)(x);
	  if (key === global._Rx.errorObj) {
	    return this._o.onError(key.e);
	  }
	  var comparison = 0;
	  if (!this._hv) {
	    this._hv = true;
	    this._v = key;
	  } else {
	    comparison = tryCatch(this._c)(key, this._v);
	    if (comparison === global._Rx.errorObj) {
	      return this._o.onError(comparison.e);
	    }
	  }
	  if (comparison > 0) {
	    this._v = key;
	    this._l = [];
	  }
	  if (comparison >= 0) {
	    this._l.push(x);
	  }
	};

	ExtremaByObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};

	ExtremaByObserver.prototype.completed = function () {
	  this._o.onNext(this._l);
	  this._o.onCompleted();
	};

	function ExtremaByObservable(source, k, c) {
	  this.source = source;
	  this._k = k;
	  this._c = c;
	  ObservableBase.call(this);
	}

	inherits(ExtremaByObservable, ObservableBase);

	ExtremaByObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new ExtremaByObserver(o, this._k, this._c));
	};

	module.exports = ExtremaByObservable;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var EmptyError = __webpack_require__(7).EmptyError;

	module.exports = function firstOnly(x) {
	  if (x.length === 0) {
	    throw new EmptyError();
	  }
	  return x[0];
	};

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var minBy = __webpack_require__(196);
	var firstOnly = __webpack_require__(194);
	var identity = __webpack_require__(46);

	module.exports = function min(source, comparer) {
	  return minBy(source, identity, comparer).map(firstOnly);
	};

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ExtremaByObservable = __webpack_require__(193);

	function defaultComparer(x, y) {
	  return x > y ? 1 : y > x ? -1 : 0;
	}

	function minByFn(comparer) {
	  return function (x, y) {
	    return comparer(x, y) * -1;
	  };
	}

	module.exports = function minBy(source, keySelector, comparer) {
	  comparer || (comparer = defaultComparer);
	  return new ExtremaByObservable(source, keySelector, minByFn(comparer));
	};

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var ObserveOnObserver = __webpack_require__(198);
	var inherits = __webpack_require__(6);

	function ObserveOnObservable(source, s) {
	  this.source = source;
	  this._s = s;
	  ObservableBase.call(this);
	}

	inherits(ObserveOnObservable, ObservableBase);

	ObserveOnObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new ObserveOnObserver(this._s, o));
	};

	module.exports = function observeOn(source, scheduler) {
	  return new ObserveOnObservable(source, scheduler);
	};

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ScheduledObserver = __webpack_require__(199);
	var inherits = __webpack_require__(6);

	function ObserveOnObserver(scheduler, observer, cancel) {
	  ScheduledObserver.call(this, scheduler, observer);
	  this._cancel = cancel;
	}

	inherits(ObserveOnObserver, ScheduledObserver);

	ObserveOnObserver.prototype.next = function (value) {
	  ScheduledObserver.prototype.next.call(this, value);
	  this.ensureActive();
	};

	ObserveOnObserver.prototype.error = function (e) {
	  ScheduledObserver.prototype.error.call(this, e);
	  this.ensureActive();
	};

	ObserveOnObserver.prototype.completed = function () {
	  ScheduledObserver.prototype.completed.call(this);
	  this.ensureActive();
	};

	ObserveOnObserver.prototype.dispose = function () {
	  ScheduledObserver.prototype.dispose.call(this);
	  this._cancel && this._cancel.dispose();
	  this._cancel = null;
	};

	module.exports = ObserveOnObserver;

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var AbstractObserver = __webpack_require__(5);
	var SerialDisposable = __webpack_require__(44);
	var inherits = __webpack_require__(6);
	var tryCatchUtils = __webpack_require__(15);
	var tryCatch = tryCatchUtils.tryCatch,
	    thrower = tryCatchUtils.thrower;

	function ScheduledObserver(scheduler, observer) {
	  AbstractObserver.call(this);
	  this.scheduler = scheduler;
	  this.observer = observer;
	  this.isAcquired = false;
	  this.hasFaulted = false;
	  this.queue = [];
	  this.disposable = new SerialDisposable();
	}

	inherits(ScheduledObserver, AbstractObserver);

	function enqueueNext(observer, x) {
	  return function () {
	    observer.onNext(x);
	  };
	}
	function enqueueError(observer, e) {
	  return function () {
	    observer.onError(e);
	  };
	}
	function enqueueCompleted(observer) {
	  return function () {
	    observer.onCompleted();
	  };
	}

	ScheduledObserver.prototype.next = function (x) {
	  this.queue.push(enqueueNext(this.observer, x));
	};

	ScheduledObserver.prototype.error = function (e) {
	  this.queue.push(enqueueError(this.observer, e));
	};

	ScheduledObserver.prototype.completed = function () {
	  this.queue.push(enqueueCompleted(this.observer));
	};

	function scheduleMethod(state, recurse) {
	  var work;
	  if (state.queue.length > 0) {
	    work = state.queue.shift();
	  } else {
	    state.isAcquired = false;
	    return;
	  }
	  var res = tryCatch(work)();
	  if (res === global._Rx.errorObj) {
	    state.queue = [];
	    state.hasFaulted = true;
	    return thrower(res.e);
	  }
	  recurse(state);
	}

	ScheduledObserver.prototype.ensureActive = function () {
	  var isOwner = false;
	  if (!this.hasFaulted && this.queue.length > 0) {
	    isOwner = !this.isAcquired;
	    this.isAcquired = true;
	  }
	  isOwner && this.disposable.setDisposable(this.scheduler.scheduleRecursive(this, scheduleMethod));
	};

	ScheduledObserver.prototype.dispose = function () {
	  AbstractObserver.prototype.dispose.call(this);
	  this.disposable.dispose();
	};

	module.exports = ScheduledObserver;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var inherits = __webpack_require__(6);

	function PairwiseObserver(o) {
	  this._o = o;
	  this._p = null;
	  this._hp = false;
	  AbstractObserver.call(this);
	}

	inherits(PairwiseObserver, AbstractObserver);

	PairwiseObserver.prototype.next = function (x) {
	  if (this._hp) {
	    this._o.onNext([this._p, x]);
	  } else {
	    this._hp = true;
	  }
	  this._p = x;
	};
	PairwiseObserver.prototype.error = function (err) {
	  this._o.onError(err);
	};
	PairwiseObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function PairwiseObservable(source) {
	  this.source = source;
	  ObservableBase.call(this);
	}

	inherits(PairwiseObservable, ObservableBase);

	PairwiseObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new PairwiseObserver(o));
	};

	module.exports = function pairwise(source) {
	  return new PairwiseObservable(source);
	};

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var filter = __webpack_require__(156);
	var bindCallback = __webpack_require__(52);

	module.exports = function partition(source, predicate, thisArg) {
	  var fn = bindCallback(predicate, thisArg, 3);
	  return [filter(source, predicate, thisArg), filter(source, function (x, i, o) {
	    return !fn(x, i, o);
	  })];
	};

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var map = __webpack_require__(190);

	function plucker(args, len) {
	  return function mapper(x) {
	    var currentProp = x;
	    for (var i = 0; i < len; i++) {
	      var p = currentProp[args[i]];
	      if (typeof p !== 'undefined') {
	        currentProp = p;
	      } else {
	        return undefined;
	      }
	    }
	    return currentProp;
	  };
	}

	/**
	 * Retrieves the value of a specified nested property from all elements in
	 * the Observable sequence.
	 * @param {Arguments} arguments The nested properties to pluck.
	 * @returns {Observable} Returns a new Observable sequence of property values.
	 */
	module.exports = function pluck() {
	  var len = arguments.length,
	      args = new Array(len);
	  if (len === 0) {
	    throw new Error('List of properties cannot be empty.');
	  }
	  for (var i = 0; i < len; i++) {
	    args[i] = arguments[i];
	  }
	  var pluckedArgs = args.slice(1);
	  return map(args[0], plucker(pluckedArgs, pluckedArgs.length));
	};

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AsyncSubject = __webpack_require__(30);
	var multicast = __webpack_require__(58);
	var isFunction = __webpack_require__(9);

	module.exports = function publishLast(source, selector) {
	  return isFunction(selector) ? multicast(source, function () {
	    return new AsyncSubject();
	  }, selector) : multicast(source, new AsyncSubject());
	};

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var multicast = __webpack_require__(58);
	var BehaviorSubject = __webpack_require__(205);

	function createBehaviorSubject(initialValue) {
	  return function fn() {
	    return new BehaviorSubject(initialValue);
	  };
	}

	module.exports = function publishValue() {
	  var source = arguments[0];
	  if (arguments.length === 3) {
	    return multicast(source, createBehaviorSubject(arguments[2]), arguments[1]);
	  } else if (arguments.length === 2) {
	    return multicast(source, new BehaviorSubject(arguments[1]));
	  } else {
	    throw new Error('Invalid arguments');
	  }
	};

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Observable = __webpack_require__(8);
	var Observer = __webpack_require__(1);
	var Disposable = __webpack_require__(12);
	var InnerSubscription = __webpack_require__(31);
	var addProperties = __webpack_require__(32);
	var cloneArray = __webpack_require__(33);
	var thrower = __webpack_require__(15).thrower;
	var inherits = __webpack_require__(6);

	/**
	*  Represents a value that changes over time.
	*  Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications.
	*/
	function BehaviorSubject(value) {
	  this.value = value;
	  this.observers = [];
	  this.isDisposed = false;
	  this.isStopped = false;
	  this.hasError = false;
	  Observable.call(this);
	}

	inherits(BehaviorSubject, Observable);

	addProperties(BehaviorSubject.prototype, Observer.prototype, {
	  _subscribe: function (o) {
	    Disposable.checkDisposed(this);
	    if (!this.isStopped) {
	      this.observers.push(o);
	      o.onNext(this.value);
	      return new InnerSubscription(this, o);
	    }
	    if (this.hasError) {
	      o.onError(this.error);
	    } else {
	      o.onCompleted();
	    }
	    return Disposable.empty;
	  },
	  /**
	   * Gets the current value or throws an exception.
	   * Value is frozen after onCompleted is called.
	   * After onError is called always throws the specified exception.
	   * An exception is always thrown after dispose is called.
	   * @returns {Mixed} The initial value passed to the constructor until onNext is called; after which, the last value passed to onNext.
	   */
	  getValue: function () {
	    Disposable.checkDisposed(this);
	    if (this.hasError) {
	      thrower(this.error);
	    }
	    return this.value;
	  },
	  /**
	   * Indicates whether the subject has observers subscribed to it.
	   * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	   */
	  hasObservers: function () {
	    Disposable.checkDisposed(this);
	    return this.observers.length > 0;
	  },
	  /**
	   * Notifies all subscribed observers about the end of the sequence.
	   */
	  onCompleted: function () {
	    Disposable.checkDisposed(this);
	    if (this.isStopped) {
	      return;
	    }
	    this.isStopped = true;
	    for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	      os[i].onCompleted();
	    }

	    this.observers.length = 0;
	  },
	  /**
	   * Notifies all subscribed observers about the exception.
	   * @param {Mixed} error The exception to send to all observers.
	   */
	  onError: function (error) {
	    Disposable.checkDisposed(this);
	    if (this.isStopped) {
	      return;
	    }
	    this.isStopped = true;
	    this.hasError = true;
	    this.error = error;

	    for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	      os[i].onError(error);
	    }

	    this.observers.length = 0;
	  },
	  /**
	   * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	   * @param {Mixed} value The value to send to all observers.
	   */
	  onNext: function (value) {
	    Disposable.checkDisposed(this);
	    if (this.isStopped) {
	      return;
	    }
	    this.value = value;
	    for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	      os[i].onNext(value);
	    }
	  },
	  /**
	   * Unsubscribe all observers and release resources.
	   */
	  dispose: function () {
	    this.isDisposed = true;
	    this.observers = null;
	    this.value = null;
	    this.error = null;
	  }
	});

	module.exports = BehaviorSubject;

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var inherits = __webpack_require__(6);
	var tryCatch = __webpack_require__(15).tryCatch;
	var EmptyError = __webpack_require__(7).EmptyError;

	function ReduceObserver(o, parent) {
	  this._o = o;
	  this._p = parent;
	  this._fn = parent.accumulator;
	  this._hs = parent.hasSeed;
	  this._s = parent.seed;
	  this._ha = false;
	  this._a = null;
	  this._hv = false;
	  this._i = 0;
	  AbstractObserver.call(this);
	}

	inherits(ReduceObserver, AbstractObserver);

	ReduceObserver.prototype.next = function (x) {
	  !this._hv && (this._hv = true);
	  if (this._ha) {
	    this._a = tryCatch(this._fn)(this._a, x, this._i, this._p);
	  } else {
	    this._a = this._hs ? tryCatch(this._fn)(this._s, x, this._i, this._p) : x;
	    this._ha = true;
	  }
	  if (this._a === global._Rx.errorObj) {
	    return this._o.onError(this._a.e);
	  }
	  this._i++;
	};

	ReduceObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};

	ReduceObserver.prototype.completed = function () {
	  this._hv && this._o.onNext(this._a);
	  !this._hv && this._hs && this._o.onNext(this._s);
	  !this._hv && !this._hs && this._o.onError(new EmptyError());
	  this._o.onCompleted();
	};

	function ReduceObservable(source, accumulator, hasSeed, seed) {
	  this.source = source;
	  this.accumulator = accumulator;
	  this.hasSeed = hasSeed;
	  this.seed = seed;
	  ObservableBase.call(this);
	}

	inherits(ReduceObservable, ObservableBase);

	ReduceObservable.prototype.subscribeCore = function (observer) {
	  return this.source.subscribe(new ReduceObserver(observer, this));
	};

	/**
	* Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
	* For aggregation behavior with incremental intermediate results, see Observable.scan.
	* @param {Function} accumulator An accumulator function to be invoked on each element.
	* @param {Any} [seed] The initial accumulator value.
	* @returns {Observable} An observable sequence containing a single element with the final accumulator value.
	*/
	module.exports = function reduce() {
	  var hasSeed = false,
	      seed,
	      source = arguments[0],
	      accumulator = arguments[1];
	  if (arguments.length === 3) {
	    hasSeed = true;
	    seed = arguments[2];
	  }
	  return new ReduceObservable(source, accumulator, hasSeed, seed);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var Subject = __webpack_require__(57);
	var BinaryDisposable = __webpack_require__(23);
	var NAryDisposable = __webpack_require__(43);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.currentThreadScheduler) {
	  __webpack_require__(16);
	}

	var $iterator$ = '@@iterator';

	function repeat(value) {
	  return {
	    '@@iterator': function () {
	      return {
	        next: function () {
	          return { done: false, value: value };
	        }
	      };
	    }
	  };
	}

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

	function RepeatWhenObservable(source, notifier) {
	  this.source = source;
	  this._notifier = notifier;
	  ObservableBase.call(this);
	}

	inherits(RepeatWhenObservable, ObservableBase);

	RepeatWhenObservable.prototype.subscribeCore = function (o) {
	  var completions = new Subject(),
	      notifier = new Subject(),
	      handled = this._notifier(completions),
	      notificationDisposable = handled.subscribe(notifier);

	  var e = this.source[$iterator$]();

	  var state = { isDisposed: false },
	      lastError,
	      subscription = new SerialDisposable();
	  var cancelable = global._Rx.currentThreadScheduler.scheduleRecursive(null, function (_, recurse) {
	    if (state.isDisposed) {
	      return;
	    }
	    var currentItem = e.next();

	    if (currentItem.done) {
	      if (lastError) {
	        o.onError(lastError);
	      } else {
	        o.onCompleted();
	      }
	      return;
	    }

	    // Check if promise
	    var currentValue = currentItem.value;
	    isPromise(currentValue) && (currentValue = fromPromise(currentValue));

	    var outer = new SingleAssignmentDisposable();
	    var inner = new SingleAssignmentDisposable();
	    subscription.setDisposable(new BinaryDisposable(inner, outer));
	    outer.setDisposable(currentValue.subscribe(function (x) {
	      o.onNext(x);
	    }, function (exn) {
	      o.onError(exn);
	    }, function () {
	      inner.setDisposable(notifier.subscribe(recurse, function (ex) {
	        o.onError(ex);
	      }, function () {
	        o.onCompleted();
	      }));

	      completions.onNext(null);
	      outer.dispose();
	    }));
	  });

	  return new NAryDisposable([notificationDisposable, subscription, cancelable, createDisposable(state)]);
	};

	module.exports = function repeatWhen(source, notifier) {
	  return new RepeatWhenObservable(repeat(source), notifier);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var multicast = __webpack_require__(58);
	var ReplaySubject = __webpack_require__(209);
	var isFunction = __webpack_require__(9);

	module.exports = function replay(source, selector, bufferSize, windowSize, scheduler) {
	  return isFunction(selector) ? multicast(source, function () {
	    return new ReplaySubject(bufferSize, windowSize, scheduler);
	  }, selector) : multicast(source, new ReplaySubject(bufferSize, windowSize, scheduler));
	};

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var Disposable = __webpack_require__(12);
	var Observable = __webpack_require__(8);
	var Observer = __webpack_require__(1);
	var ScheduledObserver = __webpack_require__(199);
	var addProperties = __webpack_require__(32);
	var cloneArray = __webpack_require__(33);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.currentThreadScheduler) {
	  __webpack_require__(16);
	}

	var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

	function createRemovableDisposable(subject, observer) {
	  return Disposable.create(function () {
	    observer.dispose();
	    !subject.isDisposed && subject.observers.splice(subject.observers.indexOf(observer), 1);
	  });
	}

	/**
	 * Represents an object that is both an observable sequence as well as an observer.
	 * Each notification is broadcasted to all subscribed and future observers, subject to buffer trimming policies.
	 *
	 *  Initializes a new instance of the ReplaySubject class with the specified buffer size, window size and scheduler.
	 *  @param {Number} [bufferSize] Maximum element count of the replay buffer.
	 *  @param {Number} [windowSize] Maximum time length of the replay buffer.
	 *  @param {Scheduler} [scheduler] Scheduler the observers are invoked on.
	 */
	function ReplaySubject(bufferSize, windowSize, scheduler) {
	  this.bufferSize = bufferSize == null ? MAX_SAFE_INTEGER : bufferSize;
	  this.windowSize = windowSize == null ? MAX_SAFE_INTEGER : windowSize;
	  this.scheduler = scheduler || global._Rx.currentThreadScheduler;
	  this.q = [];
	  this.observers = [];
	  this.isStopped = false;
	  this.isDisposed = false;
	  this.hasError = false;
	  this.error = null;
	  Observable.call(this);
	}

	inherits(ReplaySubject, Observable);

	addProperties(ReplaySubject.prototype, Observer.prototype, {
	  _subscribe: function (o) {
	    Disposable.checkDisposed(this);
	    var so = new ScheduledObserver(this.scheduler, o),
	        subscription = createRemovableDisposable(this, so);

	    this._trim(this.scheduler.now());
	    this.observers.push(so);

	    for (var i = 0, len = this.q.length; i < len; i++) {
	      so.onNext(this.q[i].value);
	    }

	    if (this.hasError) {
	      so.onError(this.error);
	    } else if (this.isStopped) {
	      so.onCompleted();
	    }

	    so.ensureActive();
	    return subscription;
	  },
	  /**
	   * Indicates whether the subject has observers subscribed to it.
	   * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	   */
	  hasObservers: function () {
	    Disposable.checkDisposed(this);
	    return this.observers.length > 0;
	  },
	  _trim: function (now) {
	    while (this.q.length > this.bufferSize) {
	      this.q.shift();
	    }
	    while (this.q.length > 0 && now - this.q[0].interval > this.windowSize) {
	      this.q.shift();
	    }
	  },
	  /**
	   * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	   * @param {Mixed} value The value to send to all observers.
	   */
	  onNext: function (value) {
	    Disposable.checkDisposed(this);
	    if (this.isStopped) {
	      return;
	    }
	    var now = this.scheduler.now();
	    this.q.push({ interval: now, value: value });
	    this._trim(now);

	    for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	      var observer = os[i];
	      observer.onNext(value);
	      observer.ensureActive();
	    }
	  },
	  /**
	   * Notifies all subscribed observers about the exception.
	   * @param {Mixed} error The exception to send to all observers.
	   */
	  onError: function (error) {
	    Disposable.checkDisposed(this);
	    if (this.isStopped) {
	      return;
	    }
	    this.isStopped = true;
	    this.error = error;
	    this.hasError = true;
	    var now = this.scheduler.now();
	    this._trim(now);
	    for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	      var observer = os[i];
	      observer.onError(error);
	      observer.ensureActive();
	    }
	    this.observers.length = 0;
	  },
	  /**
	   * Notifies all subscribed observers about the end of the sequence.
	   */
	  onCompleted: function () {
	    Disposable.checkDisposed(this);
	    if (this.isStopped) {
	      return;
	    }
	    this.isStopped = true;
	    var now = this.scheduler.now();
	    this._trim(now);
	    for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	      var observer = os[i];
	      observer.onCompleted();
	      observer.ensureActive();
	    }
	    this.observers.length = 0;
	  },
	  /**
	   * Unsubscribe all observers and release resources.
	   */
	  dispose: function () {
	    this.isDisposed = true;
	    this.observers = null;
	  }
	});

	module.exports = ReplaySubject;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var AbstractObserver = __webpack_require__(5);
	var NAryDisposable = __webpack_require__(43);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.currentThreadScheduler) {
	  __webpack_require__(16);
	}

	var $iterator$ = '@@iterator';

	function repeat(value, count) {
	  count == null && (count = -1);
	  return {
	    '@@iterator': function () {
	      return {
	        remaining: count,
	        next: function () {
	          if (this.remaining === 0) {
	            return { done: true, value: undefined };
	          }
	          if (this.remaining > 0) {
	            this.remaining--;
	          }
	          return { done: false, value: value };
	        }
	      };
	    }
	  };
	}

	function CatchErrorObserver(state, recurse) {
	  this._state = state;
	  this._recurse = recurse;
	  AbstractObserver.call(this);
	}

	inherits(CatchErrorObserver, AbstractObserver);

	CatchErrorObserver.prototype.next = function (x) {
	  this._state.o.onNext(x);
	};
	CatchErrorObserver.prototype.error = function (e) {
	  this._state.lastError = e;this._recurse(this._state);
	};
	CatchErrorObserver.prototype.completed = function () {
	  this._state.o.onCompleted();
	};

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

	function CatchErrorObservable(sources) {
	  this.sources = sources;
	  ObservableBase.call(this);
	}

	inherits(CatchErrorObservable, ObservableBase);

	function scheduleMethod(state, recurse) {
	  if (state.isDisposed) {
	    return;
	  }
	  var currentItem = state.e.next();
	  if (currentItem.done) {
	    return state.lastError !== null ? state.o.onError(state.lastError) : state.o.onCompleted();
	  }

	  var currentValue = currentItem.value;
	  isPromise(currentValue) && (currentValue = fromPromise(currentValue));

	  var d = new SingleAssignmentDisposable();
	  state.subscription.setDisposable(d);
	  d.setDisposable(currentValue.subscribe(new CatchErrorObserver(state, recurse)));
	}

	CatchErrorObservable.prototype.subscribeCore = function (o) {
	  var subscription = new SerialDisposable();
	  var state = {
	    isDisposed: false,
	    e: this.sources[$iterator$](),
	    subscription: subscription,
	    lastError: null,
	    o: o
	  };

	  var cancelable = global._Rx.currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
	  return new NAryDisposable([subscription, cancelable, createDisposable(state)]);
	};

	module.exports = function retry(source, retryCount) {
	  return new CatchErrorObservable(repeat(source, retryCount));
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var Subject = __webpack_require__(57);
	var BinaryDisposable = __webpack_require__(23);
	var NAryDisposable = __webpack_require__(43);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.currentThreadScheduler) {
	  __webpack_require__(16);
	}

	var $iterator$ = '@@iterator';

	function repeat(value) {
	  return {
	    '@@iterator': function () {
	      return {
	        next: function () {
	          return { done: false, value: value };
	        }
	      };
	    }
	  };
	}

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

	function CatchErrorWhenObservable(source, notifier) {
	  this.source = source;
	  this._notifier = notifier;
	  ObservableBase.call(this);
	}

	inherits(CatchErrorWhenObservable, ObservableBase);

	CatchErrorWhenObservable.prototype.subscribeCore = function (o) {
	  var exceptions = new Subject(),
	      notifier = new Subject(),
	      handled = this._notifier(exceptions),
	      notificationDisposable = handled.subscribe(notifier);

	  var e = this.source[$iterator$]();

	  var state = { isDisposed: false },
	      lastError,
	      subscription = new SerialDisposable();
	  var cancelable = global._Rx.currentThreadScheduler.scheduleRecursive(null, function (_, recurse) {
	    if (state.isDisposed) {
	      return;
	    }
	    var currentItem = e.next();

	    if (currentItem.done) {
	      if (lastError) {
	        o.onError(lastError);
	      } else {
	        o.onCompleted();
	      }
	      return;
	    }

	    // Check if promise
	    var currentValue = currentItem.value;
	    isPromise(currentValue) && (currentValue = fromPromise(currentValue));

	    var outer = new SingleAssignmentDisposable();
	    var inner = new SingleAssignmentDisposable();
	    subscription.setDisposable(new BinaryDisposable(inner, outer));
	    outer.setDisposable(currentValue.subscribe(function (x) {
	      o.onNext(x);
	    }, function (exn) {
	      inner.setDisposable(notifier.subscribe(recurse, function (ex) {
	        o.onError(ex);
	      }, function () {
	        o.onCompleted();
	      }));

	      exceptions.onNext(exn);
	      outer.dispose();
	    }, function () {
	      o.onCompleted();
	    }));
	  });

	  return new NAryDisposable([notificationDisposable, subscription, cancelable, createDisposable(state)]);
	};

	module.exports = function retryWhen(source, notifier) {
	  return new CatchErrorWhenObservable(repeat(source), notifier);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var interval = __webpack_require__(63);
	var AbstractObserver = __webpack_require__(5);
	var BinaryDisposable = __webpack_require__(23);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var isScheduler = __webpack_require__(17).isScheduler;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function SamplerObserver(s) {
	  this._s = s;
	  AbstractObserver.call(this);
	}

	inherits(SamplerObserver, AbstractObserver);

	SamplerObserver.prototype._handleMessage = function () {
	  if (this._s.hasValue) {
	    this._s.hasValue = false;
	    this._s.o.onNext(this._s.value);
	  }
	  this._s.atEnd && this._s.o.onCompleted();
	};

	SamplerObserver.prototype.next = function () {
	  this._handleMessage();
	};
	SamplerObserver.prototype.error = function (e) {
	  this._s.onError(e);
	};
	SamplerObserver.prototype.completed = function () {
	  this._handleMessage();
	};

	function SampleSourceObserver(s) {
	  this._s = s;
	  AbstractObserver.call(this);
	}

	inherits(SampleSourceObserver, AbstractObserver);

	SampleSourceObserver.prototype.next = function (x) {
	  this._s.hasValue = true;
	  this._s.value = x;
	};
	SampleSourceObserver.prototype.error = function (e) {
	  this._s.o.onError(e);
	};
	SampleSourceObserver.prototype.completed = function () {
	  this._s.atEnd = true;
	  this._s.sourceSubscription.dispose();
	};

	function SampleObservable(source, sampler) {
	  this.source = source;
	  this._sampler = sampler;
	  ObservableBase.call(this);
	}

	inherits(SampleObservable, ObservableBase);

	SampleObservable.prototype.subscribeCore = function (o) {
	  var state = {
	    o: o,
	    atEnd: false,
	    value: null,
	    hasValue: false,
	    sourceSubscription: new SingleAssignmentDisposable()
	  };

	  state.sourceSubscription.setDisposable(this.source.subscribe(new SampleSourceObserver(state)));
	  return new BinaryDisposable(state.sourceSubscription, this._sampler.subscribe(new SamplerObserver(state)));
	};

	module.exports = function sample(source, intervalOrSampler, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  return typeof intervalOrSampler === 'number' ? new SampleObservable(source, interval(intervalOrSampler, scheduler)) : new SampleObservable(source, intervalOrSampler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var inherits = __webpack_require__(6);
	var tryCatch = __webpack_require__(15).tryCatch;

	function ScanObserver(o, parent) {
	  this._o = o;
	  this._p = parent;
	  this._fn = parent.accumulator;
	  this._hs = parent.hasSeed;
	  this._s = parent.seed;
	  this._ha = false;
	  this._a = null;
	  this._hv = false;
	  this._i = 0;
	  AbstractObserver.call(this);
	}

	inherits(ScanObserver, AbstractObserver);

	ScanObserver.prototype.next = function (x) {
	  !this._hv && (this._hv = true);
	  if (this._ha) {
	    this._a = tryCatch(this._fn)(this._a, x, this._i, this._p);
	  } else {
	    this._a = this._hs ? tryCatch(this._fn)(this._s, x, this._i, this._p) : x;
	    this._ha = true;
	  }
	  if (this._a === global._Rx.errorObj) {
	    return this._o.onError(this._a.e);
	  }
	  this._o.onNext(this._a);
	  this._i++;
	};

	ScanObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	ScanObserver.prototype.completed = function () {
	  !this._hv && this._hs && this._o.onNext(this._s);
	  this._o.onCompleted();
	};

	function ScanObservable(source, accumulator, hasSeed, seed) {
	  this.source = source;
	  this.accumulator = accumulator;
	  this.hasSeed = hasSeed;
	  this.seed = seed;
	  ObservableBase.call(this);
	}

	inherits(ScanObservable, ObservableBase);

	ScanObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new ScanObserver(o, this));
	};

	/**
	*  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
	*  For aggregation behavior with no intermediate results, see Observable.aggregate.
	* @param {Mixed} [seed] The initial accumulator value.
	* @param {Function} accumulator An accumulator function to be invoked on each element.
	* @returns {Observable} An observable sequence containing the accumulated values.
	*/
	module.exports = function scan() {
	  var source = arguments[0],
	      hasSeed = false,
	      seed,
	      accumulator = arguments[1];
	  if (arguments.length === 3) {
	    hasSeed = true;
	    seed = arguments[2];
	  }
	  return new ScanObservable(source, accumulator, hasSeed, seed);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var publish = __webpack_require__(56);

	module.exports = function share(source) {
	  return publish(source).refCount();
	};

/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var replay = __webpack_require__(208);

	module.exports = function shareReplay(source, bufferSize, windowSize, scheduler) {
	  return replay(source, null, bufferSize, windowSize, scheduler).refCount();
	};

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var publishValue = __webpack_require__(204);

	module.exports = function shareValue(source, initialValue) {
	  return publishValue(source, initialValue).refCount();
	};

/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AbstractObserver = __webpack_require__(5);
	var ObservableBase = __webpack_require__(11);
	var errors = __webpack_require__(7);
	var inherits = __webpack_require__(6);

	function SkipObserver(o, r) {
	  this._o = o;
	  this._r = r;
	  AbstractObserver.call(this);
	}

	inherits(SkipObserver, AbstractObserver);

	SkipObserver.prototype.next = function (x) {
	  if (this._r <= 0) {
	    this._o.onNext(x);
	  } else {
	    this._r--;
	  }
	};
	SkipObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	SkipObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function SkipObservable(source, count) {
	  this.source = source;
	  this._count = count;
	  ObservableBase.call(this);
	}

	inherits(SkipObservable, ObservableBase);

	SkipObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new SkipObserver(o, this._count));
	};

	/**
	 * Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.
	 * @param {Number} count The number of elements to skip before returning the remaining elements.
	 * @returns {Observable} An observable sequence that contains the elements that occur after the specified index in the input sequence.
	 */
	module.exports = function skip(source, count) {
	  if (count < 0) {
	    throw new errors.ArgumentOutOfRangeError();
	  }
	  return new SkipObservable(source, count);
	};

/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var inherits = __webpack_require__(6);

	function SkipLastObserver(o, c) {
	  this._o = o;
	  this._c = c;
	  this._q = [];
	  AbstractObserver.call(this);
	}

	inherits(SkipLastObserver, AbstractObserver);

	SkipLastObserver.prototype.next = function (x) {
	  this._q.push(x);
	  this._q.length > this._c && this._o.onNext(this._q.shift());
	};

	SkipLastObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	SkipLastObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function SkipLastObservable(source, c) {
	  this.source = source;
	  this._c = c;
	  ObservableBase.call(this);
	}

	inherits(SkipLastObservable, ObservableBase);

	SkipLastObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new SkipLastObserver(o, this._c));
	};

	module.exports = function skipLast(source, count) {
	  count < 0 && (count = 0);
	  return new SkipLastObservable(source, count);
	};

/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var isScheduler = __webpack_require__(17).isScheduler;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function SkipLastWithTimeObserver(o, p) {
	  this._o = o;
	  this._s = p._s;
	  this._d = p._d;
	  this._q = [];
	  AbstractObserver.call(this);
	}

	inherits(SkipLastWithTimeObserver, AbstractObserver);

	SkipLastWithTimeObserver.prototype.next = function (x) {
	  var now = this._s.now();
	  this._q.push({ interval: now, value: x });
	  while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
	    this._o.onNext(this._q.shift().value);
	  }
	};
	SkipLastWithTimeObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	SkipLastWithTimeObserver.prototype.completed = function () {
	  var now = this._s.now();
	  while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
	    this._o.onNext(this._q.shift().value);
	  }
	  this._o.onCompleted();
	};

	function SkipLastWithTimeObservable(source, d, s) {
	  this.source = source;
	  this._d = d;
	  this._s = s;
	  ObservableBase.call(this);
	}

	inherits(SkipLastWithTimeObservable, ObservableBase);

	SkipLastWithTimeObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new SkipLastWithTimeObserver(o, this));
	};

	module.exports = function skipLastWithTime(source, duration, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  return new SkipLastWithTimeObservable(source, duration, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var BinaryDisposable = __webpack_require__(23);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var inherits = __webpack_require__(6);

	function SkipUntilSourceObserver(o, p) {
	  this._o = o;
	  this._p = p;
	  AbstractObserver.call(this);
	}

	inherits(SkipUntilSourceObserver, AbstractObserver);

	SkipUntilSourceObserver.prototype.next = function (x) {
	  this._p._open && this._o.onNext(x);
	};
	SkipUntilSourceObserver.prototype.error = function (err) {
	  this._o.onError(err);
	};
	SkipUntilSourceObserver.prototype.onCompleted = function () {
	  this._p._open && this._o.onCompleted();
	};

	function SkipUntilOtherObserver(o, p, r) {
	  this._o = o;
	  this._p = p;
	  this._r = r;
	  AbstractObserver.call(this);
	}

	inherits(SkipUntilOtherObserver, AbstractObserver);

	SkipUntilOtherObserver.prototype.next = function () {
	  this._p._open = true;this._r.dispose();
	};
	SkipUntilOtherObserver.prototype.error = function (err) {
	  this._o.onError(err);
	};
	SkipUntilOtherObserver.prototype.onCompleted = function () {
	  this._r.dispose();
	};

	function SkipUntilObservable(source, other) {
	  this._s = source;
	  this._o = isPromise(other) ? fromPromise(other) : other;
	  this._open = false;
	  ObservableBase.call(this);
	}

	inherits(SkipUntilObservable, ObservableBase);

	SkipUntilObservable.prototype.subscribeCore = function (o) {
	  var leftSubscription = new SingleAssignmentDisposable();
	  leftSubscription.setDisposable(this._s.subscribe(new SkipUntilSourceObserver(o, this)));

	  isPromise(this._o) && (this._o = fromPromise(this._o));

	  var rightSubscription = new SingleAssignmentDisposable();
	  rightSubscription.setDisposable(this._o.subscribe(new SkipUntilOtherObserver(o, this, rightSubscription)));

	  return new BinaryDisposable(leftSubscription, rightSubscription);
	};

	/**
	 * Returns the values from the source observable sequence only after the other observable sequence produces a value.
	 * @param {Observable | Promise} other The observable sequence or Promise that triggers propagation of elements of the source sequence.
	 * @returns {Observable} An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.
	 */
	module.exports = function skipUntil(source, other) {
	  return new SkipUntilObservable(source, other);
	};

/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var BinaryDisposable = __webpack_require__(23);
	var isScheduler = __webpack_require__(17).isScheduler;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function SkipUntilWithTimeObserver(o, p) {
	  this._o = o;
	  this._p = p;
	  AbstractObserver.call(this);
	}

	inherits(SkipUntilWithTimeObserver, AbstractObserver);

	SkipUntilWithTimeObserver.prototype.next = function (x) {
	  this._p._open && this._o.onNext(x);
	};
	SkipUntilWithTimeObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	SkipUntilWithTimeObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function SkipUntilWithTimeObservable(source, startTime, scheduler) {
	  this.source = source;
	  this._st = startTime;
	  this._s = scheduler;
	  ObservableBase.call(this);
	}

	inherits(SkipUntilWithTimeObservable, ObservableBase);

	function scheduleMethod(s, state) {
	  state._open = true;
	}

	SkipUntilWithTimeObservable.prototype.subscribeCore = function (o) {
	  this._open = false;
	  return new BinaryDisposable(this._s.scheduleFuture(this, this._st, scheduleMethod), this.source.subscribe(new SkipUntilWithTimeObserver(o, this)));
	};

	module.exports = function skipUntilWithTime(source, startTime, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  return new SkipUntilWithTimeObservable(source, startTime, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var bindCallback = __webpack_require__(52);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function SkipWhileObserver(o, p) {
	  this._o = o;
	  this._p = p;
	  this._i = 0;
	  this._r = false;
	  AbstractObserver.call(this);
	}

	inherits(SkipWhileObserver, AbstractObserver);

	SkipWhileObserver.prototype.next = function (x) {
	  if (!this._r) {
	    var res = tryCatch(this._p._fn)(x, this._i++, this._p);
	    if (res === global._Rx.errorObj) {
	      return this._o.onError(res.e);
	    }
	    this._r = !res;
	  }
	  this._r && this._o.onNext(x);
	};
	SkipWhileObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	SkipWhileObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function SkipWhileObservable(source, fn) {
	  this.source = source;
	  this._fn = fn;
	  ObservableBase.call(this);
	}

	inherits(SkipWhileObservable, ObservableBase);

	SkipWhileObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new SkipWhileObserver(o, this));
	};

	module.exports = function skipWhile(source, predicate, thisArg) {
	  var fn = bindCallback(predicate, thisArg, 3);
	  return new SkipWhileObservable(source, fn);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var ArgumentOutOfRangeError = __webpack_require__(7).ArgumentOutOfRangeError;
	var inherits = __webpack_require__(6);

	function SliceObserver(o, b, e) {
	  this._o = o;
	  this._b = b;
	  this._e = e;
	  this._i = 0;
	  AbstractObserver.call(this);
	}

	inherits(SliceObserver, AbstractObserver);

	SliceObserver.prototype.next = function (x) {
	  if (this._i >= this._b) {
	    if (this._e === this._i) {
	      this._o.onCompleted();
	    } else {
	      this._o.onNext(x);
	    }
	  }
	  this._i++;
	};
	SliceObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	SliceObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function SliceObservable(source, b, e) {
	  this.source = source;
	  this._b = b;
	  this._e = e;
	  ObservableBase.call(this);
	}

	inherits(SliceObservable, ObservableBase);

	SliceObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new SliceObserver(o, this._b, this._e));
	};

	module.exports = function slice(source, begin, end) {
	  var start = begin || 0;
	  if (start < 0) {
	    throw new ArgumentOutOfRangeError();
	  }
	  if (typeof end === 'number' && end < start) {
	    throw new ArgumentOutOfRangeError();
	  }
	  return new SliceObservable(source, start, end);
	};

/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var ScheduledDisposable = __webpack_require__(225);
	var SerialDisposable = __webpack_require__(44);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var inherits = __webpack_require__(6);

	function SubscribeOnObservable(source, s) {
	  this.source = source;
	  this._s = s;
	  ObservableBase.call(this);
	}

	inherits(SubscribeOnObservable, ObservableBase);

	function scheduleMethod(scheduler, state) {
	  var source = state[0],
	      d = state[1],
	      o = state[2];
	  d.setDisposable(new ScheduledDisposable(scheduler, source.subscribe(o)));
	}

	SubscribeOnObservable.prototype.subscribeCore = function (o) {
	  var m = new SingleAssignmentDisposable(),
	      d = new SerialDisposable();
	  d.setDisposable(m);
	  m.setDisposable(this._s.schedule([this.source, d, o], scheduleMethod));
	  return d;
	};

	module.exports = function subscribeOn(source, scheduler) {
	  return new SubscribeOnObservable(source, scheduler);
	};

/***/ },
/* 225 */
/***/ function(module, exports) {

	'use strict';

	function ScheduledDisposable(scheduler, disposable) {
	  this._scheduler = scheduler;
	  this._disposable = disposable;
	  this.isDisposed = false;
	}

	function scheduleItem(s, self) {
	  if (!self.isDisposed) {
	    self.isDisposed = true;
	    self._disposable.dispose();
	  }
	}

	ScheduledDisposable.prototype.dispose = function () {
	  this._scheduler.schedule(this, scheduleItem);
	};

	module.exports = ScheduledDisposable;

/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var bindCallback = __webpack_require__(52);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function SomeObserver(o, fn, s) {
	  this._o = o;
	  this._fn = fn;
	  this._s = s;
	  this._i = 0;
	  AbstractObserver.call(this);
	}

	inherits(SomeObserver, AbstractObserver);

	SomeObserver.prototype.next = function (x) {
	  var result = tryCatch(this._fn)(x, this._i++, this._s);
	  if (result === global._Rx.errorObj) {
	    return this._o.onError(result.e);
	  }
	  if (Boolean(result)) {
	    this._o.onNext(true);
	    this._o.onCompleted();
	  }
	};
	SomeObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	SomeObserver.prototype.completed = function () {
	  this._o.onNext(false);
	  this._o.onCompleted();
	};

	function SomeObservable(source, fn) {
	  this.source = source;
	  this._fn = fn;
	  ObservableBase.call(this);
	}

	inherits(SomeObservable, ObservableBase);

	SomeObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new SomeObserver(o, this._fn, this.source));
	};

	module.exports = function some(source, predicate, thisArg) {
	  var fn = bindCallback(predicate, thisArg, 3);
	  return new SomeObservable(source, fn);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 227 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var bindCallback = __webpack_require__(52);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function SumObserver(o, fn, s) {
	  this._o = o;
	  this._fn = fn;
	  this._s = s;
	  this._i = 0;
	  this._c = 0;
	  AbstractObserver.call(this);
	}

	inherits(SumObserver, AbstractObserver);

	SumObserver.prototype.next = function (x) {
	  if (this._fn) {
	    var result = tryCatch(this._fn)(x, this._i++, this._s);
	    if (result === global._Rx.errorObj) {
	      return this._o.onError(result.e);
	    }
	    this._c += result;
	  } else {
	    this._c += x;
	  }
	};
	SumObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	SumObserver.prototype.completed = function () {
	  this._o.onNext(this._c);
	  this._o.onCompleted();
	};

	function SumObservable(source, fn) {
	  this.source = source;
	  this._fn = fn;
	  ObservableBase.call(this);
	}

	inherits(SumObservable, ObservableBase);

	SumObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new SumObserver(o, this._fn, this.source));
	};

	module.exports = function sum(source, keySelector, thisArg) {
	  var fn = bindCallback(keySelector, thisArg, 3);
	  return new SumObservable(source, fn);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var CompositeDisposable = __webpack_require__(18);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var inherits = __webpack_require__(6);

	function InnerObserver(state, inner) {
	  this._s = state;
	  this._i = inner;
	  AbstractObserver.call(this);
	}

	inherits(InnerObserver, AbstractObserver);

	InnerObserver.prototype.next = function (x) {
	  this._s.o.onNext(x);
	};
	InnerObserver.prototype.error = function (e) {
	  this._s.o.onError(e);
	};
	InnerObserver.prototype.completed = function () {
	  this._s.g.remove(this._i);
	  this._s.hasCurrent = false;
	  this._s.isStopped && this._s.g.length === 1 && this._s.o.onCompleted();
	};

	function SwitchFirstObserver(state) {
	  this._s = state;
	  AbstractObserver.call(this);
	}

	inherits(SwitchFirstObserver, AbstractObserver);

	SwitchFirstObserver.prototype.next = function (x) {
	  if (!this._s.hasCurrent) {
	    this._s.hasCurrent = true;
	    isPromise(x) && (x = fromPromise(x));
	    var inner = new SingleAssignmentDisposable();
	    this._s.g.add(inner);
	    inner.setDisposable(x.subscribe(new InnerObserver(this._s, inner)));
	  }
	};

	SwitchFirstObserver.prototype.error = function (e) {
	  this._s.o.onError(e);
	};

	SwitchFirstObserver.prototype.completed = function () {
	  this._s.isStopped = true;
	  !this._s.hasCurrent && this._s.g.length === 1 && this._s.o.onCompleted();
	};

	function SwitchFirstObservable(source) {
	  this.source = source;
	  ObservableBase.call(this);
	}

	inherits(SwitchFirstObservable, ObservableBase);

	SwitchFirstObservable.prototype.subscribeCore = function (o) {
	  var m = new SingleAssignmentDisposable(),
	      g = new CompositeDisposable(),
	      state = {
	    hasCurrent: false,
	    isStopped: false,
	    o: o,
	    g: g
	  };

	  g.add(m);
	  m.setDisposable(this.source.subscribe(new SwitchFirstObserver(state)));
	  return g;
	};

	/**
	 * Performs a exclusive waiting for the first to finish before subscribing to another observable.
	 * Observables that come in between subscriptions will be dropped on the floor.
	 * @returns {Observable} A exclusive observable with only the results that happen when subscribed.
	 */
	module.exports = function switchFirst(source) {
	  return new SwitchFirstObservable(source);
	};

/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var inherits = __webpack_require__(6);

	function TakeLastBufferObserver(o, c) {
	  this._o = o;
	  this._c = c;
	  this._q = [];
	  AbstractObserver.call(this);
	}

	inherits(TakeLastBufferObserver, AbstractObserver);

	TakeLastBufferObserver.prototype.next = function (x) {
	  this._q.push(x);
	  this._q.length > this._c && this._q.shift();
	};

	TakeLastBufferObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};

	TakeLastBufferObserver.prototype.completed = function () {
	  this._o.onNext(this._q);
	  this._o.onCompleted();
	};

	function TakeLastBufferObservable(source, count) {
	  this.source = source;
	  this._c = count;
	  ObservableBase.call(this);
	}

	inherits(TakeLastBufferObservable, ObservableBase);

	TakeLastBufferObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new TakeLastBufferObserver(o, this._c));
	};

	module.exports = function takeLastBuffer(source, count) {
	  count < 0 && (count = 0);
	  return new TakeLastBufferObservable(source, count);
	};

/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var isScheduler = __webpack_require__(17).isScheduler;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function TakeLastBufferWithTimeObserver(o, d, s) {
	  this._o = o;
	  this._d = d;
	  this._s = s;
	  this._q = [];
	  AbstractObserver.call(this);
	}

	inherits(TakeLastBufferWithTimeObserver, AbstractObserver);

	TakeLastBufferWithTimeObserver.prototype.next = function (x) {
	  var now = this._s.now();
	  this._q.push({ interval: now, value: x });
	  while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
	    this._q.shift();
	  }
	};

	TakeLastBufferWithTimeObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};

	TakeLastBufferWithTimeObserver.prototype.completed = function () {
	  var now = this._s.now(),
	      res = [];
	  while (this._q.length > 0) {
	    var next = this._q.shift();
	    now - next.interval <= this._d && res.push(next.value);
	  }
	  this._o.onNext(res);
	  this._o.onCompleted();
	};

	function TakeLastBufferWithTimeObservable(source, duration, scheduler) {
	  this.source = source;
	  this._d = duration;
	  this._s = scheduler;
	  ObservableBase.call(this);
	}

	inherits(TakeLastBufferWithTimeObservable, ObservableBase);

	TakeLastBufferWithTimeObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new TakeLastBufferWithTimeObserver(o, this._d, this._s));
	};

	module.exports = function takeLastBufferWithTime(source, duration, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  return new TakeLastBufferWithTimeObservable(source, duration, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 231 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var isScheduler = __webpack_require__(17).isScheduler;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function TakeLastWithTimeObserver(o, d, s) {
	  this._o = o;
	  this._d = d;
	  this._s = s;
	  this._q = [];
	  AbstractObserver.call(this);
	}

	inherits(TakeLastWithTimeObserver, AbstractObserver);

	TakeLastWithTimeObserver.prototype.next = function (x) {
	  var now = this._s.now();
	  this._q.push({ interval: now, value: x });
	  while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
	    this._q.shift();
	  }
	};
	TakeLastWithTimeObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	TakeLastWithTimeObserver.prototype.completed = function () {
	  var now = this._s.now();
	  while (this._q.length > 0) {
	    var next = this._q.shift();
	    if (now - next.interval <= this._d) {
	      this._o.onNext(next.value);
	    }
	  }
	  this._o.onCompleted();
	};

	function TakeLastWithTimeObservable(source, d, s) {
	  this.source = source;
	  this._d = d;
	  this._s = s;
	  ObservableBase.call(this);
	}

	inherits(TakeLastWithTimeObservable, ObservableBase);

	TakeLastWithTimeObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new TakeLastWithTimeObserver(o, this._d, this._s));
	};

	module.exports = function takeLastWithTime(source, duration, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  return new TakeLastWithTimeObservable(source, duration, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 232 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var BinaryDisposable = __webpack_require__(23);
	var isPromise = __webpack_require__(27);
	var fromPromise = __webpack_require__(24);
	var noop = __webpack_require__(3);
	var inherits = __webpack_require__(6);

	function TakeUntilObserver(o) {
	  this._o = o;
	  AbstractObserver.call(this);
	}

	inherits(TakeUntilObserver, AbstractObserver);

	TakeUntilObserver.prototype.next = function () {
	  this._o.onCompleted();
	};
	TakeUntilObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	TakeUntilObserver.prototype.onCompleted = noop;

	function TakeUntilObservable(source, other) {
	  this.source = source;
	  this._other = isPromise(other) ? fromPromise(other) : other;
	  ObservableBase.call(this);
	}

	inherits(TakeUntilObservable, ObservableBase);

	TakeUntilObservable.prototype.subscribeCore = function (o) {
	  return new BinaryDisposable(this.source.subscribe(o), this._other.subscribe(new TakeUntilObserver(o)));
	};

	/**
	 * Returns the values from the source observable sequence until the other observable sequence produces a value.
	 * @param {Observable | Promise} other Observable sequence or Promise that terminates propagation of elements of the source sequence.
	 * @returns {Observable} An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.
	 */
	module.exports = function takeUntil(source, other) {
	  return new TakeUntilObservable(source, other);
	};

/***/ },
/* 233 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var BinaryDisposable = __webpack_require__(23);
	var isScheduler = __webpack_require__(17).isScheduler;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function TakeUntilWithTimeObservable(source, end, scheduler) {
	  this.source = source;
	  this._e = end;
	  this._s = scheduler;
	  ObservableBase.call(this);
	}

	inherits(TakeUntilWithTimeObservable, ObservableBase);

	function scheduleMethod(s, o) {
	  o.onCompleted();
	}

	TakeUntilWithTimeObservable.prototype.subscribeCore = function (o) {
	  return new BinaryDisposable(this._s.scheduleFuture(o, this._e, scheduleMethod), this.source.subscribe(o));
	};

	module.exports = function takeUntilWithTime(source, endTime, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  return new TakeUntilWithTimeObservable(source, endTime, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 234 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var bindCallback = __webpack_require__(52);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function TakeWhileObserver(o, p) {
	  this._o = o;
	  this._p = p;
	  this._i = 0;
	  this._r = true;
	  AbstractObserver.call(this);
	}

	inherits(TakeWhileObserver, AbstractObserver);

	TakeWhileObserver.prototype.next = function (x) {
	  if (this._r) {
	    this._r = tryCatch(this._p._fn)(x, this._i++, this._p);
	    if (this._r === global._Rx.errorObj) {
	      return this._o.onError(this._r.e);
	    }
	  }
	  if (this._r) {
	    this._o.onNext(x);
	  } else {
	    this._o.onCompleted();
	  }
	};
	TakeWhileObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	TakeWhileObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function TakeWhileObservable(source, fn) {
	  this.source = source;
	  this._fn = fn;
	  ObservableBase.call(this);
	}

	inherits(TakeWhileObservable, ObservableBase);

	TakeWhileObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new TakeWhileObserver(o, this));
	};

	module.exports = function takeWhile(source, predicate, thisArg) {
	  var fn = bindCallback(predicate, thisArg, 3);
	  return new TakeWhileObservable(source, fn);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 235 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Pattern = __webpack_require__(138);

	module.exports = function thenDo(source, selector) {
	  return new Pattern([source]).thenDo(selector);
	};

/***/ },
/* 236 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var isScheduler = __webpack_require__(17).isScheduler;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function ThrottleObserver(s) {
	  this._s = s;
	  AbstractObserver.call(this);
	}

	inherits(ThrottleObserver, AbstractObserver);

	ThrottleObserver.prototype.next = function (x) {
	  var now = this._s.scheduler.now();
	  if (this._s.lastOnNext === 0 || now - this._s.lastOnNext >= this._s.duration) {
	    this._s.lastOnNext = now;
	    this._s.o.onNext(x);
	  }
	};
	ThrottleObserver.prototype.error = function (e) {
	  this._s.o.onError(e);
	};
	ThrottleObserver.prototype.completed = function () {
	  this._s.o.onCompleted();
	};

	function ThrottleObservable(source, duration, scheduler) {
	  this.source = source;
	  this._duration = duration;
	  this._scheduler = scheduler;
	  ObservableBase.call(this);
	}

	inherits(ThrottleObservable, ObservableBase);

	ThrottleObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new ThrottleObserver({
	    o: o,
	    duration: this._duration,
	    scheduler: this._scheduler,
	    lastOnNext: 0
	  }));
	};

	module.exports = function throttle(source, windowDuration, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  var duration = +windowDuration || 0;
	  if (duration <= 0) {
	    throw new RangeError('windowDuration cannot be less or equal zero.');
	  }
	  return new ThrottleObservable(source, duration, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 237 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var isScheduler = __webpack_require__(17).isScheduler;
	var inherits = __webpack_require__(6);

	global._Rx || (global._Rx = {});
	if (!global._Rx.defaultScheduler) {
	  __webpack_require__(25);
	}

	function TimeIntervalObserver(o, s) {
	  this._o = o;
	  this._s = s;
	  this._l = s.now();
	  AbstractObserver.call(this);
	}

	inherits(TimeIntervalObserver, AbstractObserver);

	TimeIntervalObserver.prototype.next = function (x) {
	  var now = this._s.now(),
	      span = now - this._l;
	  this._l = now;
	  this._o.onNext({ value: x, interval: span });
	};
	TimeIntervalObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	TimeIntervalObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function TimeIntervalObservable(source, s) {
	  this.source = source;
	  this._s = s;
	  ObservableBase.call(this);
	}

	inherits(TimeIntervalObservable, ObservableBase);

	TimeIntervalObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new TimeIntervalObserver(o, this._s));
	};

	module.exports = function timeInterval(source, scheduler) {
	  isScheduler(scheduler) || (scheduler = global._Rx.defaultScheduler);
	  return new TimeIntervalObservable(source, scheduler);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 238 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AbstractObserver = __webpack_require__(5);
	var ObservableBase = __webpack_require__(11);
	var inherits = __webpack_require__(6);

	function ToArrayObserver(o) {
	  this.o = o;
	  this.a = [];
	  AbstractObserver.call(this);
	}

	inherits(ToArrayObserver, AbstractObserver);

	ToArrayObserver.prototype.next = function (x) {
	  this.a.push(x);
	};
	ToArrayObserver.prototype.error = function (e) {
	  this.o.onError(e);
	};
	ToArrayObserver.prototype.completed = function () {
	  this.o.onNext(this.a);this.o.onCompleted();
	};

	function ToArrayObservable(source) {
	  this.source = source;
	  ObservableBase.call(this);
	}

	inherits(ToArrayObservable, ObservableBase);

	ToArrayObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new ToArrayObserver(o));
	};

	/**
	* Creates an array from an observable sequence.
	* @returns {Observable} An observable sequence containing a single element with a list containing all the elements of the source sequence.
	*/
	module.exports = function toArray(o) {
	  return new ToArrayObservable(o);
	};

/***/ },
/* 239 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function ToMapObserver(o, k, e) {
	  this._o = o;
	  this._k = k;
	  this._e = e;
	  this._m = new global.Map();
	  AbstractObserver.call(this);
	}

	inherits(ToMapObserver, AbstractObserver);

	ToMapObserver.prototype.next = function (x) {
	  var key = tryCatch(this._k)(x);
	  if (key === global._Rx.errorObj) {
	    return this._o.onError(key.e);
	  }
	  var elem = x;
	  if (this._e) {
	    elem = tryCatch(this._e)(x);
	    if (elem === global._Rx.errorObj) {
	      return this._o.onError(elem.e);
	    }
	  }

	  this._m.set(key, elem);
	};

	ToMapObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};

	ToMapObserver.prototype.completed = function () {
	  this._o.onNext(this._m);
	  this._o.onCompleted();
	};

	function ToMapObservable(source, k, e) {
	  this.source = source;
	  this._k = k;
	  this._e = e;
	  ObservableBase.call(this);
	}

	inherits(ToMapObservable, ObservableBase);

	ToMapObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new ToMapObserver(o, this._k, this._e));
	};

	module.exports = function toMap(source, keySelector, elementSelector) {
	  if (typeof global.Map === 'undefined') {
	    throw new TypeError();
	  }
	  return new ToMapObservable(source, keySelector, elementSelector);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 240 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	module.exports = function toPromise(source, promiseCtor) {
	  promiseCtor || (promiseCtor = global.Promise);
	  return new promiseCtor(function (resolve, reject) {
	    // No cancellation can be done
	    var value;
	    source.subscribe(function (v) {
	      value = v;
	    }, reject, function () {
	      resolve(value);
	    });
	  });
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 241 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var inherits = __webpack_require__(6);

	function ToSetObserver(o) {
	  this._o = o;
	  this._s = new global.Set();
	  AbstractObserver.call(this);
	}

	inherits(ToSetObserver, AbstractObserver);

	ToSetObserver.prototype.next = function (x) {
	  this._s.add(x);
	};
	ToSetObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	ToSetObserver.prototype.completed = function () {
	  this._o.onNext(this._s);
	  this._o.onCompleted();
	};

	function ToSetObservable(source) {
	  this.source = source;
	  ObservableBase.call(this);
	}

	inherits(ToSetObservable, ObservableBase);

	ToSetObservable.prototype.subscribeCore = function (o) {
	  return this.source.subscribe(new ToSetObserver(o));
	};

	module.exports = function toSet(source) {
	  if (typeof global.Set === 'undefined') {
	    throw new TypeError();
	  }
	  return new ToSetObservable(source);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 242 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var tryCatch = __webpack_require__(15).tryCatch;
	var inherits = __webpack_require__(6);

	function TransduceObserver(o, xform) {
	  this._o = o;
	  this._xform = xform;
	  AbstractObserver.call(this);
	}

	inherits(TransduceObserver, AbstractObserver);

	TransduceObserver.prototype.next = function (x) {
	  var res = tryCatch(this._xform['@@transducer/step']).call(this._xform, this._o, x);
	  if (res === global._Rx.errorObj) {
	    this._o.onError(res.e);
	  }
	};

	TransduceObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};

	TransduceObserver.prototype.completed = function () {
	  this._xform['@@transducer/result'](this._o);
	};

	function transformForObserver(o) {
	  return {
	    '@@transducer/init': function () {
	      return o;
	    },
	    '@@transducer/step': function (obs, input) {
	      return obs.onNext(input);
	    },
	    '@@transducer/result': function (obs) {
	      return obs.onCompleted();
	    }
	  };
	}

	function TransduceObservable(source, transducer) {
	  this.source = source;
	  this._transducer = transducer;
	  ObservableBase.call(this);
	}

	inherits(TransduceObservable, ObservableBase);

	TransduceObservable.prototype.subscribeCore = function (o) {
	  var xform = this._transducer(transformForObserver(o));
	  return this.source.subscribe(new TransduceObserver(o, xform));
	};

	module.exports = function transduce(source, transducer) {
	  return new TransduceObservable(source, transducer);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 243 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var AbstractObserver = __webpack_require__(5);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var NAryDisposable = __webpack_require__(43);
	var fromPromise = __webpack_require__(24);
	var isPromise = __webpack_require__(27);
	var identity = __webpack_require__(46);
	var noop = __webpack_require__(3);
	var isFunction = __webpack_require__(9);
	var inherits = __webpack_require__(6);
	var tryCatch = __webpack_require__(15).tryCatch;

	function falseFactory() {
	  return false;
	}
	function initializeArray(n, fn) {
	  var results = new Array(n);
	  for (var i = 0; i < n; i++) {
	    results[i] = fn(i);
	  }
	  return results;
	}
	function argumentsToArray() {
	  var len = arguments.length,
	      args = new Array(len);
	  for (var i = 0; i < len; i++) {
	    args[i] = arguments[i];
	  }
	  return args;
	}

	function WithLatestFromOtherObserver(o, i, state) {
	  this._o = o;
	  this._i = i;
	  this._state = state;
	  AbstractObserver.call(this);
	}

	inherits(WithLatestFromOtherObserver, AbstractObserver);

	WithLatestFromOtherObserver.prototype.next = function (x) {
	  this._state.values[this._i] = x;
	  this._state.hasValue[this._i] = true;
	  this._state.hasValueAll = this._state.hasValue.every(identity);
	};

	WithLatestFromOtherObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	WithLatestFromOtherObserver.prototype.completed = noop;

	function WithLatestFromSourceObserver(o, cb, state) {
	  this._o = o;
	  this._cb = cb;
	  this._state = state;
	  AbstractObserver.call(this);
	}

	inherits(WithLatestFromSourceObserver, AbstractObserver);

	WithLatestFromSourceObserver.prototype.next = function (x) {
	  var allValues = [x].concat(this._state.values);
	  if (!this._state.hasValueAll) {
	    return;
	  }
	  var res = tryCatch(this._cb).apply(null, allValues);
	  if (res === global._Rx.errorObj) {
	    return this._o.onError(res.e);
	  }
	  this._o.onNext(res);
	};

	WithLatestFromSourceObserver.prototype.error = function (e) {
	  this._o.onError(e);
	};
	WithLatestFromSourceObserver.prototype.completed = function () {
	  this._o.onCompleted();
	};

	function WithLatestFromObservable(source, sources, resultSelector) {
	  this._s = source;
	  this._ss = sources;
	  this._cb = resultSelector;
	  ObservableBase.call(this);
	}

	inherits(WithLatestFromObservable, ObservableBase);

	WithLatestFromObservable.prototype.subscribeCore = function (o) {
	  var len = this._ss.length;
	  var state = {
	    hasValue: initializeArray(len, falseFactory),
	    hasValueAll: false,
	    values: new Array(len)
	  };

	  var n = this._ss.length,
	      subscriptions = new Array(n + 1);
	  for (var i = 0; i < n; i++) {
	    var other = this._ss[i],
	        sad = new SingleAssignmentDisposable();
	    isPromise(other) && (other = fromPromise(other));
	    sad.setDisposable(other.subscribe(new WithLatestFromOtherObserver(o, i, state)));
	    subscriptions[i] = sad;
	  }

	  var outerSad = new SingleAssignmentDisposable();
	  outerSad.setDisposable(this._s.subscribe(new WithLatestFromSourceObserver(o, this._cb, state)));
	  subscriptions[n] = outerSad;

	  return new NAryDisposable(subscriptions);
	};

	/**
	 * Merges the specified observable sequences into one observable sequence by using the selector function only when the (first) source observable sequence produces an element.
	 * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	 */
	module.exports = function withLatestFrom() {
	  var len = arguments.length,
	      args = new Array(len);
	  for (var i = 0; i < len; i++) {
	    args[i] = arguments[i];
	  }
	  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;

	  return new WithLatestFromObservable(args[0], args.slice(1), resultSelector);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 244 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var ObservableBase = __webpack_require__(11);
	var observableFrom = __webpack_require__(50);
	var AbstractObserver = __webpack_require__(5);
	var SingleAssignmentDisposable = __webpack_require__(14);
	var NAryDisposable = __webpack_require__(43);
	var identity = __webpack_require__(46);
	var isFunction = __webpack_require__(9);
	var isArrayLike = __webpack_require__(148);
	var isIterable = __webpack_require__(149);
	var inherits = __webpack_require__(6);
	var tryCatch = __webpack_require__(15).tryCatch;

	function falseFactory() {
	  return false;
	}
	function emptyArrayFactory() {
	  return [];
	}
	function initializeArray(n, fn) {
	  var results = new Array(n);
	  for (var i = 0; i < n; i++) {
	    results[i] = fn(i);
	  }
	  return results;
	}
	function argumentsToArray() {
	  var len = arguments.length,
	      args = new Array(len);
	  for (var i = 0; i < len; i++) {
	    args[i] = arguments[i];
	  }
	  return args;
	}

	function ZipIterableObserver(s, i) {
	  this._s = s;
	  this._i = i;
	  AbstractObserver.call(this);
	}

	inherits(ZipIterableObserver, AbstractObserver);

	function notEmpty(x) {
	  return x.length > 0;
	}
	function shiftEach(x) {
	  return x.shift();
	}
	function notTheSame(i) {
	  return function (x, j) {
	    return j !== i;
	  };
	}

	ZipIterableObserver.prototype.next = function (x) {
	  this._s.q[this._i].push(x);
	  if (this._s.q.every(notEmpty)) {
	    var queuedValues = this._s.q.map(shiftEach),
	        res = tryCatch(this._s.cb).apply(null, queuedValues);
	    if (res === global._Rx.errorObj) {
	      return this._s.o.onError(res.e);
	    }
	    this._s.o.onNext(res);
	  } else if (this._s.done.filter(notTheSame(this._i)).every(identity)) {
	    this._s.o.onCompleted();
	  }
	};

	ZipIterableObserver.prototype.error = function (e) {
	  this._s.o.onError(e);
	};

	ZipIterableObserver.prototype.completed = function () {
	  this._s.done[this._i] = true;
	  this._s.done.every(identity) && this._s.o.onCompleted();
	};

	function ZipIterableObservable(sources, cb) {
	  this._sources = sources;
	  this._cb = cb;
	  ObservableBase.call(this);
	}

	inherits(ZipIterableObservable, ObservableBase);

	ZipIterableObservable.prototype.subscribeCore = function (o) {
	  var sources = this._sources,
	      len = sources.length,
	      subscriptions = new Array(len);

	  var state = {
	    q: initializeArray(len, emptyArrayFactory),
	    done: initializeArray(len, falseFactory),
	    cb: this._cb,
	    o: o
	  };

	  for (var i = 0; i < len; i++) {
	    (function (i) {
	      var source = sources[i],
	          sad = new SingleAssignmentDisposable();
	      (isArrayLike(source) || isIterable(source)) && (source = observableFrom(source));
	      subscriptions[i] = sad;
	      sad.setDisposable(source.subscribe(new ZipIterableObserver(state, i)));
	    })(i);
	  }

	  return new NAryDisposable(subscriptions);
	};

	/**
	 * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
	 * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
	 * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
	 */
	module.exports = function zipIterable() {
	  var len = arguments.length,
	      args = new Array(len);
	  for (var i = 0; i < len; i++) {
	    args[i] = arguments[i];
	  }
	  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	  return new ZipIterableObservable(args, resultSelector);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 245 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Observable = __webpack_require__(8);
	var Observer = __webpack_require__(1);
	var addProperties = __webpack_require__(32);
	var inherits = __webpack_require__(6);

	function AnonymousSubject(observer, observable) {
	  this.observer = observer;
	  this.observable = observable;
	  Observable.call(this);
	}

	inherits(AnonymousSubject, Observable);

	addProperties(AnonymousSubject.prototype, Observer.prototype, {
	  _subscribe: function (o) {
	    return this.observable.subscribe(o);
	  },
	  onCompleted: function () {
	    this.observer.onCompleted();
	  },
	  onError: function (error) {
	    this.observer.onError(error);
	  },
	  onNext: function (value) {
	    this.observer.onNext(value);
	  }
	});

	/**
	 * Creates a subject from the specified observer and observable.
	 * @param {Observer} observer The observer used to send messages to the subject.
	 * @param {Observable} observable The observable used to subscribe to messages sent from the subject.
	 * @returns {Subject} Subject implemented using the given observer and observable.
	 */
	module.exports = function create(observer, observable) {
	  return new AnonymousSubject(observer, observable);
	};

/***/ }
/******/ ])
});
;