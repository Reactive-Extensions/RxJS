# Operators by Categories #

This topic lists all major operators implemented by the [`Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md) type by their categories, specifically: creation, conversion, combine, functional, mathematical, time, exceptions, miscellaneous, selection and primitives.

## Operators by Categories ##

<table>

   <th>Usage</th><th>Operators</th>
   <tr>
      <td>Creating an observable sequence</td>
      <td>
      <ol>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablecreatesubscribe">create</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablecreatewithdisposablesubscribe">createWithDisposable</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservabledeferobservablefactory">defer</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablegenerateinitialstate-condition-iterate-resultselector-scheduler">generate</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablegeneratewithabsolutetimeinitialstate-condition-iterate-resultselector-timeselector-scheduler">generateWithAbsoluteTime</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablegenerateinitialstate-condition-iterate-resultselector-scheduler">generateWithRelativeTime</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablerangestart-count-scheduler">range</a></li>
      <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableusingresourcefactory-observablefactory">using</a></li>
      </ol>
      </td>
   </tr>
   <tr>
      <td>Converting events or asynchronous patterns to observable sequences, or between Arrays and observable sequences.</td>
      <td>
      	<ol>
      	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefromarrayarray-scheduler">fromArray</a></li>
      	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefromcallbackfunc-scheduler-context">fromCallback</a></li>
      	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefromnodecallbackfunc-scheduler-context">fromNodeCallback</a></li>
      	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefromeventelement-eventname">fromEvent</a></li>
      	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefromeventpatternaddhandler-removehandler">fromEventPattern</a></li>
      	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablefrompromisepromise">fromPromise</a></li>
      	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypetoarray">toArray</a></li>
      	</ol>
      </td>
   </tr>
   <tr>
   <td>
   Combining multiple observable sequences into a single sequence.
   </td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableambargs">amb</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeambrightsource">prototype.amb</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypecombinelatestargs-resultselector">combineLatest</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableconcatargs">concat</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeambrightsource">prototype.concat</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypestartwithscheduler-args">startWith</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablemergescheduler-args">merge</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypemergemaxconcurrent--other">prototype.merge</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypemergeobservable">mergeObservable</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablerepeatvalue-repeatcount-scheduler">repeat</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototyperepeatrepeatcount">prototype.repeat</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.m#rxobservableambargs">zip</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypezipargs-resultselector">prototype.zip</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Functional</td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeletfunc">let</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypepublishselector">publish</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypepublishlatestselector">publishLast</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypereplayselector-buffersize-window-scheduler">replay</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Mathemathical operators on sequences</td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeaggregateseed-accumulator">aggregate</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeaverageselector">average</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypecountpredicate">count</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypemaxcomparer">max</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypemaxbykeyselector-comparer">maxBy</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypemincomparer">min</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeminbykeyselector-comparer">minBy</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypereduceaccumulator-seed">reduce</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypesumkeyselector-thisarg">sum</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Time-based operations</td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypedelayduetime-scheduler">delay</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableintervalperiod-scheduler">interval</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypethrottleduetime-scheduler">throttle</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypethrottlewithselectorthrottleselector">throttleWithSelector</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypetimeintervalscheduler">timeInterval</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservabletimerduetime-period-scheduler">timer</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypetimeoutduetime-other-scheduler">timeoutWithSelector</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypetimestampscheduler">timestamp</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Handling Exceptions</td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablecatchargs">catch</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypecatchsecond--handler">prototype.catch</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypefinallyaction">finally</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableonerrorresumenextargs">onErrorResumenext</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeonerrorresumenextsecond">prototype.onErrorResumeNext</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototyperetryretrycount">retry</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Filtering and selecting values in a sequence</td>
   <td>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeelementatindex">elementAt</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeelementatordefaultindex-defaultvalue">elementAtOrDefault</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypefilterpredicate-thisarg">filter</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeflatmapselector-resultselector">flatMap</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeflatmaplatestselector-thisarg">flatMapLatest</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypefirstpredicate-thisarg">first</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypefirstordefaultpredicate-defaultvalue-thisarg">firstOrDefault</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypefindpredicate-thisarg">find</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypefindindexpredicate-thisarg">findIndex</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypelastpredicate-thisarg">last</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypelastordefaultpredicate-defaultvalue-thisarg">lastOrDefault</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypemapselector-thisarg">map</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypepluckproperty">pluck</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeselectselector-thisarg">select</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeselectmanyselector-resultselector">selectMany</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeselectswitchselector-thisarg">selectSwitch</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypesinglepredicate-thisarg">single</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypesingleordefaultpredicate-defaultvalue-thisarg">singleOrDefault</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeskipcount">skip</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeskiplastcount">skipLast</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeskiplastwithtimeduration">skipLastWithTime</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeskipuntilother">skipUntil</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypeskipwhilepredicate-thisarg">skipWhile</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypetakecount-scheduler">take</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypetakelastcount">takeLast</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypetakelastbuffercount">takeLastBuffer</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypetakelastbufferwithtimeduration-scheduler">takeLastBufferWithTime</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypetakelastwithtimeduration-timescheduler-loopscheduler">takeLastWithTime</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypetakewhilepredicate-thisarg">takeWhile</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypewherepredicate-thisarg">where</a></li>
   </td>
   </tr>
   <tr>
   <td>Grouping and Windowing</td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypebufferbufferopenings-bufferboundaries-bufferclosingselector">buffer</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypebufferwithcountcount-skip">bufferWithCount</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypebufferwithtimetimespan-timeshift--scheduler-scheduler">bufferWithTimeOrCount</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypegroupbykeyselector-elementselector-keyserializer">groupBy</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypegroupbyuntilkeyselector-elementselector-durationselector-keyserializer">groupByUntil</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypegroupjoinright-leftdurationselector-rightdurationselector-resultselector">groupJoin</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypejoinright-leftdurationselector-rightdurationselector-resultselector">join</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypewindowwindowopenings-windowboundaries-windowclosingselector">window</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypewindowwithcountcount-skip">windowWithCount</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypewindowwithtimetimespan-timeshift--scheduler">windowWithTime</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypewindowwithtimeorcounttimespan-count-scheduler">windowWithTimeOrCount</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Imperative Operators</td>
   <td>
   <ol>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablecaseselector-sources-elsesourcescheduler">case</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypedoobserver--onnext-onerror-oncompleted">do</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypedowhilecondition-source">doWhile</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableforsources-resultselector">for</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableifcondition-thensource-elsesource">if</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablewhilecondition-source">while</a></li>
   </ol>
   </td>
   </tr>
   <tr>
   <td>Primitives</td>
   <td>
   <ol>
    <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableemptyscheduler">empty</a></li>   
    <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablenever">never</a></li>   
 	<li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablereturnvalue-scheduler">return</a></li>
   <li><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservablethrowexception-scheduler">throw</a></li> 	
   </ol>
   </td>
   </tr>
</table>

## See Also ##

*Reference*
 - [`Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)

*Concepts*
- [Querying Observable Sequences](querying.md)