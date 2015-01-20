# Operators by Categories #

This topic lists all major operators implemented by the [`Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md) type by their categories, specifically: creation, conversion, combine, functional, mathematical, time, exceptions, miscellaneous, selection and primitives.

## Operators by Categories ##

<table>

   <th>Usage</th><th>Operators</th>
   <tr>
      <td>Creating an observable sequence</td>
      <td>
      <ol>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/create.md">create</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/defer.md">defer</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/generate.md">generate</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/generatewithabsolutetime.nd">generateWithAbsoluteTime</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/generatewithrelativetime.md">generateWithRelativeTime</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/rxobservablerangestart-count-scheduler">range</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/using.md">using</a></li>
      </ol>
      </td>
   </tr>
   <tr>
      <td>Converting events or asynchronous patterns to observable sequences, or between Arrays and observable sequences.</td>
      <td>
    	<ol>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/from.md">from</a></li>
    	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromarray.md">fromArray</a></li>
    	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromcallback.md">fromCallback</a></li>
    	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromnodecallback.md">fromNodeCallback</a></li>
    	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromevent.md">fromEvent</a></li>
    	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromeventpattern.md">fromEventPattern</a></li>
    	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/frompromise.md">fromPromise</a></li>
    	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/of.md">of</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/toarray.md">toArray</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/tomap.md">toMap</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/topromise.md">toPromise</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/toset.md">toSet</a></li>
    	</ol>
      </td>
   </tr>
   <tr>
   <td>
   Combining multiple observable sequences into a single sequence.
   </td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/amb.md">amb</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/ambproto.md">prototype.amb</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/combinelatest.md">combineLatest</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/concat.md">concat</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/concatproto.md">prototype.concat</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/startwith.md">startWith</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/merge.md">merge</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/mergeproto.md">prototype.merge</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/mergeall.md">mergeAll</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/repeat.md">repeat</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/repeatproto.md">prototype.repeat</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/withlatestfrom.md">withLatestFrom</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/zip.md">zip</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/zipproto.md">prototype.zip</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Functional - Sharing Side Effects</td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/let.md">let</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/publish.md">publish</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/publishlast.md">publishLast</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/publishvalue.md">publishValue</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/replay.md">replay</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/share.md">share</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sharelast.md">shareLast</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sharereplay.md">shareReplay</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sharevalue.md">shareValue</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Mathemathical operators on sequences</td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/aggregate.md">aggregate</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/average.md">average</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/count.md">count</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/max.md">max</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/maxby.md">maxBy</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/min.md">min</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/minby.md">minBy</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/reduce.md">reduce</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sum.md">sum</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Time-based operations</td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/debounce.md">debounce</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/debouncewithselector.md">debounceWithSelector</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/delay.md">delay</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/interval.md">interval</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/timeinterval.md">timeInterval</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/timer.md">timer</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/timeout.md">timeout</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/timeoutwithselector.md">timeoutWithSelector</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/timestamp.md">timestamp</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Handling Exceptions</td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/catch.md">catch</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/catchproto.md">prototype.catch</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/finally.md">finally</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/onerrorresumenext.md">onErrorResumenext</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/onerrorresumenextproto.md">prototype.onErrorResumeNext</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/retry.md">retry</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Filtering and selecting values in a sequence</td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/concatmap.md">concatMap</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/concatmapobserver.md">concatMapObserver</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/elementat.md">elementAt</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/elementatordefault.md">elementAtOrDefault</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/where.md">filter</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/selectmany.md">flatMap</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/flatmaplatest.md">flatMapLatest</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/flatmapobserver.md">flatMapObserver</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/find.md">find</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/findindex.md">findIndex</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/first.md">first</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/firstordefault.md">firstOrDefault</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/includes.md">includes</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/last.md">last</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/lastordefault.md">lastOrDefault</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/select.md">map</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/pluck.md">pluck</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/select.md">select</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/concatmap.md">selectConcat</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/selectmany.md">selectMany</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/selectmanyobserver.md">selectManyObserver</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/flatmaplatest.md">selectSwitch</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/single.md">single</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/singleordefault.md">singleOrDefault</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/skip.md">skip</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/skiplast.md">skipLast</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/skiplastwithtime.md">skipLastWithTime</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/skipuntil.md">skipUntil</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/skipwhile.md">skipWhile</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/take.md">take</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/takelast.md">takeLast</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/takelastbuffer.md">takeLastBuffer</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/takelastbufferwithtime.md">takeLastBufferWithTime</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/takelastwithtime.md">takeLastWithTime</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/takewhile.md">takeWhile</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/where.md">where</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Grouping and Windowing</td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/buffer.md">buffer</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/bufferiwthcount.md">bufferWithCount</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/bufferwithtimeorcount.md">bufferWithTimeOrCount</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/groupby.md">groupBy</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/groupbyuntil.md">groupByUntil</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/groupjoin.md">groupJoin</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/join.md">join</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/window.md">window</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/windowwithcount.md">windowWithCount</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/windowwithtime.md">windowWithTime</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/windowwithtimeorcount.md">windowWithTimeOrCount</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Imperative Operators</td>
   <td>
   <ol>
  <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/case.md">case</a></li>
  <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/do.md">do</a></li>
  <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/doonnext.md">doOnNext</a></li>
  <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/doonerror.md">doOnError</a></li>
  <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/dooncompleted.md">doOnCompleted</a></li>
  <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/dowhile.md">doWhile</a></li>
  <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/for.md">for</a></li>
  <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/if.md">if</a></li>
  <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/do.md">tap</a></li>
  <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/doonnext.md">tapOnNext</a></li>
  <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/doonerror.md">tapOnError</a></li>
  <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/dooncompleted.md">tapOnCompleted</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/while.md">while</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Primitives</td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/empty.md">empty</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/never.md">never</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/return.md">return</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/throw.md">throw</a></li>
   </ol>
   </td>
   </tr>
</table>

## See Also ##

*Reference*
 - [`Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)

*Concepts*
- [Querying Observable Sequences](querying.md)
