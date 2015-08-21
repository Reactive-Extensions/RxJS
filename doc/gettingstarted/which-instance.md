# Which Operator to Use? - Instance Operators #

Use this page to find the instance operator implemented by the [`Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md) type that fits your needs:

<table>
<thead>Instance methods</thead>
<tbody>
    <!-- Observable operators -->
    <tr>
        <td rowspan="71">Using an existing sequence</td>
        <td colspan="3">I want to change each value</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/select.md">map/select</a></td>
    </tr>
    <tr>
        <td colspan="3">I want to pull a property off each value</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/pluck.md">pluck</a></td>
    </tr>
    <tr>
        <td colspan="3">I want to be notified of values without affecting them</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/do.md">do/tap</a><br>
            <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/doonnext.md">doOnNext/tapOnNext</a><br>
            <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/doonerror.md">doOnError/tapOnError</a><br>
            <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/dooncompleted.md">doOnCompleted/tapOnCompleted</a></td>
    </tr>
    <tr>
        <td rowspan="6">I want to include values</td>
        <td colspan="2">based on custom logic</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/where.md">filter/where</a></td>
    </tr>
    <tr>
        <td rowspan="2">from the start of the sequence</td>
        <td></td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/take.md">take</a></td>
    </tr>
    <tr>
        <td>based on custom logic</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/takewhile.md">takeWhile</a></td>
    </tr>
    <tr>
    </tr>
    <tr>
        <td colspan="2">from the end of the sequence</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/takelast.md">takeLast</a></td>
    </tr>
    <tr>
        <td colspan="2">until another sequence emits a value or completes</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/takeuntil.md">takeUntil</a></td>
    </tr>
    <tr>
        <td rowspan="7">I want to ignore values</td>
        <td colspan="2">altogether</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/ignoreelements.md">ignoreElements</a></td>
    </tr>
    <tr>
        <td rowspan="2">from the start of the sequence</td>
        <td></td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/skip.md">skip</a></td>
    </tr>
    <tr>
        <td>based on custom logic</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/skipwhile.md">skipWhile</a></td>
    </tr>
    <tr>
        <td colspan="2">from the end of the sequence</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/skiplast.md">skipLast</a></td>
    </tr>
    <tr>
        <td colspan="2">until another sequence emits a value</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/skipuntil.md">skipUntil</a></td>
    </tr>
    <tr>
        <td colspan="2">that have the same value as the previous</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/distinctuntilchanged.md">distinctUntilChanged</a></td>
    </tr>
    <tr>
        <td colspan="2">that occur too frequently</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/throttle.md">throttle</a></td>
    </tr>
    <tr>
        <td rowspan="4">I want to compute</td>
        <td>the sum</td>
        <td rowspan="2">of its values</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sum.md">sum</a></td>
    </tr>
    <tr>
        <td>the average</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/average.md">average</a></td>
    </tr>
    <tr>
        <td rowspan="2">using custom logic</td>
        <td>and only output the final value</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/aggregate.md">aggregate</a><br>
            <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/reduce.md">reduce</a>
        </td>
    </tr>
    <tr>
        <td>and output the values as they are calculated</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/scan.md">scan</a></td>
    </tr>
    <tr>
        <td rowspan="3">I want to wrap its messages with metadata</td>
        <td colspan="2">that describes each message</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/materialize.md">materialize</a></td>
    </tr>
    <tr>
        <td colspan="2">that includes the time past since the last value</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/timeinterval.md">timeInterval</a></td>
    </tr>
    <tr>
        <td colspan="2">that includes a timestamp</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/timestamp.md">timestamp</a></td>
    </tr>
    <tr>
        <td rowspan="2">after a period of inactivity</td>
        <td colspan="2">I want to throw an error</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/timeout.md">timeout</a></td>
    </tr>
    <tr>
        <td colspan="2">I want to switch to another sequence</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/timeout.md">timeout</a></td>
    </tr>
    <tr>
        <td rowspan="2">I want ensure there is only one value</td>
        <td colspan="2">and throw an error if there are more or less than one value</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/single.md">single</a></td>
    </tr>
    <tr>
        <td colspan="2">and use the default value if there are no values</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/singleordefault.md">singleOrDefault</a></td>
    </tr>
    <tr>
        <td rowspan="3">I want to only take the first value</td>
        <td colspan="2">and throw an error if there are no values</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/first.md">first</a></td>
    </tr>
    <tr>
        <td colspan="2">and use the default value if there are no values</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/firstordefault.md">firstOrDefault</a></td>
    </tr>
    <tr>
        <td colspan="2">within a time period</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sample.md">sample</a></td>
    </tr>
    <tr>
        <td rowspan="2">I want to only take the last value</td>
        <td colspan="2">and error if there are no values</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/last.md">last</a></td>
    </tr>
    <tr>
        <td colspan="2">and use the default value if there are no values</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/lastordefault.md">lastOrDefault</a></td>
    </tr>
    <tr>
        <td colspan="3">I want to know how many values it contains</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/count.md">count</a></td>
    </tr>
    <tr>
        <td colspan="3">I want to know if it includes a value</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/includes.md">contains</a></td>
    </tr>
    <tr>
        <td rowspan="2">I want to know if a condition is satisfied</td>
        <td colspan="2">by any of its values</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/any.md">any/some</a></td>
    </tr>
    <tr>
        <td colspan="2">by all of its values</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/every.md">all/every</a></td>
    </tr>
    <tr>
        <td rowspan="2" colspan="2">I want to delay messages by a specific amount of time</td>
        <td></td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/delay.md">delay</a></td>
    </tr>
    <tr>
        <td>based on custom logic</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/delaywithselector.md">delayWithSelector</a></td>
    </tr>
    <tr>
        <td rowspan="11">I want to group the values</td>
        <td colspan="2">until the sequence completes</td>
        <td>
          <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/toarray.md">toArray</a><br>
          <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/tomap.md">toMap</a><br>
          <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/toset.md">toSet</a>
        </td>
    </tr>
    <tr>
        <td rowspan="2">using custom logic</td>
        <td>as arrays</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/buffer.md">buffer</a></td>
    </tr>
    <tr>
        <td>as sequences</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/window.md">window</a></td>
    </tr>
    <tr>
        <td rowspan="2">in batches of a particular size</td>
        <td>as arrays</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/bufferwithcount.md">bufferWithCount</a></td>
    </tr>
    <tr>
        <td>as sequences</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/windowwithcount.md">windowWithCount</a></td>
    </tr>
    <tr>
        <td rowspan="2">based on time</td>
        <td>as arrays</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/bufferwithtime.md">bufferWithTime</a></td>
    </tr>
    <tr>
        <td>as sequences</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/windowwithtime.md">windowWithTime</a></td>
    </tr>
    <tr>
        <td rowspan="2">based on time or count, whichever happens first</td>
        <td>as arrays</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/bufferwithtimeorcount.md">bufferWithTimeOrCount</a></td>
    </tr>
    <tr>
        <td>as sequences</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/windowwithtimeorcount.md">windowWithTimeOrCount</a></td>
    </tr>
    <tr>
        <td rowspan="2">based on a key</td>
        <td>until the sequence completes</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/groupby.md">groupBy</a></td>
    </tr>
    <tr>
        <td>and control the lifetime of each group</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/groupbyuntil.md">groupByUntil</a></td>
    </tr>
    <tr>
        <td rowspan="6">I want to start a new sequence for each value</td>
        <td colspan="2">and emit the values from all sequences in parallel</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/selectmany.md">flatMap/selectMany</a></td>
    </tr>
    <tr>
        <td colspan="2">and emit the values from each sequence in order</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/concatmap.md">concatMap/selectConcat</a></td>
    </tr>
    <tr>
        <td colspan="2">and cancel the previous sequence when a new value arrives</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/flatmaplatest.md">flatMapLatest/selectSwitch</a></td>
    </tr>
    <tr>
        <td colspan="2">and recursively start a new sequence for each new value</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/expand.md">expand</a></td>
    </tr>
    <tr>
        <td colspan="2">and emit values from all sequences depending for onNext, onError, and onCompleted in parallel</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/flatmapobserver.md">flatMapObserver/selectManyObserver</a></td>
    </tr>
    <tr>
        <td colspan="2">and emit values from all sequences depending for onNext, onError, and onCompleted in order</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/flatmapobserver.md">concatMapObserver/selectConcatObserver</a></td>
    </tr>
    <tr>
        <td>I want to combine it with another</td>
        <td colspan="2">And be notified when both have completed</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/forkjoin.md">forkJoin</a></td>
    </tr>
    <tr>
        <td colspan="3">I want to perform complex operations without breaking the fluent calls</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/let.md">let</a></td>
    </tr>
    <tr>
        <td rowspan="5">I want to share a subscription between multiple subscribers</td>
        <td colspan="2">using a specific subject implementation</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/multicast.md">multicast</a></td>
    </tr>
    <tr>
        <td colspan="2"></td>
        <td>
          <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/publish.md">publish</a><br>
          <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/share.md">share</a>
        </td>
    </tr>
    <tr>
        <td colspan="2">and suppy the last value to future subscribers</td>
        <td>
          <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/publishlast.md">publishLast</a><br>
          <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sharelast.md">shareLast</a>
        </td>
    </tr>
    <tr>
        <td colspan="2">and replay a default or the latest value to future subscribers</td>
        <td>
          <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/publishvalue.md">publishValue</a><br>
          <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sharevalue.md">shareValue</a>
        </td>
    </tr>
    <tr>
        <td colspan="2">and replay <em>n</em> number of values to future subscribers</td>
        <td>
          <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/replay.md">replay</a><br>
          <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sharereplay.md">shareReplay</a>
        </td>
    </tr>
    <tr>
        <td rowspan="3">when an error occurs</td>
        <td colspan="2">I want to re-subscribe</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/retry.md">retry</a></td>
    </tr>
    <tr>
        <td rowspan="2">I want to start a new sequence</td>
        <td></td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/catchproto.md">catch</a></td>
    </tr>
    <tr>
        <td>that depends on the error</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/catchproto.md">catch</a></td>
    </tr>
    <tr>
        <td rowspan="2">when it completes</td>
        <td colspan="2">I want to re-subscribe</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/repeatproto.md">repeat</a></td>
    </tr>
    <tr>
        <td colspan="2">I want to start a new sequence</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/concatproto.md">concat</a></td>
    </tr>
    <tr>
        <td>when it completes or errors</td>
        <td colspan="2">I want to start a new sequence</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/onerrorresumenextproto.md">onErrorResumeNext</a></td>
    </tr>
    <tr>
        <td>when it completes, errors or unsubscribes</td>
        <td colspan="2">I want to execute a function</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/finally.md">finally</a></td>
    </tr>
    <tr>
        <td rowspan="2">I want to change the scheduler that routes</td>
        <td colspan="2">calls to subscribe</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/subscribeon.md">subscribeOn</a></td>
    </tr>
    <tr>
        <td colspan="2">messages</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/observeon.md">observeOn</a></td>
    </tr>
    <tr>
        <td rowspan="9">Using two sequences</td>
        <td>I want to decide which to receive values from</td>
        <td colspan="2">based on which one has values first</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/ambproto.md">amb</a></td>
    </tr>
    <tr>
        <td colspan="3">I want to determine if their values are equal</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sequenceequal.md">sequenceEqual</a></td>
    </tr>
    <tr>
        <td rowspan="5">I want to combine their values</td>
        <td colspan="2">only when the first sequence emits, using the latest value from each</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/withlatestfrom.md">withLatestFrom</a></td>
    </tr>
    <tr>
        <td rowspan="2">in order</td>
        <td>reusing the latest value when unchanged</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/combinelatestproto.md">combineLatest</a></td>
    </tr>
    <tr>
        <td>using each value only once</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/zipproto.md">zip</a></td>
    </tr>
    <tr>
        <td rowspan="2">that share overlapping “lifetime” that I choose</td>
        <td>and be notified for each combination</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/join.md">join</a></td>
    </tr>
    <tr>
        <td>and be given a sequence of “rights” for each “left”</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/groupjoin.md">groupJoin</a></td>
    </tr>
    <tr>
        <td colspan="3">I want to include values from both</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/mergeproto.md">merge</a></td>
    </tr>
</tbody></table>

## See Also ##

*Reference*
 - [`Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)

*Concepts*
- [Querying Observable Sequences](querying.md)
- [Operators By Category](categories.md)
