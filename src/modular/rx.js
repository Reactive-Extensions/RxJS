'use strict';

var Observer = require('./observer');

Observer.addToObject({
  create: require('./observer/create')
});

var Observable = require('./observable');

Observable.addToObject({
  amb: require('./observable/amb'),
  bindCallback: require('./observable/bindcallback'),
  bindNodeCallback: require('./observable/bindnodecallback'),
  catch: require('./observable/catch'),
  concat: require('./observable/concat'),
  create: require('./observable/create'),
  defer: require('./observable/defer'),
  empty: require('./observable/empty'),
  from: require('./observable/from'),
  fromArray: require('./observable/fromarray'),
  fromEvent: require('./observable/fromevent'),
  fromEventPattern: require('./observable/fromeventpattern'),
  fromPromise: require('./observable/frompromise'),
  generate: require('./observable/generate'),
  just: require('./observable/just'),
  merge: require('./observable/merge'),
  mergeDelayError: require('./observable/mergedelayerror'),
  never: require('./observable/never'),
  of: require('./observable/of'),
  ofScheduled: require('./observable/ofscheduled'),
  onErrorResumeNext: require('./observable/onerrorresumenext'),
  range: require('./observable/range'),
  throw: require('./observable/throw'),
  zip: require('./observable/zip')
});

Observable.addToPrototype({
  amb: require('./observable/amb'),
  catch: require('./observable/catch'),
  combineLatest: require('./observable/combinelatest'),
  concat: require('./observable/concat'),
  concatAll: require('./observable/concatall'),
  distinctUntilChanged: require('./observable/distinctuntilchanged'),
  filter: require('./observable/filter'),
  finally: require('./observable/finally'),
  flatMap: require('./observable/flatmap'),
  flatMapLatest: require('./observable/flatmaplatest'),
  map: require('./observable/map'),
  merge: require('./observable/merge'),
  mergeAll: require('./observable/mergeall'),
  onErrorResumeNext: require('./observable/onerrorresumenext'),
  scan: require('./observable/scan'),
  skip: require('./observable/skip'),
  skipUntil: require('./observable/skipuntil'),
  switch: require('./observable/switch'),
  take: require('./observable/take'),
  takeUntil: require('./observable/takeuntil'),
  tap: require('./observable/tap'),
  toArray: require('./observable/toarray'),
  zip: require('./observable/zip')
});

var Rx = {
  BinaryDisposable: require('./binarydisposable'),
  CompositeDisposable: require('./compositedisposable'),
  Disposable: require('./disposable'),
  NAryDisposable: require('./narydisposable'),
  SerialDisposable: require('./serialdisposable'),
  SingleAssignmentDisposable: require('./singleassignmentdisposable'),

  Scheduler: require('./scheduler'),

  Observer: Observer,
  Observable: Observable,

  AsyncSubject: require('./asyncsubject'),
  BehaviorSubject: require('./behaviorsubject'),
  ReplaySubject: require('./replaysubject'),
  Subject: require('./subject')
};

module.exports = Rx;
