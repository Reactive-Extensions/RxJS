module.exports = function (grunt) {

var browsers = [{
      browserName: 'firefox',
      version: '19',
      platform: 'XP'
  }, {
      browserName: 'chrome',
      platform: 'XP'
  }, {
      browserName: 'chrome',
      platform: 'linux'
  }, {
      browserName: 'internet explorer',
      platform: 'WIN8',
      version: '10'
  }, {
      browserName: 'internet explorer',
      platform: 'VISTA',
      version: '9'
  }, {
      browserName: 'opera',
      platform: 'Windows 2008',
      version: '12'
  }];

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      meta: {
          banner:
              '/*'+
              'Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.\r\n' +
              'Microsoft Open Technologies would like to thank its contributors, a list.\r\n' +
              'of whom are at http://aspnetwebstack.codeplex.com/wikipage?title=Contributors..\r\n' +
              'Licensed under the Apache License, Version 2.0 (the "License"); you.\r\n' +
              'may not use this file except in compliance with the License. You may.\r\n' +
              'obtain a copy of the License at.\r\n\r\n' +
              'http://www.apache.org/licenses/LICENSE-2.0.\r\n\r\n' +
              'Unless required by applicable law or agreed to in writing, software.\r\n' +
              'distributed under the License is distributed on an "AS IS" BASIS,.\r\n' +
              'WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or.\r\n' +
              'implied. See the License for the specific language governing permissions.\r\n' +
              'and limitations under the License..\r\n' +
              '*/'
      },
      concat: {
          core: {
            src: [
              'src/core/license.js',
              'src/core/intro.js',
              'src/core/basicheader-modern.js',
              'src/core/enumeratorheader.js',

              'src/core/internal/isequal.js',
              'src/core/internal/util.js',
              'src/core/internal/priorityqueue.js',
              'src/core/disposables/compositedisposable.js',
              'src/core/disposables/disposable.js',
              'src/core/disposables/booleandisposable.js',
              'src/core/disposables/singleassignmentdisposable.js',
              'src/core/disposables/serialdisposable.js',
              'src/core/disposables/refcountdisposable.js',
              'src/core/disposables/scheduleddisposable.js',
              'src/core/concurrency/scheduleditem.js',
              'src/core/concurrency/scheduler.js',
              'src/core/concurrency/scheduleperiodicrecursive.js',
              'src/core/concurrency/immediatescheduler.js',
              'src/core/concurrency/currentthreadscheduler.js',
              'src/core/concurrency/timeoutscheduler.js',
              'src/core/concurrency/catchscheduler.js',
              'src/core/notification.js',
              'src/core/internal/enumerator.js',
              'src/core/internal/enumerable.js',
              'src/core/observer.js',
              'src/core/abstractobserver.js',
              'src/core/anonymousobserver.js',
              'src/core/checkedobserver.js',
              'src/core/scheduledobserver.js',
              'src/core/observeonobserver.js',
              'src/core/observable.js',

              'src/core/anonymousobservable.js',
              'src/core/autodetachobserver.js',
              'src/core/linq/groupedobservable.js',
              'src/core/subjects/innersubscription.js',
              'src/core/subjects/subject.js',
              'src/core/subjects/asyncsubject.js',
              'src/core/subjects/anonymoussubject.js',
              'src/core/exports.js',
              'src/core/outro.js'            
            ],
            dest: 'dist/rx.core.js'
          },
          corecompat: {
            src: [
              'src/core/license.js',
              'src/core/intro.js',
              'src/core/basicheader.js',
              'src/core/enumeratorheader.js',

              'src/core/internal/isequal.js',
              'src/core/internal/util.js',
              'src/core/internal/polyfills.js',
              'src/core/internal/priorityqueue.js',
              'src/core/disposables/compositedisposable.js',
              'src/core/disposables/disposable.js',
              'src/core/disposables/booleandisposable.js',
              'src/core/disposables/singleassignmentdisposable.js',
              'src/core/disposables/serialdisposable.js',
              'src/core/disposables/refcountdisposable.js',
              'src/core/disposables/scheduleddisposable.js',
              'src/core/concurrency/scheduleditem.js',
              'src/core/concurrency/scheduler.js',
              'src/core/concurrency/scheduleperiodicrecursive.js',
              'src/core/concurrency/immediatescheduler.js',
              'src/core/concurrency/currentthreadscheduler.js',
              'src/core/concurrency/timeoutscheduler.js',
              'src/core/concurrency/catchscheduler.js',
              'src/core/notification.js',
              'src/core/internal/enumerator.js',
              'src/core/internal/enumerable.js',
              'src/core/observer.js',
              'src/core/abstractobserver.js',
              'src/core/anonymousobserver.js',
              'src/core/checkedobserver.js',
              'src/core/scheduledobserver.js',
              'src/core/observeonobserver.js',
              'src/core/observable.js',            

              'src/core/anonymousobservable.js',
              'src/core/autodetachobserver.js',
              'src/core/linq/groupedobservable.js',
              'src/core/subjects/innersubscription.js',
              'src/core/subjects/subject.js',
              'src/core/subjects/asyncsubject.js',
              'src/core/subjects/anonymoussubject.js',
              'src/core/exports.js',
              'src/core/outro.js'            
            ],
            dest: 'dist/rx.core.compat.js'            
          },
          all: {
            src: [
              'src/core/license.js',
              'src/core/intro.js',
              'src/core/basicheader-modern.js',
              'src/core/enumeratorheader.js',

              'src/core/internal/isequal.js',
              'src/core/internal/util.js',
              'src/core/internal/priorityqueue.js',
              'src/core/disposables/compositedisposable.js',
              'src/core/disposables/disposable.js',
              'src/core/disposables/booleandisposable.js',
              'src/core/disposables/singleassignmentdisposable.js',
              'src/core/disposables/serialdisposable.js',
              'src/core/disposables/refcountdisposable.js',
              'src/core/disposables/scheduleddisposable.js',
              'src/core/concurrency/scheduleditem.js',
              'src/core/concurrency/scheduler.js',
              'src/core/concurrency/scheduleperiodicrecursive.js',
              'src/core/concurrency/immediatescheduler.js',
              'src/core/concurrency/currentthreadscheduler.js',
              'src/core/concurrency/timeoutscheduler.js',
              'src/core/concurrency/catchscheduler.js',
              'src/core/notification.js',
              'src/core/internal/enumerator.js',
              'src/core/internal/enumerable.js',
              'src/core/observer.js',
              'src/core/abstractobserver.js',
              'src/core/anonymousobserver.js',
              'src/core/checkedobserver.js',
              'src/core/scheduledobserver.js',
              'src/core/observeonobserver.js',
              'src/core/observable.js',

              // Concurrency
              'src/core/linq/observable/observeon.js', // ObserveOnObserver
              'src/core/linq/observable/subscribeon.js', // SingleAssignmentDisposable, SerialDisposable, ScheduleDisposable

              // Async
              'src/core/linq/observable/frompromise.js', // AsyncSubject, asObservable
              'src/core/linq/observable/topromise.js',    

              // Creation
              'src/core/linq/observable/toarray.js',
              'src/core/linq/observable/create.js',
              'src/core/linq/observable/defer.js',
              'src/core/linq/observable/empty.js',
              'src/core/linq/observable/fromarray.js',
              'src/core/linq/observable/fromiterable.js',
              'src/core/linq/observable/generate.js',
              'src/core/linq/observable/of.js',
              'src/core/linq/observable/never.js',
              'src/core/linq/observable/range.js',
              'src/core/linq/observable/repeat.js',
              'src/core/linq/observable/return.js',
              'src/core/linq/observable/throw.js',
              'src/core/linq/observable/using.js',

              // Multiple
              'src/core/linq/observable/ambproto.js',
              'src/core/linq/observable/amb.js',
              'src/core/linq/observable/catchproto.js',
              'src/core/linq/observable/catch.js',
              'src/core/linq/observable/combinelatestproto.js',
              'src/core/linq/observable/combinelatest.js',
              'src/core/linq/observable/concatproto.js',
              'src/core/linq/observable/concat.js',
              'src/core/linq/observable/concatobservable.js',
              'src/core/linq/observable/mergeproto.js',
              'src/core/linq/observable/merge.js',
              'src/core/linq/observable/mergeobservable.js',
              'src/core/linq/observable/onerrorresumenextproto.js',
              'src/core/linq/observable/onerrorresumenext.js',
              'src/core/linq/observable/skipuntil.js',
              'src/core/linq/observable/switch.js',
              'src/core/linq/observable/takeuntil.js',
              'src/core/linq/observable/zipproto.js',
              'src/core/linq/observable/zip.js',
              'src/core/linq/observable/ziparray.js',

              // Single
              'src/core/linq/observable/asobservable.js',
              'src/core/linq/observable/bufferwithcount.js',
              'src/core/linq/observable/dematerialize.js',
              'src/core/linq/observable/distinctuntilchanged.js',
              'src/core/linq/observable/do.js',
              'src/core/linq/observable/finally.js',
              'src/core/linq/observable/ignoreelements.js',
              'src/core/linq/observable/materialize.js',
              'src/core/linq/observable/repeatproto.js',
              'src/core/linq/observable/retry.js',
              'src/core/linq/observable/scan.js',
              'src/core/linq/observable/skiplast.js',
              'src/core/linq/observable/startwith.js',
              'src/core/linq/observable/takelast.js',
              'src/core/linq/observable/takelastbuffer.js',
              'src/core/linq/observable/windowwithcount.js',

              // Standard query operators
              'src/core/linq/observable/concatmap.js',
              'src/core/linq/observable/defaultifempty.js',
              'src/core/linq/observable/distinct.js',
              'src/core/linq/observable/groupby.js',
              'src/core/linq/observable/groupbyuntil.js',
              'src/core/linq/observable/select.js',
              'src/core/linq/observable/pluck.js',
              'src/core/linq/observable/selectmany.js',
              'src/core/linq/observable/selectswitch.js',
              'src/core/linq/observable/skip.js',
              'src/core/linq/observable/skipwhile.js',
              'src/core/linq/observable/take.js',
              'src/core/linq/observable/takewhile.js',
              'src/core/linq/observable/where.js',

              // Aggregate Operators
              'src/core/linq/observable/finalvalue.js',
              'src/core/linq/observable/_extremaby.js',
              'src/core/linq/observable/_firstonly.js',
              'src/core/linq/observable/aggregate.js', // scan, startwith, finalvalue
              'src/core/linq/observable/reduce.js', // scan, startwith, finalvalue
              'src/core/linq/observable/any.js',  // where
              'src/core/linq/observable/isempty.js', // any, select
              'src/core/linq/observable/all.js', // where, any
              'src/core/linq/observable/contains.js', // where, any
              'src/core/linq/observable/count.js', // where, aggregate
              'src/core/linq/observable/sum.js', // select, aggregate
              'src/core/linq/observable/minby.js', // _extremaby
              'src/core/linq/observable/min.js',   // minby, _firstonly
              'src/core/linq/observable/maxby.js', // _extremaby
              'src/core/linq/observable/max.js',   // max, _firstonly
              'src/core/linq/observable/average.js',   // select, scan, aggregate, finalvalue
              'src/core/linq/observable/sequenceequal.js',   // compositedisposable
              'src/core/linq/observable/_elementatordefault.js',
              'src/core/linq/observable/elementat.js', // _elementatordefault
              'src/core/linq/observable/elementatordefault.js', // _elementatordefault
              'src/core/linq/observable/_singleordefault.js',
              'src/core/linq/observable/single.js', // _singleordefault, where
              'src/core/linq/observable/singleordefault.js', // _singleordefault, where
              'src/core/linq/observable/_firstordefault.js',
              'src/core/linq/observable/first.js', // _firstordefault, where
              'src/core/linq/observable/firstordefault.js', // _firstordefault, where
              'src/core/linq/observable/_lastordefault.js',
              'src/core/linq/observable/last.js', // _firstordefault, where
              'src/core/linq/observable/lastordefault.js', // _firstordefault, where
              'src/core/linq/observable/_findvalue.js',
              'src/core/linq/observable/find.js', // _findvalue, where
              'src/core/linq/observable/findindex.js', // _findvalue, where

              // Async operators
              'src/core/linq/observable/start.js', // toasync
              'src/core/linq/observable/toasync.js', // AsyncSubject, asObservable
              'src/core/linq/observable/fromcallback.js', // AsyncSubject, asObservable
              'src/core/linq/observable/fromnodecallback.js', // AsyncSubject, asObservable
              'src/core/linq/observable/fromevent-modern.js', // publish
              'src/core/linq/observable/fromeventpattern.js', // publish
              'src/core/linq/observable/startasync.js',

              // Backpressure operators
              'src/core/backpressure/pausable.js',
              'src/core/backpressure/pausablebuffered.js',
              'src/core/backpressure/controlled.js',
              'src/core/backpressure/controlledobservable.js',
              'src/core/backpressure/controlledsubject.js',              

              // Binding operators
              'src/core/linq/observable/multicast.js', // ConnectableObservable
              'src/core/linq/observable/publish.js',   // mulitcast, Subject
              'src/core/linq/observable/share.js',   // mulitcast, Subject, Reference counted
              'src/core/linq/observable/publishlast.js', // multicast, AsyncSubject
              'src/core/linq/observable/publishvalue.js', // multicast, BehaviorSubject
              'src/core/linq/observable/sharevalue.js', // multicast, BehaviorSubject, Reference counted
              'src/core/linq/observable/replay.js', // multicast, ReplaySubject
              'src/core/linq/observable/sharereplay.js',
              'src/core/subjects/innersubscription.js',
              'src/core/subjects/behaviorsubject.js',
              'src/core/subjects/replaysubject.js',
              'src/core/linq/connectableobservable.js',    

              // Coincidence operators
              'src/core/internal/dictionary.js',
              'src/core/linq/observable/join.js', // SerialDisposable, SingleAssignmentDisposable, RefCountDisposable, CompositeDisposable, Dictionary
              'src/core/linq/observable/groupjoin.js', // SerialDisposable, SingleAssignmentDisposable, RefCountDisposable, CompositeDisposable, Dictionary
              'src/core/linq/observable/buffer.js', // window, selectMany, toArray
              'src/core/linq/observable/window.js', // CompositeDisposable, RefCountDisposable, Subject, SingleAssignmentDisposable
              'src/core/linq/observable/pairwise.js',
              'src/core/linq/observable/partition.js',

              // Experimental operators
              'src/core/linq/enumerable/while.js', // Enumerable
              'src/core/linq/observable/let.js',
              'src/core/linq/observable/if.js', // defer, empty
              'src/core/linq/observable/for.js', // Enumerable.forEach, concatproto
              'src/core/linq/observable/while.js', // Enumerable.while, concatproto
              'src/core/linq/observable/dowhile.js', // Enumerable.while, concat
              'src/core/linq/observable/case.js', // defer, empty
              'src/core/linq/observable/expand.js', // immediateScheduler, SerialDisposable, CompositeDisposable, SingleAssignmentDisposable
              'src/core/linq/observable/forkjoin.js', // CompositeDisposable
              'src/core/linq/observable/forkjoinproto.js', // SingleAssignmentDisposable, CompositeDisposable
              'src/core/linq/observable/manyselect.js', // ImmediateScheduler, CurrentThreadScheduler, select, do, observeOn

              // Join pattern operators
              'src/core/internal/map.js',
              'src/core/joins/pattern.js',
              'src/core/joins/plan.js',
              'src/core/joins/activeplan.js',
              'src/core/joins/joinobserver.js',
              'src/core/linq/observable/and.js', // Pattern
              'src/core/linq/observable/then.js', // Pattern
              'src/core/linq/observable/when.js', // CompositeDisposable  

              // Time based operators
              'src/core/linq/observable/_observabletimerdate.js', // AnonymousObservable
              'src/core/linq/observable/_observabletimerdateandperiod.js', // AnonymousObservable, normalizeTime
              'src/core/linq/observable/_observabletimertimespan.js', // AnonymousObservable, normalizeTime
              'src/core/linq/observable/_observabletimertimespanandperiod.js', // AnonymousObservable, defer, _observabletimerdateandperiod
              'src/core/linq/observable/interval.js', // timeoutScheduler, _observabletimertimespanandperiod
              'src/core/linq/observable/timer.js', // timeoutScheduler, _observabletimerdate, _observabletimerdateandperiod, _observabletimertimespan, _observabletimertimespanandperiod
              'src/core/linq/observable/delay.js', // AnonymousObservable, timeoutScheduler, SerialDisposable, materialize, timestamp
              'src/core/linq/observable/throttle.js', // AnonymousObservable, SerialDisposable, timeoutScheduler, SingleAssignmentDisposable, CompositeDisposable
              'src/core/linq/observable/windowwithtime.js', // AnonymousObservable, SerialDisposable, SingleAssignmentDisposable, RefCountDisposable, CompositeDisposable, addref, subject
              'src/core/linq/observable/windowwithtimeorcount.js', // AnonymousObservable, SerialDisposable, SingleAssignmentDisposable, RefCountDisposable, CompositeDisposable, addref, subject
              'src/core/linq/observable/bufferwithtime.js', // windowwithtime, selectMany, toArray
              'src/core/linq/observable/bufferwithtimeourcount.js', // windowwithtimeorcount, selectMany, toArray
              'src/core/linq/observable/timeinterval.js', // timeoutScheduler, defer, select
              'src/core/linq/observable/timestamp.js', // timeoutScheduler, select
              'src/core/linq/observable/sample.js', // AnonymousObservable, CompositeDisposable, interval, timeoutScheduler
              'src/core/linq/observable/timeout.js', // AnonymousObservable, timeoutScheduler, throw, SingleAssignmentDisposable, SerialDisposable, CompositeDisposable
              'src/core/linq/observable/generatewithabsolutetime.js', // timeoutScheduler, AnonymousObservable
              'src/core/linq/observable/generatewithrelativetime.js', // timeoutScheduler, AnonymousObservable
              'src/core/linq/observable/delaysubscription.js', // delayWithSelector, timer, empty
              'src/core/linq/observable/delaywithselector.js',
              'src/core/linq/observable/timeoutwithselector.js',
              'src/core/linq/observable/throttlewithselector.js',
              'src/core/linq/observable/skiplastwithtime.js',
              'src/core/linq/observable/takelastwithtime.js',
              'src/core/linq/observable/takelastbufferwithtime.js',
              'src/core/linq/observable/takewithtime.js',
              'src/core/linq/observable/skipwithtime.js',
              'src/core/linq/observable/skipuntilwithtime.js',
              'src/core/linq/observable/takeuntilwithtime.js', 

              // Experimental Flattening
              'src/core/linq/observable/exclusive.js',
              'src/core/linq/observable/exclusivemap.js',

              // Virtual time
              'src/core/concurrency/virtualtimescheduler.js',
              'src/core/concurrency/historicalscheduler.js',  

              'src/core/anonymousobservable.js',
              'src/core/autodetachobserver.js',
              'src/core/linq/groupedobservable.js',
              'src/core/subjects/innersubscription.js',
              'src/core/subjects/subject.js',
              'src/core/subjects/asyncsubject.js',
              'src/core/subjects/anonymoussubject.js',
              'src/core/exports.js',
              'src/core/outro.js'
            ],
            dest: 'dist/rx.all.js'
          },
          allcompat: {
            src: [
              'src/core/license.js',
              'src/core/intro.js',
              'src/core/basicheader.js',
              'src/core/enumeratorheader.js',

              'src/core/internal/isequal.js',
              'src/core/internal/util.js',
              'src/core/internal/polyfills.js',
              'src/core/internal/priorityqueue.js',
              'src/core/disposables/compositedisposable.js',
              'src/core/disposables/disposable.js',
              'src/core/disposables/booleandisposable.js',
              'src/core/disposables/singleassignmentdisposable.js',
              'src/core/disposables/serialdisposable.js',
              'src/core/disposables/refcountdisposable.js',
              'src/core/disposables/scheduleddisposable.js',
              'src/core/concurrency/scheduleditem.js',
              'src/core/concurrency/scheduler.js',
              'src/core/concurrency/scheduleperiodicrecursive.js',
              'src/core/concurrency/immediatescheduler.js',
              'src/core/concurrency/currentthreadscheduler.js',
              'src/core/concurrency/timeoutscheduler.js',
              'src/core/concurrency/catchscheduler.js',
              'src/core/notification.js',
              'src/core/internal/enumerator.js',
              'src/core/internal/enumerable.js',
              'src/core/observer.js',
              'src/core/abstractobserver.js',
              'src/core/anonymousobserver.js',
              'src/core/checkedobserver.js',
              'src/core/scheduledobserver.js',
              'src/core/observeonobserver.js',
              'src/core/observable.js',

              'src/core/linq/observable/observeon.js', // ObserveOnObserver
              'src/core/linq/observable/subscribeon.js', // SingleAssignmentDisposable, SerialDisposable, ScheduleDisposable

              // Async
              'src/core/linq/observable/frompromise.js', // AsyncSubject, asObservable
              'src/core/linq/observable/topromise.js',                    

              // Creation
              'src/core/linq/observable/toarray.js',
              'src/core/linq/observable/create.js',
              'src/core/linq/observable/defer.js',
              'src/core/linq/observable/empty.js',
              'src/core/linq/observable/fromarray.js',
              'src/core/linq/observable/fromiterable.js',
              'src/core/linq/observable/generate.js',
              'src/core/linq/observable/of.js',
              'src/core/linq/observable/never.js',
              'src/core/linq/observable/range.js',
              'src/core/linq/observable/repeat.js',
              'src/core/linq/observable/return.js',
              'src/core/linq/observable/throw.js',
              'src/core/linq/observable/using.js',

              // Multiple
              'src/core/linq/observable/ambproto.js',
              'src/core/linq/observable/amb.js',
              'src/core/linq/observable/catchproto.js',
              'src/core/linq/observable/catch.js',
              'src/core/linq/observable/combinelatestproto.js',
              'src/core/linq/observable/combinelatest.js',
              'src/core/linq/observable/concatproto.js',
              'src/core/linq/observable/concat.js',
              'src/core/linq/observable/concatobservable.js',
              'src/core/linq/observable/mergeproto.js',
              'src/core/linq/observable/merge.js',
              'src/core/linq/observable/mergeobservable.js',
              'src/core/linq/observable/onerrorresumenextproto.js',
              'src/core/linq/observable/onerrorresumenext.js',
              'src/core/linq/observable/skipuntil.js',
              'src/core/linq/observable/switch.js',
              'src/core/linq/observable/takeuntil.js',
              'src/core/linq/observable/zipproto.js',
              'src/core/linq/observable/zip.js',
              'src/core/linq/observable/ziparray.js',

              // Single
              'src/core/linq/observable/asobservable.js',
              'src/core/linq/observable/bufferwithcount.js',
              'src/core/linq/observable/dematerialize.js',
              'src/core/linq/observable/distinctuntilchanged.js',
              'src/core/linq/observable/do.js',
              'src/core/linq/observable/finally.js',
              'src/core/linq/observable/ignoreelements.js',
              'src/core/linq/observable/materialize.js',
              'src/core/linq/observable/repeatproto.js',
              'src/core/linq/observable/retry.js',
              'src/core/linq/observable/scan.js',
              'src/core/linq/observable/skiplast.js',
              'src/core/linq/observable/startwith.js',
              'src/core/linq/observable/takelast.js',
              'src/core/linq/observable/takelastbuffer.js',
              'src/core/linq/observable/windowwithcount.js',

              // Standard query operators
              'src/core/linq/observable/concatmap.js',
              'src/core/linq/observable/defaultifempty.js',
              'src/core/linq/observable/distinct.js',
              'src/core/linq/observable/groupby.js',
              'src/core/linq/observable/groupbyuntil.js',
              'src/core/linq/observable/select.js',
              'src/core/linq/observable/pluck.js',
              'src/core/linq/observable/selectmany.js',
              'src/core/linq/observable/selectswitch.js',
              'src/core/linq/observable/skip.js',
              'src/core/linq/observable/skipwhile.js',
              'src/core/linq/observable/take.js',
              'src/core/linq/observable/takewhile.js',
              'src/core/linq/observable/where.js',

              // Aggregate Operators
              'src/core/linq/observable/finalvalue.js',
              'src/core/linq/observable/_extremaby.js',
              'src/core/linq/observable/_firstonly.js',
              'src/core/linq/observable/aggregate.js', // scan, startwith, finalvalue
              'src/core/linq/observable/reduce.js', // scan, startwith, finalvalue
              'src/core/linq/observable/any.js',  // where
              'src/core/linq/observable/isempty.js', // any, select
              'src/core/linq/observable/all.js', // where, any
              'src/core/linq/observable/contains.js', // where, any
              'src/core/linq/observable/count.js', // where, aggregate
              'src/core/linq/observable/sum.js', // select, aggregate
              'src/core/linq/observable/minby.js', // _extremaby
              'src/core/linq/observable/min.js',   // minby, _firstonly
              'src/core/linq/observable/maxby.js', // _extremaby
              'src/core/linq/observable/max.js',   // max, _firstonly
              'src/core/linq/observable/average.js',   // select, scan, aggregate, finalvalue
              'src/core/linq/observable/sequenceequal.js',   // compositedisposable
              'src/core/linq/observable/_elementatordefault.js',
              'src/core/linq/observable/elementat.js', // _elementatordefault
              'src/core/linq/observable/elementatordefault.js', // _elementatordefault
              'src/core/linq/observable/_singleordefault.js',
              'src/core/linq/observable/single.js', // _singleordefault, where
              'src/core/linq/observable/singleordefault.js', // _singleordefault, where
              'src/core/linq/observable/_firstordefault.js',
              'src/core/linq/observable/first.js', // _firstordefault, where
              'src/core/linq/observable/firstordefault.js', // _firstordefault, where
              'src/core/linq/observable/_lastordefault.js',
              'src/core/linq/observable/last.js', // _firstordefault, where
              'src/core/linq/observable/lastordefault.js', // _firstordefault, where
              'src/core/linq/observable/_findvalue.js',
              'src/core/linq/observable/find.js', // _findvalue, where
              'src/core/linq/observable/findindex.js', // _findvalue, where

              // Async compat operators
              'src/core/linq/observable/start.js', // toasync
              'src/core/linq/observable/toasync.js', // asyncsubject, asObservable
              'src/core/linq/observable/fromcallback.js', // AsyncSubject, asObservable
              'src/core/linq/observable/fromnodecallback.js', // AsyncSubject, asObservable
              'src/core/linq/observable/fromevent.js', // publish
              'src/core/linq/observable/fromeventpattern.js', // publish
              'src/core/linq/observable/startasync.js',

              // Backpressure operators
              'src/core/backpressure/pausable.js',
              'src/core/backpressure/pausablebuffered.js',
              'src/core/backpressure/controlled.js',
              'src/core/backpressure/controlledobservable.js',
              'src/core/backpressure/controlledsubject.js',           

              // Binding operators
              'src/core/linq/observable/multicast.js', // ConnectableObservable
              'src/core/linq/observable/publish.js',   // mulitcast, Subject
              'src/core/linq/observable/share.js',   // mulitcast, Subject, Reference counted
              'src/core/linq/observable/publishlast.js', // multicast, AsyncSubject
              'src/core/linq/observable/publishvalue.js', // multicast, BehaviorSubject
              'src/core/linq/observable/sharevalue.js', // multicast, BehaviorSubject, Reference counted
              'src/core/linq/observable/replay.js', // multicast, ReplaySubject
              'src/core/linq/observable/sharereplay.js',
              'src/core/subjects/innersubscription.js',
              'src/core/subjects/behaviorsubject.js',
              'src/core/subjects/replaysubject.js',
              'src/core/linq/connectableobservable.js',              

              // Coincidence operators
              'src/core/internal/dictionary.js',
              'src/core/linq/observable/join.js', // SerialDisposable, SingleAssignmentDisposable, RefCountDisposable, CompositeDisposable, Dictionary
              'src/core/linq/observable/groupjoin.js', // SerialDisposable, SingleAssignmentDisposable, RefCountDisposable, CompositeDisposable, Dictionary
              'src/core/linq/observable/buffer.js', // window, selectMany, toArray
              'src/core/linq/observable/window.js', // CompositeDisposable, RefCountDisposable, Subject, SingleAssignmentDisposable
              'src/core/linq/observable/pairwise.js',
              'src/core/linq/observable/partition.js',

              // Experimental operators
              'src/core/linq/enumerable/while.js', // Enumerable
              'src/core/linq/observable/let.js',
              'src/core/linq/observable/if.js', // defer, empty
              'src/core/linq/observable/for.js', // Enumerable.forEach, concatproto
              'src/core/linq/observable/while.js', // Enumerable.while, concatproto
              'src/core/linq/observable/dowhile.js', // Enumerable.while, concat
              'src/core/linq/observable/case.js', // defer, empty
              'src/core/linq/observable/expand.js', // immediateScheduler, SerialDisposable, CompositeDisposable, SingleAssignmentDisposable
              'src/core/linq/observable/forkjoin.js', // CompositeDisposable
              'src/core/linq/observable/forkjoinproto.js', // SingleAssignmentDisposable, CompositeDisposable
              'src/core/linq/observable/manyselect.js', // ImmediateScheduler, CurrentThreadScheduler, select, do, observeOn              

              // Join pattern operators
              'src/core/internal/map.js',
              'src/core/joins/pattern.js',
              'src/core/joins/plan.js',
              'src/core/joins/activeplan.js',
              'src/core/joins/joinobserver.js',
              'src/core/linq/observable/and.js', // Pattern
              'src/core/linq/observable/then.js', // Pattern
              'src/core/linq/observable/when.js', // CompositeDisposable              

              // Time based operators
              'src/core/linq/observable/_observabletimerdate.js', // AnonymousObservable
              'src/core/linq/observable/_observabletimerdateandperiod.js', // AnonymousObservable, normalizeTime
              'src/core/linq/observable/_observabletimertimespan.js', // AnonymousObservable, normalizeTime
              'src/core/linq/observable/_observabletimertimespanandperiod.js', // AnonymousObservable, defer, _observabletimerdateandperiod
              'src/core/linq/observable/interval.js', // timeoutScheduler, _observabletimertimespanandperiod
              'src/core/linq/observable/timer.js', // timeoutScheduler, _observabletimerdate, _observabletimerdateandperiod, _observabletimertimespan, _observabletimertimespanandperiod
              'src/core/linq/observable/delay.js', // AnonymousObservable, timeoutScheduler, SerialDisposable, materialize, timestamp
              'src/core/linq/observable/throttle.js', // AnonymousObservable, SerialDisposable, timeoutScheduler, SingleAssignmentDisposable, CompositeDisposable
              'src/core/linq/observable/windowwithtime.js', // AnonymousObservable, SerialDisposable, SingleAssignmentDisposable, RefCountDisposable, CompositeDisposable, addref, subject
              'src/core/linq/observable/windowwithtimeorcount.js', // AnonymousObservable, SerialDisposable, SingleAssignmentDisposable, RefCountDisposable, CompositeDisposable, addref, subject
              'src/core/linq/observable/bufferwithtime.js', // windowwithtime, selectMany, toArray
              'src/core/linq/observable/bufferwithtimeourcount.js', // windowwithtimeorcount, selectMany, toArray
              'src/core/linq/observable/timeinterval.js', // timeoutScheduler, defer, select
              'src/core/linq/observable/timestamp.js', // timeoutScheduler, select
              'src/core/linq/observable/sample.js', // AnonymousObservable, CompositeDisposable, interval, timeoutScheduler
              'src/core/linq/observable/timeout.js', // AnonymousObservable, timeoutScheduler, throw, SingleAssignmentDisposable, SerialDisposable, CompositeDisposable
              'src/core/linq/observable/generatewithabsolutetime.js', // timeoutScheduler, AnonymousObservable
              'src/core/linq/observable/generatewithrelativetime.js', // timeoutScheduler, AnonymousObservable
              'src/core/linq/observable/delaysubscription.js', // delayWithSelector, timer, empty
              'src/core/linq/observable/delaywithselector.js',
              'src/core/linq/observable/timeoutwithselector.js',
              'src/core/linq/observable/throttlewithselector.js',
              'src/core/linq/observable/skiplastwithtime.js',
              'src/core/linq/observable/takelastwithtime.js',
              'src/core/linq/observable/takelastbufferwithtime.js',
              'src/core/linq/observable/takewithtime.js',
              'src/core/linq/observable/skipwithtime.js',
              'src/core/linq/observable/skipuntilwithtime.js',
              'src/core/linq/observable/takeuntilwithtime.js',              

              // Experimental Flattening
              'src/core/linq/observable/exclusive.js',
              'src/core/linq/observable/exclusivemap.js',

              // Virtual time
              'src/core/concurrency/virtualtimescheduler.js',
              'src/core/concurrency/historicalscheduler.js',              

              'src/core/anonymousobservable.js',
              'src/core/autodetachobserver.js',
              'src/core/linq/groupedobservable.js',
              'src/core/subjects/innersubscription.js',
              'src/core/subjects/subject.js',
              'src/core/subjects/asyncsubject.js',
              'src/core/subjects/anonymoussubject.js',
              'src/core/exports.js',
              'src/core/outro.js'            
            ],
            dest: 'dist/rx.all.compat.js'
          },
          basic: {
            src: [
              'src/core/license.js',
              'src/core/intro.js',
              'src/core/basicheader.js',
              'src/core/enumeratorheader.js',

              'src/core/internal/isequal.js',
              'src/core/internal/util.js',
              'src/core/internal/polyfills.js',
              'src/core/internal/priorityqueue.js',
              'src/core/disposables/compositedisposable.js',
              'src/core/disposables/disposable.js',
              'src/core/disposables/booleandisposable.js',
              'src/core/disposables/singleassignmentdisposable.js',
              'src/core/disposables/serialdisposable.js',
              'src/core/disposables/refcountdisposable.js',
              'src/core/disposables/scheduleddisposable.js',
              'src/core/concurrency/scheduleditem.js',
              'src/core/concurrency/scheduler.js',
              'src/core/concurrency/scheduleperiodicrecursive.js',
              'src/core/concurrency/immediatescheduler.js',
              'src/core/concurrency/currentthreadscheduler.js',
              'src/core/concurrency/timeoutscheduler.js',
              'src/core/concurrency/catchscheduler.js',
              'src/core/notification.js',
              'src/core/internal/enumerator.js',
              'src/core/internal/enumerable.js',
              'src/core/observer.js',
              'src/core/abstractobserver.js',
              'src/core/anonymousobserver.js',
              'src/core/checkedobserver.js',
              'src/core/scheduledobserver.js',
              'src/core/observeonobserver.js',
              'src/core/observable.js',

              'src/core/linq/observable/observeon.js', // ObserveOnObserver
              'src/core/linq/observable/subscribeon.js', // SingleAssignmentDisposable, SerialDisposable, ScheduleDisposable

              // Async
              'src/core/linq/observable/frompromise.js', // AsyncSubject, asObservable
              'src/core/linq/observable/topromise.js',                    

              // Creation
              'src/core/linq/observable/toarray.js',
              'src/core/linq/observable/create.js',
              'src/core/linq/observable/defer.js',
              'src/core/linq/observable/empty.js',
              'src/core/linq/observable/fromarray.js',
              'src/core/linq/observable/fromiterable.js',
              'src/core/linq/observable/generate.js',
              'src/core/linq/observable/never.js',
              'src/core/linq/observable/of.js',
              'src/core/linq/observable/range.js',
              'src/core/linq/observable/repeat.js',
              'src/core/linq/observable/return.js',
              'src/core/linq/observable/throw.js',
              'src/core/linq/observable/using.js',

              // Multiple
              'src/core/linq/observable/ambproto.js',
              'src/core/linq/observable/amb.js',
              'src/core/linq/observable/catchproto.js',
              'src/core/linq/observable/catch.js',
              'src/core/linq/observable/combinelatestproto.js',
              'src/core/linq/observable/combinelatest.js',
              'src/core/linq/observable/concatproto.js',
              'src/core/linq/observable/concat.js',
              'src/core/linq/observable/concatobservable.js',
              'src/core/linq/observable/mergeproto.js',
              'src/core/linq/observable/merge.js',
              'src/core/linq/observable/mergeobservable.js',
              'src/core/linq/observable/onerrorresumenextproto.js',
              'src/core/linq/observable/onerrorresumenext.js',
              'src/core/linq/observable/skipuntil.js',
              'src/core/linq/observable/switch.js',
              'src/core/linq/observable/takeuntil.js',
              'src/core/linq/observable/zipproto.js',
              'src/core/linq/observable/zip.js',
              'src/core/linq/observable/ziparray.js',

              // Single
              'src/core/linq/observable/asobservable.js',
              'src/core/linq/observable/bufferwithcount.js',
              'src/core/linq/observable/dematerialize.js',
              'src/core/linq/observable/distinctuntilchanged.js',
              'src/core/linq/observable/do.js',
              'src/core/linq/observable/finally.js',
              'src/core/linq/observable/ignoreelements.js',
              'src/core/linq/observable/materialize.js',
              'src/core/linq/observable/repeatproto.js',
              'src/core/linq/observable/retry.js',
              'src/core/linq/observable/scan.js',
              'src/core/linq/observable/skiplast.js',
              'src/core/linq/observable/startwith.js',
              'src/core/linq/observable/takelast.js',
              'src/core/linq/observable/takelastbuffer.js',
              'src/core/linq/observable/windowwithcount.js',

              // Standard query operators
              'src/core/linq/observable/concatmap.js',
              'src/core/linq/observable/defaultifempty.js',
              'src/core/linq/observable/distinct.js',
              'src/core/linq/observable/groupby.js',
              'src/core/linq/observable/groupbyuntil.js',
              'src/core/linq/observable/select.js',
              'src/core/linq/observable/pluck.js',
              'src/core/linq/observable/selectmany.js',
              'src/core/linq/observable/selectswitch.js',
              'src/core/linq/observable/skip.js',
              'src/core/linq/observable/skipwhile.js',
              'src/core/linq/observable/take.js',
              'src/core/linq/observable/takewhile.js',
              'src/core/linq/observable/where.js',

              // Experimental Flattening
              'src/core/linq/observable/exclusive.js',
              'src/core/linq/observable/exclusivemap.js',

              'src/core/anonymousobservable.js',
              'src/core/autodetachobserver.js',
              'src/core/linq/groupedobservable.js',
              'src/core/subjects/innersubscription.js',
              'src/core/subjects/subject.js',
              'src/core/subjects/asyncsubject.js',
              'src/core/subjects/anonymoussubject.js',
              'src/core/exports.js',
              'src/core/outro.js'
            ],
            dest: 'dist/rx.compat.js'
          },
          modern: {
            src: [
              'src/core/license.js',
              'src/core/intro.js',
              'src/core/basicheader-modern.js',
              'src/core/enumeratorheader.js',

              'src/core/internal/isequal.js',
              'src/core/internal/util.js',
              'src/core/internal/priorityqueue.js',
              'src/core/disposables/compositedisposable.js',
              'src/core/disposables/disposable.js',
              'src/core/disposables/booleandisposable.js',
              'src/core/disposables/singleassignmentdisposable.js',
              'src/core/disposables/serialdisposable.js',
              'src/core/disposables/refcountdisposable.js',
              'src/core/disposables/scheduleddisposable.js',
              'src/core/concurrency/scheduleditem.js',
              'src/core/concurrency/scheduler.js',
              'src/core/concurrency/scheduleperiodicrecursive.js',
              'src/core/concurrency/immediatescheduler.js',
              'src/core/concurrency/currentthreadscheduler.js',
              'src/core/concurrency/timeoutscheduler.js',
              'src/core/concurrency/catchscheduler.js',
              'src/core/notification.js',
              'src/core/internal/enumerator.js',
              'src/core/internal/enumerable.js',
              'src/core/observer.js',
              'src/core/abstractobserver.js',
              'src/core/anonymousobserver.js',
              'src/core/checkedobserver.js',
              'src/core/scheduledobserver.js',
              'src/core/observeonobserver.js',
              'src/core/observable.js',

              // Concurrency
              'src/core/linq/observable/observeon.js', // ObserveOnObserver
              'src/core/linq/observable/subscribeon.js', // SingleAssignmentDisposable, SerialDisposable, ScheduleDisposable

              // Async
              'src/core/linq/observable/frompromise.js', // AsyncSubject, asObservable
              'src/core/linq/observable/topromise.js',    

              // Creation
              'src/core/linq/observable/toarray.js',
              'src/core/linq/observable/create.js',
              'src/core/linq/observable/defer.js',
              'src/core/linq/observable/empty.js',
              'src/core/linq/observable/fromarray.js',
              'src/core/linq/observable/fromiterable.js',
              'src/core/linq/observable/generate.js',
              'src/core/linq/observable/never.js',
              'src/core/linq/observable/of.js',
              'src/core/linq/observable/range.js',
              'src/core/linq/observable/repeat.js',
              'src/core/linq/observable/return.js',
              'src/core/linq/observable/throw.js',
              'src/core/linq/observable/using.js',

              // Multiple
              'src/core/linq/observable/ambproto.js',
              'src/core/linq/observable/amb.js',
              'src/core/linq/observable/catchproto.js',
              'src/core/linq/observable/catch.js',
              'src/core/linq/observable/combinelatestproto.js',
              'src/core/linq/observable/combinelatest.js',
              'src/core/linq/observable/concatproto.js',
              'src/core/linq/observable/concat.js',
              'src/core/linq/observable/concatobservable.js',
              'src/core/linq/observable/mergeproto.js',
              'src/core/linq/observable/merge.js',
              'src/core/linq/observable/mergeobservable.js',
              'src/core/linq/observable/onerrorresumenextproto.js',
              'src/core/linq/observable/onerrorresumenext.js',
              'src/core/linq/observable/skipuntil.js',
              'src/core/linq/observable/switch.js',
              'src/core/linq/observable/takeuntil.js',
              'src/core/linq/observable/zipproto.js',
              'src/core/linq/observable/zip.js',
              'src/core/linq/observable/ziparray.js',

              // Single
              'src/core/linq/observable/asobservable.js',
              'src/core/linq/observable/bufferwithcount.js',
              'src/core/linq/observable/dematerialize.js',
              'src/core/linq/observable/distinctuntilchanged.js',
              'src/core/linq/observable/do.js',
              'src/core/linq/observable/finally.js',
              'src/core/linq/observable/ignoreelements.js',
              'src/core/linq/observable/materialize.js',
              'src/core/linq/observable/repeatproto.js',
              'src/core/linq/observable/retry.js',
              'src/core/linq/observable/scan.js',
              'src/core/linq/observable/skiplast.js',
              'src/core/linq/observable/startwith.js',
              'src/core/linq/observable/takelast.js',
              'src/core/linq/observable/takelastbuffer.js',
              'src/core/linq/observable/windowwithcount.js',

              // Standard query operators
              'src/core/linq/observable/concatmap.js',
              'src/core/linq/observable/defaultifempty.js',
              'src/core/linq/observable/distinct.js',
              'src/core/linq/observable/groupby.js',
              'src/core/linq/observable/groupbyuntil.js',
              'src/core/linq/observable/select.js',
              'src/core/linq/observable/pluck.js',
              'src/core/linq/observable/selectmany.js',
              'src/core/linq/observable/selectswitch.js',
              'src/core/linq/observable/skip.js',
              'src/core/linq/observable/skipwhile.js',
              'src/core/linq/observable/take.js',
              'src/core/linq/observable/takewhile.js',
              'src/core/linq/observable/where.js',

              // Experimental Flattening
              'src/core/linq/observable/exclusive.js',
              'src/core/linq/observable/exclusivemap.js',              

              'src/core/anonymousobservable.js',
              'src/core/autodetachobserver.js',
              'src/core/linq/groupedobservable.js',
              'src/core/subjects/innersubscription.js',
              'src/core/subjects/subject.js',
              'src/core/subjects/asyncsubject.js',
              'src/core/subjects/anonymoussubject.js',
              'src/core/exports.js',
              'src/core/outro.js'
            ],
            dest: 'dist/rx.js'
          },
          lite: {
            src: [
              'src/core/license.js',
              'src/core/intro.js',
              'src/core/liteheader.js',
              'src/core/enumeratorheader.js',

              'src/core/internal/isequal.js',
              'src/core/internal/util.js',
              'src/core/internal/priorityqueue.js',
              'src/core/disposables/compositedisposable.js',
              'src/core/disposables/disposable.js',
              'src/core/disposables/booleandisposable.js',
              'src/core/disposables/singleassignmentdisposable.js',
              'src/core/disposables/serialdisposable.js',
              'src/core/disposables/refcountdisposable.js',

              'src/core/concurrency/scheduleditem.js',
              'src/core/concurrency/scheduler-lite.js',
              'src/core/concurrency/immediatescheduler.js',
              'src/core/concurrency/currentthreadscheduler.js',
              'src/core/concurrency/scheduleperiodicrecursive.js',
              'src/core/concurrency/timeoutscheduler.js',

              'src/core/notification.js',
              'src/core/internal/enumerator.js',
              'src/core/internal/enumerable.js',
              'src/core/observer-lite.js',
              'src/core/abstractobserver.js',
              'src/core/anonymousobserver.js',
              'src/core/observable.js',
              'src/core/scheduledobserver.js',

              // Creation
              'src/core/linq/observable/toarray.js',
              'src/core/linq/observable/create.js',
              'src/core/linq/observable/defer.js',
              'src/core/linq/observable/empty.js',
              'src/core/linq/observable/fromarray.js',
              'src/core/linq/observable/fromiterable.js',
              'src/core/linq/observable/generate.js',
              'src/core/linq/observable/never.js',
              'src/core/linq/observable/of.js',
              'src/core/linq/observable/range.js',
              'src/core/linq/observable/repeat.js',
              'src/core/linq/observable/return.js',
              'src/core/linq/observable/throw.js',

              // Multiple
              'src/core/linq/observable/catchproto.js',
              'src/core/linq/observable/catch.js',
              'src/core/linq/observable/combinelatestproto.js',
              'src/core/linq/observable/combinelatest.js',
              'src/core/linq/observable/concatproto.js',
              'src/core/linq/observable/concat.js',
              'src/core/linq/observable/concatobservable.js',
              'src/core/linq/observable/mergeproto.js',
              'src/core/linq/observable/merge.js',
              'src/core/linq/observable/mergeobservable.js',
              'src/core/linq/observable/skipuntil.js',
              'src/core/linq/observable/switch.js',
              'src/core/linq/observable/takeuntil.js',
              'src/core/linq/observable/zipproto.js',
              'src/core/linq/observable/zip.js',
              'src/core/linq/observable/ziparray.js',

              // Single
              'src/core/linq/observable/asobservable.js',
              'src/core/linq/observable/dematerialize.js',
              'src/core/linq/observable/distinctuntilchanged.js',
              'src/core/linq/observable/do.js',
              'src/core/linq/observable/finally.js',
              'src/core/linq/observable/ignoreelements.js',
              'src/core/linq/observable/materialize.js',
              'src/core/linq/observable/repeatproto.js',
              'src/core/linq/observable/retry.js',
              'src/core/linq/observable/scan.js',
              'src/core/linq/observable/skiplast.js',
              'src/core/linq/observable/startwith.js',
              'src/core/linq/observable/takelast.js',
              'src/core/linq/observable/takelastbuffer.js',

              // Standard Query Operators
              'src/core/linq/observable/concatmap.js',
              'src/core/linq/observable/select.js',
              'src/core/linq/observable/pluck.js',
              'src/core/linq/observable/selectmany.js',
              'src/core/linq/observable/selectswitch.js',
              'src/core/linq/observable/skip.js',
              'src/core/linq/observable/skipwhile.js',
              'src/core/linq/observable/take.js',
              'src/core/linq/observable/takewhile.js',
              'src/core/linq/observable/where.js',

              // Async Operators
              'src/core/linq/observable/fromcallback.js', // AsyncSubject, asObservable
              'src/core/linq/observable/fromnodecallback.js', // AsyncSubject, asObservable
              'src/core/linq/observable/fromevent-modern.js', // publish
              'src/core/linq/observable/fromeventpattern.js', // publish
              'src/core/linq/observable/frompromise.js', // AsyncSubject, asObservable
              'src/core/linq/observable/topromise.js',
              'src/core/linq/observable/startasync.js',

              // Binding Operators
              'src/core/linq/observable/multicast.js', // ConnectableObservable
              'src/core/linq/observable/publish.js',   // mulitcast, Subject
              'src/core/linq/observable/share.js',   // mulitcast, Subject, Reference counted
              'src/core/linq/observable/publishlast.js', // multicast, AsyncSubject
              'src/core/linq/observable/publishvalue.js', // multicast, BehaviorSubject
              'src/core/linq/observable/sharevalue.js', // multicast, BehaviorSubject, Reference counted
              'src/core/linq/observable/replay.js', // multicast, ReplaySubject
              'src/core/linq/observable/sharereplay.js',
              'src/core/linq/connectableobservable.js',

              // Time operators
              'src/core/linq/observable/_observabletimertimespan.js', // AnonymousObservable, normalizeTime
              'src/core/linq/observable/_observabletimertimespanandperiod.js', // AnonymousObservable, defer, _observabletimerdateandperiod
              'src/core/linq/observable/_observabletimerdateandperiod.js',
              'src/core/linq/observable/interval.js', // timeoutScheduler, _observabletimertimespanandperiod
              'src/core/linq/observable/timer-lite.js', // timeoutScheduler, _observabletimerdate, _observabletimerdateandperiod, _observabletimertimespan, _observabletimertimespanandperiod
              'src/core/linq/observable/delay-lite.js', // AnonymousObservable, timeoutScheduler, SerialDisposable, materialize, timestamp
              'src/core/linq/observable/throttle.js', // AnonymousObservable, SerialDisposable, timeoutScheduler, SingleAssignmentDisposable, CompositeDisposable
              'src/core/linq/observable/timeinterval.js', // timeoutScheduler, defer, select
              'src/core/linq/observable/timestamp.js', // timeoutScheduler, select
              'src/core/linq/observable/sample.js', // AnonymousObservable, CompositeDisposable, interval, timeoutScheduler
              'src/core/linq/observable/timeout.js', // AnonymousObservable, timeoutScheduler, throw, SingleAssignmentDisposable, SerialDisposable, CompositeDisposable
              'src/core/linq/observable/generatewithrelativetime.js', // timeoutScheduler, AnonymousObservable
              'src/core/linq/observable/delaysubscription.js', // delayWithSelector, timer, empty
              'src/core/linq/observable/delaywithselector.js',
              'src/core/linq/observable/timeoutwithselector.js',
              'src/core/linq/observable/throttlewithselector.js',
              'src/core/linq/observable/skiplastwithtime.js',
              'src/core/linq/observable/takelastwithtime.js',
              'src/core/linq/observable/takelastbufferwithtime.js',
              'src/core/linq/observable/takewithtime.js',
              'src/core/linq/observable/skipwithtime.js',
              'src/core/linq/observable/skipuntilwithtime.js',
              'src/core/linq/observable/takeuntilwithtime.js',

              // Backpressure operators
              'src/core/backpressure/pausable.js',
              'src/core/backpressure/pausablebuffered.js',
              'src/core/backpressure/controlled.js',
              'src/core/backpressure/controlledobservable.js',
              'src/core/backpressure/controlledsubject.js',
              //'src/core/backpressure/windowed.js',
              //'src/core/backpressure/windowedobservable.js',

              // Coincidence Operators
              'src/core/linq/observable/pairwise.js',
              'src/core/linq/observable/partition.js',  

              // Experimental Flattening
              'src/core/linq/observable/exclusive.js',
              'src/core/linq/observable/exclusivemap.js',

              'src/core/anonymousobservable.js',
              'src/core/autodetachobserver.js',
              'src/core/subjects/innersubscription.js',
              'src/core/subjects/subject.js',
              'src/core/subjects/asyncsubject.js',
              'src/core/subjects/anonymoussubject.js',
              'src/core/subjects/behaviorsubject.js',
              'src/core/subjects/replaysubject.js',

              'src/core/exports.js',
              'src/core/outro.js'
            ],
            dest: 'dist/rx.lite.js'
          },
          litecompat: {
            src: [
              'src/core/license.js',
              'src/core/intro.js',
              'src/core/liteheader-compat.js',
              'src/core/enumeratorheader.js',

              'src/core/internal/isequal.js',
              'src/core/internal/util.js',
              'src/core/internal/polyfills.js',
              'src/core/internal/priorityqueue.js',
              'src/core/disposables/compositedisposable.js',
              'src/core/disposables/disposable.js',
              'src/core/disposables/booleandisposable.js',
              'src/core/disposables/singleassignmentdisposable.js',
              'src/core/disposables/serialdisposable.js',
              'src/core/disposables/refcountdisposable.js',

              'src/core/concurrency/scheduleditem.js',
              'src/core/concurrency/scheduler-lite.js',
              'src/core/concurrency/immediatescheduler.js',
              'src/core/concurrency/currentthreadscheduler.js',
              'src/core/concurrency/scheduleperiodicrecursive.js',
              'src/core/concurrency/timeoutscheduler.js',

              'src/core/notification.js',
              'src/core/internal/enumerator.js',
              'src/core/internal/enumerable.js',
              'src/core/observer-lite.js',
              'src/core/abstractobserver.js',
              'src/core/anonymousobserver.js',
              'src/core/observable.js',
              'src/core/scheduledobserver.js',

              // Creation
              'src/core/linq/observable/toarray.js',
              'src/core/linq/observable/create.js',
              'src/core/linq/observable/defer.js',
              'src/core/linq/observable/empty.js',
              'src/core/linq/observable/fromarray.js',
              'src/core/linq/observable/fromiterable.js',
              'src/core/linq/observable/generate.js',
              'src/core/linq/observable/never.js',
              'src/core/linq/observable/of.js',
              'src/core/linq/observable/range.js',
              'src/core/linq/observable/repeat.js',
              'src/core/linq/observable/return.js',
              'src/core/linq/observable/throw.js',

              // Multiple
              'src/core/linq/observable/catchproto.js',
              'src/core/linq/observable/catch.js',
              'src/core/linq/observable/combinelatestproto.js',
              'src/core/linq/observable/combinelatest.js',
              'src/core/linq/observable/concatproto.js',
              'src/core/linq/observable/concat.js',
              'src/core/linq/observable/concatobservable.js',
              'src/core/linq/observable/mergeproto.js',
              'src/core/linq/observable/merge.js',
              'src/core/linq/observable/mergeobservable.js',
              'src/core/linq/observable/skipuntil.js',
              'src/core/linq/observable/switch.js',
              'src/core/linq/observable/takeuntil.js',
              'src/core/linq/observable/zipproto.js',
              'src/core/linq/observable/zip.js',
              'src/core/linq/observable/ziparray.js',

              // Single
              'src/core/linq/observable/asobservable.js',
              'src/core/linq/observable/dematerialize.js',
              'src/core/linq/observable/distinctuntilchanged.js',
              'src/core/linq/observable/do.js',
              'src/core/linq/observable/finally.js',
              'src/core/linq/observable/ignoreelements.js',
              'src/core/linq/observable/materialize.js',
              'src/core/linq/observable/repeatproto.js',
              'src/core/linq/observable/retry.js',
              'src/core/linq/observable/scan.js',
              'src/core/linq/observable/skiplast.js',
              'src/core/linq/observable/startwith.js',
              'src/core/linq/observable/takelast.js',
              'src/core/linq/observable/takelastbuffer.js',

              // Standard Query Operators
              'src/core/linq/observable/concatmap.js',
              'src/core/linq/observable/select.js',
              'src/core/linq/observable/pluck.js',
              'src/core/linq/observable/selectmany.js',
              'src/core/linq/observable/selectswitch.js',
              'src/core/linq/observable/skip.js',
              'src/core/linq/observable/skipwhile.js',
              'src/core/linq/observable/take.js',
              'src/core/linq/observable/takewhile.js',
              'src/core/linq/observable/where.js',

              // Async Operators
              'src/core/linq/observable/fromcallback.js', // AsyncSubject, asObservable
              'src/core/linq/observable/fromnodecallback.js', // AsyncSubject, asObservable
              'src/core/linq/observable/fromevent.js', // publish
              'src/core/linq/observable/fromeventpattern.js', // publish
              'src/core/linq/observable/frompromise.js', // AsyncSubject, asObservable
              'src/core/linq/observable/topromise.js',
              'src/core/linq/observable/startasync.js',

              // Binding Operators
              'src/core/linq/observable/multicast.js', // ConnectableObservable
              'src/core/linq/observable/publish.js',   // mulitcast, Subject
              'src/core/linq/observable/share.js',   // mulitcast, Subject, Reference counted
              'src/core/linq/observable/publishlast.js', // multicast, AsyncSubject
              'src/core/linq/observable/publishvalue.js', // multicast, BehaviorSubject
              'src/core/linq/observable/sharevalue.js', // multicast, BehaviorSubject, Reference counted
              'src/core/linq/observable/replay.js', // multicast, ReplaySubject
              'src/core/linq/observable/sharereplay.js',
              'src/core/linq/connectableobservable.js',

              // Time operators
              'src/core/linq/observable/_observabletimertimespan.js', // AnonymousObservable, normalizeTime
              'src/core/linq/observable/_observabletimertimespanandperiod.js', // AnonymousObservable, defer, _observabletimerdateandperiod
              'src/core/linq/observable/_observabletimerdateandperiod.js',
              'src/core/linq/observable/interval.js', // timeoutScheduler, _observabletimertimespanandperiod
              'src/core/linq/observable/timer-lite.js', // timeoutScheduler, _observabletimerdate, _observabletimerdateandperiod, _observabletimertimespan, _observabletimertimespanandperiod
              'src/core/linq/observable/delay-lite.js', // AnonymousObservable, timeoutScheduler, SerialDisposable, materialize, timestamp
              'src/core/linq/observable/throttle.js', // AnonymousObservable, SerialDisposable, timeoutScheduler, SingleAssignmentDisposable, CompositeDisposable
              'src/core/linq/observable/timeinterval.js', // timeoutScheduler, defer, select
              'src/core/linq/observable/timestamp.js', // timeoutScheduler, select
              'src/core/linq/observable/sample.js', // AnonymousObservable, CompositeDisposable, interval, timeoutScheduler
              'src/core/linq/observable/timeout.js', // AnonymousObservable, timeoutScheduler, throw, SingleAssignmentDisposable, SerialDisposable, CompositeDisposable
              'src/core/linq/observable/generatewithrelativetime.js', // timeoutScheduler, AnonymousObservable
              'src/core/linq/observable/delaysubscription.js', // delayWithSelector, timer, empty
              'src/core/linq/observable/delaywithselector.js',
              'src/core/linq/observable/timeoutwithselector.js',
              'src/core/linq/observable/throttlewithselector.js',
              'src/core/linq/observable/skiplastwithtime.js',
              'src/core/linq/observable/takelastwithtime.js',
              'src/core/linq/observable/takelastbufferwithtime.js',
              'src/core/linq/observable/takewithtime.js',
              'src/core/linq/observable/skipwithtime.js',
              'src/core/linq/observable/skipuntilwithtime.js',
              'src/core/linq/observable/takeuntilwithtime.js',

              // Backpressure operators
              'src/core/backpressure/pausable.js',
              'src/core/backpressure/pausablebuffered.js',
              'src/core/backpressure/controlled.js',
              'src/core/backpressure/controlledobservable.js',
              'src/core/backpressure/controlledsubject.js',
              //'src/core/backpressure/windowed.js',
              //'src/core/backpressure/windowedobservable.js',

              // Coincidence Operators
              'src/core/linq/observable/pairwise.js',
              'src/core/linq/observable/partition.js',  

              // Experimental Flattening
              'src/core/linq/observable/exclusive.js',
              'src/core/linq/observable/exclusivemap.js',                                

              'src/core/anonymousobservable.js',
              'src/core/autodetachobserver.js',
              'src/core/subjects/innersubscription.js',
              'src/core/subjects/subject.js',
              'src/core/subjects/asyncsubject.js',
              'src/core/subjects/anonymoussubject.js',
              'src/core/subjects/behaviorsubject.js',
              'src/core/subjects/replaysubject.js',

              'src/core/exports.js',
              'src/core/outro.js'
            ],
            dest: 'dist/rx.lite.compat.js'
          },
          liteextras: {
            src: [
              'src/core/license.js',
              'src/core/subintro.js', 
              'src/core/liteextrasheader.js',             

              'src/core/disposables/scheduleddisposable.js',
              'src/core/checkedobserver.js',
              'src/core/observeonobserver.js',
              'src/core/observer-extras',

              // Concurrency
              'src/core/linq/observable/observeon.js', // ObserveOnObserver
              'src/core/linq/observable/subscribeon.js', // SingleAssignmentDisposable, SerialDisposable, ScheduleDisposable

              // Creation
              'src/core/linq/observable/using.js',

              // Multiple
              'src/core/linq/observable/ambproto.js',
              'src/core/linq/observable/amb.js',              
              'src/core/linq/observable/onerrorresumenextproto.js',
              'src/core/linq/observable/onerrorresumenext.js',

              // Single
              'src/core/linq/observable/bufferwithcount.js',
              'src/core/linq/observable/windowwithcount.js',

              // Standard Query Operators
              'src/core/linq/observable/defaultifempty.js',
              'src/core/linq/observable/distinct.js',
              'src/core/linq/observable/groupby.js',
              'src/core/linq/observable/groupbyuntil.js',

              'src/core/linq/groupedobservable.js',

              'src/core/suboutro.js'  
            ],
            dest: 'dist/rx.lite.extras.js'
          },
          backpressure: {
              src: [
                  'src/core/license.js',
                  'src/core/subintro.js',
                  'src/core/backpressureheader.js',

                  // Backpressure operators
                  'src/core/backpressure/pausable.js',
                  'src/core/backpressure/pausablebuffered.js',
                  'src/core/backpressure/controlled.js',
                  'src/core/backpressure/controlledobservable.js',
                  'src/core/backpressure/controlledsubject.js',
                  //'src/core/backpressure/windowed.js',
                  //'src/core/backpressure/windowedobservable.js',

                  'src/core/suboutro.js'                    
              ],
              dest: 'dist/rx.backpressure.js'
          },
          aggregates: {
            src: [
              'src/core/license.js',
              'src/core/subintro.js',
              'src/core/aggregatesheader.js',
              'src/core/linq/observable/finalvalue.js',
              'src/core/linq/observable/_extremaby.js',
              'src/core/linq/observable/_firstonly.js',
              'src/core/linq/observable/aggregate.js', // scan, startwith, finalvalue
              'src/core/linq/observable/reduce.js', // scan, startwith, finalvalue
              'src/core/linq/observable/any.js',  // where
              'src/core/linq/observable/isempty.js', // any, select
              'src/core/linq/observable/all.js', // where, any
              'src/core/linq/observable/contains.js', // where, any
              'src/core/linq/observable/count.js', // where, aggregate
              'src/core/linq/observable/sum.js', // select, aggregate
              'src/core/linq/observable/minby.js', // _extremaby
              'src/core/linq/observable/min.js',   // minby, _firstonly
              'src/core/linq/observable/maxby.js', // _extremaby
              'src/core/linq/observable/max.js',   // max, _firstonly
              'src/core/linq/observable/average.js',   // select, scan, aggregate, finalvalue
              'src/core/linq/observable/sequenceequal.js',   // compositedisposable
              'src/core/linq/observable/_elementatordefault.js',
              'src/core/linq/observable/elementat.js', // _elementatordefault
              'src/core/linq/observable/elementatordefault.js', // _elementatordefault
              'src/core/linq/observable/_singleordefault.js',
              'src/core/linq/observable/single.js', // _singleordefault, where
              'src/core/linq/observable/singleordefault.js', // _singleordefault, where
              'src/core/linq/observable/_firstordefault.js',
              'src/core/linq/observable/first.js', // _firstordefault, where
              'src/core/linq/observable/firstordefault.js', // _firstordefault, where
              'src/core/linq/observable/_lastordefault.js',
              'src/core/linq/observable/last.js', // _firstordefault, where
              'src/core/linq/observable/lastordefault.js', // _firstordefault, where
              'src/core/linq/observable/_findvalue.js',
              'src/core/linq/observable/find.js', // _findvalue, where
              'src/core/linq/observable/findindex.js', // _findvalue, where
              'src/core/suboutro.js'
            ],
            dest: 'dist/rx.aggregates.js'
          },
          asyncCompat: {
            src: [
              'src/core/license.js',
              'src/core/asyncintro.js',
              'src/core/asyncheader.js',
              'src/core/linq/observable/start.js', // toasync
              'src/core/linq/observable/toasync.js', // asyncsubject, asObservable
              'src/core/linq/observable/fromcallback.js', // AsyncSubject, asObservable
              'src/core/linq/observable/fromnodecallback.js', // AsyncSubject, asObservable
              'src/core/linq/observable/fromevent.js', // publish
              'src/core/linq/observable/fromeventpattern.js', // publish
              'src/core/linq/observable/startasync.js',
              'src/core/suboutro.js'
            ],
            dest: 'dist/rx.async.compat.js'
          },
          asyncModern: {
            src: [
              'src/core/license.js',
              'src/core/asyncintro.js',
              'src/core/asyncheader.js',
              'src/core/linq/observable/start.js', // toasync
              'src/core/linq/observable/toasync.js', // AsyncSubject, asObservable
              'src/core/linq/observable/fromcallback.js', // AsyncSubject, asObservable
              'src/core/linq/observable/fromnodecallback.js', // AsyncSubject, asObservable
              'src/core/linq/observable/fromevent-modern.js', // publish
              'src/core/linq/observable/fromeventpattern.js', // publish
              'src/core/linq/observable/startasync.js',
              'src/core/suboutro.js'
            ],
            dest: 'dist/rx.async.js'
          },
          binding: {
            src: [
              'src/core/license.js',
              'src/core/subintro.js',
              'src/core/bindingheader.js',
              'src/core/linq/observable/multicast.js', // ConnectableObservable
              'src/core/linq/observable/publish.js',   // mulitcast, Subject
              'src/core/linq/observable/share.js',   // mulitcast, Subject, Reference counted
              'src/core/linq/observable/publishlast.js', // multicast, AsyncSubject
              'src/core/linq/observable/publishvalue.js', // multicast, BehaviorSubject
              'src/core/linq/observable/sharevalue.js', // multicast, BehaviorSubject, Reference counted
              'src/core/linq/observable/replay.js', // multicast, ReplaySubject
              'src/core/linq/observable/sharereplay.js',
              'src/core/subjects/innersubscription.js',
              'src/core/subjects/behaviorsubject.js',
              'src/core/subjects/replaysubject.js',
              'src/core/linq/connectableobservable.js',
              'src/core/suboutro.js'
            ],
            dest: 'dist/rx.binding.js'
          },
          coincidence: {
              src: [
                  'src/core/license.js',
                  'src/core/subintro.js',
                  'src/core/coincidenceheader.js',
                  'src/core/internal/dictionary.js',
                  'src/core/linq/observable/join.js', // SerialDisposable, SingleAssignmentDisposable, RefCountDisposable, CompositeDisposable, Dictionary
                  'src/core/linq/observable/groupjoin.js', // SerialDisposable, SingleAssignmentDisposable, RefCountDisposable, CompositeDisposable, Dictionary
                  'src/core/linq/observable/buffer.js', // window, selectMany, toArray
                  'src/core/linq/observable/window.js', // CompositeDisposable, RefCountDisposable, Subject, SingleAssignmentDisposable
                  'src/core/linq/observable/pairwise.js',
                  'src/core/linq/observable/partition.js',
                  'src/core/suboutro.js'
              ],
              dest: 'dist/rx.coincidence.js'
          },
          experimental: {
            src: [
              'src/core/license.js',
              'src/core/subintro.js',
              'src/core/experimentalheader.js',
              'src/core/enumeratorheader.js',
              'src/core/linq/enumerable/while.js', // Enumerable
              'src/core/linq/observable/let.js',
              'src/core/linq/observable/if.js', // defer, empty
              'src/core/linq/observable/for.js', // Enumerable.forEach, concatproto
              'src/core/linq/observable/while.js', // Enumerable.while, concatproto
              'src/core/linq/observable/dowhile.js', // Enumerable.while, concat
              'src/core/linq/observable/case.js', // defer, empty
              'src/core/linq/observable/expand.js', // immediateScheduler, SerialDisposable, CompositeDisposable, SingleAssignmentDisposable
              'src/core/linq/observable/forkjoin.js', // CompositeDisposable
              'src/core/linq/observable/forkjoinproto.js', // SingleAssignmentDisposable, CompositeDisposable
              'src/core/linq/observable/manyselect.js', // ImmediateScheduler, CurrentThreadScheduler, select, do, observeOn
              'src/core/suboutro.js'
            ],
            dest: 'dist/rx.experimental.js'
          },
          joinpatterns: {
            src: [
              'src/core/license.js',
              'src/core/subintro.js',
              'src/core/joinpatternsheader.js',
              'src/core/internal/map.js',
              'src/core/joins/pattern.js',
              'src/core/joins/plan.js',
              'src/core/joins/activeplan.js',
              'src/core/joins/joinobserver.js',
              'src/core/linq/observable/and.js', // Pattern
              'src/core/linq/observable/then.js', // Pattern
              'src/core/linq/observable/when.js', // CompositeDisposable
              'src/core/suboutro.js'
            ],
            dest: 'dist/rx.joinpatterns.js'
          },
          testing: {
            src: [
              'src/core/license.js',
              'src/core/testintro.js',
              'src/core/testheader.js',
              'src/core/testing/reactivetest.js',
              'src/core/testing/recorded.js',
              'src/core/testing/subscription.js',
              'src/core/testing/mockdisposable.js',
              'src/core/testing/mockobserver.js',
              'src/core/testing/hotobservable.js',
              'src/core/testing/coldobservable.js',
              'src/core/testing/testscheduler.js',
              'src/core/suboutro.js'
            ],
            dest: 'dist/rx.testing.js'
          },
          time: {
            src: [
              'src/core/license.js',
              'src/core/subintro.js',
              'src/core/timeheader.js',
              'src/core/linq/observable/_observabletimerdate.js', // AnonymousObservable
              'src/core/linq/observable/_observabletimerdateandperiod.js', // AnonymousObservable, normalizeTime
              'src/core/linq/observable/_observabletimertimespan.js', // AnonymousObservable, normalizeTime
              'src/core/linq/observable/_observabletimertimespanandperiod.js', // AnonymousObservable, defer, _observabletimerdateandperiod
              'src/core/linq/observable/interval.js', // timeoutScheduler, _observabletimertimespanandperiod
              'src/core/linq/observable/timer.js', // timeoutScheduler, _observabletimerdate, _observabletimerdateandperiod, _observabletimertimespan, _observabletimertimespanandperiod
              'src/core/linq/observable/delay.js', // AnonymousObservable, timeoutScheduler, SerialDisposable, materialize, timestamp
              'src/core/linq/observable/throttle.js', // AnonymousObservable, SerialDisposable, timeoutScheduler, SingleAssignmentDisposable, CompositeDisposable
              'src/core/linq/observable/windowwithtime.js', // AnonymousObservable, SerialDisposable, SingleAssignmentDisposable, RefCountDisposable, CompositeDisposable, addref, subject
              'src/core/linq/observable/windowwithtimeorcount.js', // AnonymousObservable, SerialDisposable, SingleAssignmentDisposable, RefCountDisposable, CompositeDisposable, addref, subject
              'src/core/linq/observable/bufferwithtime.js', // windowwithtime, selectMany, toArray
              'src/core/linq/observable/bufferwithtimeourcount.js', // windowwithtimeorcount, selectMany, toArray
              'src/core/linq/observable/timeinterval.js', // timeoutScheduler, defer, select
              'src/core/linq/observable/timestamp.js', // timeoutScheduler, select
              'src/core/linq/observable/sample.js', // AnonymousObservable, CompositeDisposable, interval, timeoutScheduler
              'src/core/linq/observable/timeout.js', // AnonymousObservable, timeoutScheduler, throw, SingleAssignmentDisposable, SerialDisposable, CompositeDisposable
              'src/core/linq/observable/generatewithabsolutetime.js', // timeoutScheduler, AnonymousObservable
              'src/core/linq/observable/generatewithrelativetime.js', // timeoutScheduler, AnonymousObservable
              'src/core/linq/observable/delaysubscription.js', // delayWithSelector, timer, empty
              'src/core/linq/observable/delaywithselector.js',
              'src/core/linq/observable/timeoutwithselector.js',
              'src/core/linq/observable/throttlewithselector.js',
              'src/core/linq/observable/skiplastwithtime.js',
              'src/core/linq/observable/takelastwithtime.js',
              'src/core/linq/observable/takelastbufferwithtime.js',
              'src/core/linq/observable/takewithtime.js',
              'src/core/linq/observable/skipwithtime.js',
              'src/core/linq/observable/skipuntilwithtime.js',
              'src/core/linq/observable/takeuntilwithtime.js',
              'src/core/suboutro.js'
            ],
            dest: 'dist/rx.time.js'
          },
          virtualtime: {
            src: [
              'src/core/license.js',
              'src/core/subintro.js',
              'src/core/virtualtimeheader.js',
              'src/core/concurrency/virtualtimescheduler.js',
              'src/core/concurrency/historicalscheduler.js',
              'src/core/suboutro.js'
            ],
            dest: 'dist/rx.virtualtime.js'
          }
      },
      uglify: {
        core: {
          src: ['<banner>', 'dist/rx.core.js'],
          dest: 'dist/rx.core.min.js'          
        },
        corecompat: {
          src: ['<banner>', 'dist/rx.core.compat.js'],
          dest: 'dist/rx.core.compat.min.js'          
        },           
        all: {
          src: ['<banner>', 'dist/rx.all.js'],
          dest: 'dist/rx.all.min.js'          
        },
        allcompat: {
          src: ['<banner>', 'dist/rx.all.compat.js'],
          dest: 'dist/rx.all.compat.min.js'          
        },        
        basic: {
          src: ['<banner>', 'dist/rx.compat.js'],
          dest: 'dist/rx.compat.min.js'
        },
        modern: {
          src: ['<banner>', 'dist/rx.js'],
          dest: 'dist/rx.min.js'
        },
        lite: {
          src: ['<banner>', 'dist/rx.lite.js'],
          dest: 'dist/rx.lite.min.js'
        },
        litecompat: {
          src: ['<banner>', 'dist/rx.lite.compat.js'],
          dest: 'dist/rx.lite.compat.min.js'
        },
        liteextras: {
          src: ['<banner>', 'dist/rx.lite.extras.js'],
          dest: 'dist/rx.lite.extras.min.js'
        },
        backpressure: {
          src: ['<banner>', 'dist/rx.backpressure.js'],
          dest: 'dist/rx.backpressure.min.js'
        },            
        aggregates: {
          src: ['<banner>', 'dist/rx.aggregates.js'],
          dest: 'dist/rx.aggregates.min.js'
        },
        asyncCompat: {
          src: ['<banner>', 'dist/rx.async.compat.js'],
          dest: 'dist/rx.async.compat.min.js'
        },
        asyncModern: {
          src: ['<banner>', 'dist/rx.async.js'],
          dest: 'dist/rx.async.min.js'
        },
        binding: {
          src: ['<banner>', 'dist/rx.binding.js'],
          dest: 'dist/rx.binding.min.js'
        },
        coincidence: {
          src: ['<banner>', 'dist/rx.coincidence.js'],
          dest: 'dist/rx.coincidence.min.js'
        },
        experimental: {
          src: ['<banner>', 'dist/rx.experimental.js'],
          dest: 'dist/rx.experimental.min.js'
        },
        joinpatterns: {
          src: ['<banner>', 'dist/rx.joinpatterns.js'],
          dest: 'dist/rx.joinpatterns.min.js'
        },
        testing: {
          src: ['<banner>', 'dist/rx.testing.js'],
          dest: 'dist/rx.testing.min.js'
        },
        time: {
          src: ['<banner>', 'dist/rx.time.js'],
          dest: 'dist/rx.time.min.js'
        },
        virtualtime: {
          src: ['<banner>', 'dist/rx.virtualtime.js'],
          dest: 'dist/rx.virtualtime.min.js'
        }
      },
      qunit: {
          all: ['tests/*.html']
      },
      jshint: {
        all: [
          'rx.core.js',
          'rx.core.compat.js',
          'rx.all.js',
          'rx.all.compat.js',
          'rx.js',
          'rx.compat.js',
          'rx.lite.js',
          'rx.lite.compat.js',
          'rx.lite.extras.js',
          'rx.aggregates.js',
          'rx.async.js',
          'rx.async.compat.js',
          'rx.binding.js',
          'rx.coincidence.js',
          'rx.experimental.js',
          'rx.joinpatterns.js',
          'rx.testing.js',
          'rx.time.js',
          'rx.virtualtime.js'
        ]
      },
      watch: {
        scripts: {
          files: 'src/**/*.js',
          tasks: ['default'],
          options: {
            interrupt: true
          }
        }
      },
      changelog: {
        options: {
          dest: 'CHANGELOG.md'
        }
      },
      connect: {
        server: {
          options: {
            base: 'tests',
            port: 9999
          }
        }
      },
      'saucelabs-qunit': {
        all: {
          options: {
            urls: [
              'http://127.0.0.1:9999/rx.aggregates.html',
              'http://127.0.0.1:9999/rx.async.html',
              'http://127.0.0.1:9999/rx.async.compat.html',
              'http://127.0.0.1:9999/rx.binding.html',
              'http://127.0.0.1:9999/rx.coincidence.html',
              'http://127.0.0.1:9999/rx.experimental.html',
              'http://127.0.0.1:9999/rx.experimental.html',
              'http://127.0.0.1:9999/rx.html',
              'http://127.0.0.1:9999/rx.modern.html',
              'http://127.0.0.1:9999/rx.lite.html',
              'http://127.0.0.1:9999/rx.lite.compat.html',
              'http://127.0.0.1:9999/rx.joinpatterns.html',
              'http://127.0.0.1:9999/rx.time.html',
              'http://127.0.0.1:9999/rx.virtualtime.html'
            ],
            tunnelTimeout: 5,
            build: process.env.TRAVIS_JOB_ID,
            concurrency: 3,
            browsers: browsers,
            testname: "qunit tests"
          }
        }
      }
  });

  // Load all "grunt-*" tasks
  require('load-grunt-tasks')(grunt);

  function createNuGetPackage(nuspec) {
    var done = this.async();

    //invoke nuget.exe
    grunt.util.spawn({
      cmd: ".nuget/nuget.exe",
      args: [
        //specify the .nuspec file
        "pack",
        nuspec,

        //specify where we want the package to be created
        "-OutputDirectory",
        "nuget",

        //override the version with whatever is currently defined in package.json
        "-Version",
        grunt.config.get("pkg").version
      ]
    }, function (error, result) {
      if (error) {
        grunt.log.error(error);
      } else {
        grunt.log.write(result);
      }

      done();
    });
  }

  grunt.registerTask('nuget-complete', 'Register NuGet-Complete', function () {
    createNuGetPackage.call(this, 'nuget/RxJS-Complete/RxJS-Complete.nuspec');
  });

  grunt.registerTask('nuget-aggregates', 'Register NuGet-Aggregates', function () {
    createNuGetPackage.call(this, 'nuget/RxJS-Aggregates/RxJS-Aggregates.nuspec');
  });

  grunt.registerTask('nuget-all', 'Register NuGet-All', function () {
    createNuGetPackage.call(this, 'nuget/RxJS-All/RxJS-All.nuspec');
  });

  grunt.registerTask('nuget-async', 'Register NuGet-Async', function () {
    createNuGetPackage.call(this, 'nuget/RxJS-Async/RxJS-Async.nuspec');
  });

  grunt.registerTask('nuget-backpressure', 'Register NuGet-BackPressure', function () {
    createNuGetPackage.call(this, 'nuget/RxJS-BackPressure/RxJS-BackPressure.nuspec');
  });    

  grunt.registerTask('nuget-binding', 'Register NuGet-Binding', function () {
    createNuGetPackage.call(this, 'nuget/RxJS-Binding/RxJS-Binding.nuspec');
  });

  grunt.registerTask('nuget-coincidence', 'Register NuGet-Coincidence', function () {
    createNuGetPackage.call(this, 'nuget/RxJS-Coincidence/RxJS-Coincidence.nuspec');
  });

  grunt.registerTask('nuget-experimental', 'Register NuGet-Experimental', function () {
    createNuGetPackage.call(this, 'nuget/RxJS-Experimental/RxJS-Experimental.nuspec');
  });

  grunt.registerTask('nuget-joinpatterns', 'Register NuGet-JoinPatterns', function () {
    createNuGetPackage.call(this, 'nuget/RxJS-JoinPatterns/RxJS-JoinPatterns.nuspec');
  });

  grunt.registerTask('nuget-lite', 'Register NuGet-Lite', function () {
    createNuGetPackage.call(this, 'nuget/RxJS-Lite/RxJS-Lite.nuspec');
  });

  grunt.registerTask('nuget-main', 'Register NuGet-Main', function () {
    createNuGetPackage.call(this, 'nuget/RxJS-Main/RxJS-Main.nuspec');
  });

  grunt.registerTask('nuget-testing', 'Register NuGet-Testing', function () {
    createNuGetPackage.call(this, 'nuget/RxJS-Testing/RxJS-Testing.nuspec');
  });

  grunt.registerTask('nuget-time', 'Register NuGet-Time', function () {
    createNuGetPackage.call(this, 'nuget/RxJS-Time/RxJS-Time.nuspec');
  });

  grunt.registerTask('nuget-virtualtime', 'Register NuGet-VirtualTime', function () {
    createNuGetPackage.call(this, 'nuget/RxJS-VirtualTime/RxJS-VirtualTime.nuspec');
  });

  grunt.registerTask('nuget', [
    'nuget-complete',
    'nuget-aggregates',
    'nuget-all',
    'nuget-async',
    'nuget-backpressure',
    'nuget-binding',
    'nuget-coincidence',
    'nuget-experimental',
    'nuget-joinpatterns',
    'nuget-lite',
    'nuget-main',
    'nuget-testing',
    'nuget-time',
    'nuget-virtualtime'
  ]);

  var testjobs = ['connect'];
  console.log(process.env.SAUCE_ACCESS_KEY);
  if (typeof process.env.SAUCE_ACCESS_KEY !== 'undefined'){
      testjobs = testjobs.concat(['saucelabs-qunit']);
  }

   grunt.registerTask('test', testjobs);

  // Default task
  grunt.registerTask('default', [
    'concat:core',
    'concat:corecompat',
    'concat:all',
    'concat:allcompat',
    'concat:basic',
    'concat:modern',
    'concat:backpressure',
    'concat:aggregates',
    'concat:asyncCompat',
    'concat:asyncModern',
    'concat:binding',
    'concat:coincidence',
    'concat:experimental',
    'concat:joinpatterns',
    'concat:time',
    'concat:testing',
    'concat:virtualtime',
    'concat:lite',
    'concat:litecompat',
    'concat:liteextras',

    'uglify:core',
    'uglify:corecompat',
    'uglify:all',
    'uglify:allcompat',
    'uglify:basic',
    'uglify:modern',
    'uglify:backpressure',
    'uglify:aggregates',
    'uglify:asyncCompat',
    'uglify:asyncModern',
    'uglify:binding',
    'uglify:coincidence',
    'uglify:experimental',
    'uglify:joinpatterns',
    'uglify:testing',
    'uglify:time',
    'uglify:virtualtime',
    'uglify:lite',
    'uglify:litecompat',
    'uglify:liteextras',

    'qunit'
  ]);

};
