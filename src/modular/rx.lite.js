'use strict';

var Observer = require('./observer');

Observer.addToObject({
  create: require('./observer/create')
});

var Observable = require('./observable');

Observable.addToObject({
  bindCallback: require('./observable/bindcallback'),
  bindNodeCallback: require('./observable/bindnodecallback'),
  catch: require('./observable/catch'),
  concat: require('./observable/concat'),
  create: require('./observable/create'),
  empty: require('./observable/empty'),
  from: require('./observable/from'),
  fromArray: require('./observable/fromarray'),
  fromEvent: require('./observable/fromevent'),
  fromEventPattern: require('./observable/fromeventpattern'),
  fromPromise: require('./observable/frompromise'),
  interval: require('./observable/interval'),
  just: require('./observable/just'),
  merge: require('./observable/merge'),
  never: require('./observable/never'),
  of: require('./observable/of'),
  range: require('./observable/range'),
  throw: require('./observable/throw'),
  using: require('./observable/using'),
  zip: require('./observable/zip')
});

Observable.addToPrototype({
  catch: require('./observable/catch'),
  combineLatest: require('./observable/combinelatest'),
  concat: require('./observable/concat'),
  concatAll: require('./observable/concatall'),
  debounce: require('./observable/debounce'),
  distinctUntilChanged: require('./observable/distinctuntilchanged'),
  do: require('./observable/tap'),
  filter: require('./observable/filter'),
  finally: require('./observable/finally'),
  flatMap: require('./observable/flatmap'),
  flatMapLatest: require('./observable/flatmaplatest'),
  map: require('./observable/map'),
  merge: require('./observable/merge'),
  mergeAll: require('./observable/mergeall'),
  multicast: require('./observable/multicast'),
  pluck: require('./observable/pluck'),
  publish: require('./observable/publish'),
  publishLast: require('./observable/publishlast'),
  publishValue: require('./observable/publishvalue'),
  replay: require('./observable/replay'),
  scan: require('./observable/scan'),
  share: require('./observable/share'),
  shareReplay: require('./observable/sharereplay'),
  shareValue: require('./observable/sharevalue'),
  skip: require('./observable/skip'),
  skipUntil: require('./observable/skipuntil'),
  switch: require('./observable/switch'),
  take: require('./observable/take'),
  takeUntil: require('./observable/takeuntil'),
  tap: require('./observable/tap'),
  toArray: require('./observable/toarray'),
  toPromise: require('./observable/topromise'),
  zip: require('./observable/zip')
});

// RxJS V4 aliases
Observable.prototype.selectMany = Observable.prototype.flatMap;
Observable.prototype.select = Observable.prototype.map;
Observable.prototype.where = Observable.prototype.filter;

// RxJS V5 aliases
Observable.prototype.mergeMap = Observable.prototype.flatMap;
Observable.prototype.switchMap = Observable.prototype.flatMapLatest;
Observable.prototype.publishReplay = Observable.prototype.replay;
Observable.fromCallback = Observable.bindCallback;
Observable.fromNodeCallback = Observable.bindNodeCallback;

var Subject = require('./subject');
Subject.addToObject({
  create: require('./subject/create')
});


var Rx = {
  // Disposables
  BinaryDisposable: require('./binarydisposable'),
  CompositeDisposable: require('./compositedisposable'),
  Disposable: require('./disposable'),
  NAryDisposable: require('./narydisposable'),
  SerialDisposable: require('./serialdisposable'),
  SingleAssignmentDisposable: require('./singleassignmentdisposable'),

  // Scheduler
  Scheduler: require('./scheduler'),

  // Core
  Observer: Observer,
  Observable: Observable,

  // Subjects
  AsyncSubject: require('./asyncsubject'),
  BehaviorSubject: require('./behaviorsubject'),
  ReplaySubject: require('./replaysubject'),
  Subject: Subject
};

module.exports = Rx;
