# Which Operator to Use? - Creation Operators #

Use this page to find the creation operator implemented by the [`Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md) type that fits your needs:

<table>
<thead>Static methods</thead>
<tbody>
    <!-- Observable factories -->
    <tr>
        <td rowspan="26">I want to create a new sequence</td>
        <td rowspan="4">using custom logic</td>
        <td colspan="2"></td>
        <td>
            <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/create.md">Observable.create</a>
        </td>
    </tr>
    <tr>
        <td rowspan="3">that works like a for-loop</td>
        <td></td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/generate.md">Observable.generate</a></td>
    </tr>
    <tr>
        <td rowspan="2">and emits the values over time</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/generatewithrelativetime.md">Observable.generateWithRelativeTime</a></td>
    </tr>
    <tr>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/generatewithabsolutetime.md">Observable.generateWithAbsoluteTime</a></td>
    </tr>
    <tr>
        <td rowspan="2">that returns a value</td>
        <td colspan="2"></td>
        <td>
            <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/return.md">Observable.return/just</a>
        </td>
    </tr>
    <tr>
        <td colspan="2">multiple times</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/repeat.md">Observable.repeat</a></td>
    </tr>
    <tr>
        <td colspan="3">that throws an error</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/throw.md">Observable.throw</a></td>
    </tr>
    <tr>
        <td colspan="3">that completes</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/empty.md">Observable.empty</a></td>
    </tr>
    <tr>
        <td colspan="3">that never does anything</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/never.md">Observable.never</a></td>
    </tr>
    <tr>
        <td rowspan="2">from an event</td>
        <td colspan="2"></td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromevent.md">Observable.fromEvent</a></td>
    </tr>
    <tr>
        <td colspan="2">that uses custom functions to add and remove event handlers</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromeventpattern.md">Observable.fromEventPattern</a></td>
    </tr>
    <tr>
        <td colspan="3">from an <a title="ES6 Promise" href="https://www.promisejs.org">ES6 Promise</a></td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/frompromise.md">Observable.fromPromise</a></td>
    </tr>
    <tr>
        <td rowspan="6">that iterates</td>
        <td rowspan="2">over the values in an array</td>
        <td></td>
        <td>
            <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromarray.md">Observable.fromArray</a><br>
        </td>
    </tr>
    <tr>
      <td>of object key/values</td>
      <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/pairs.md">Observable.pairs</a></td>
    </tr>
    <tr>
        <td>of asynchronous elements</td>
        <td></td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/for.md">Observable.for</a></td>
    </tr>
    <tr>
        <td colspan="2">over values in a numeric range</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/range.md">Observable.range</a></td>
    </tr>
    <tr>
        <td colspan="2">over the values in an iterable, array or array-like object</a></td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/from.md">Observable.from</a></td>
    </tr>
    <tr>
        <td colspan="2">over arguments</a></td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/of.md">Observable.of</a></td>
    </tr>
    <tr>
        <td rowspan="2">that emits values on a timer</td>
        <td colspan="2"></td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/interval.md">Observable.interval</a></td>
    </tr>
    <tr>
        <td colspan="2">with an optional initial delay</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/timer.md">Observable.timer</a></td>
    </tr>
    <tr>
        <td rowspan="2" colspan="2">that calls a function with no arguments</td>
        <td>on a specific scheduler</td>
        <td>
            <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/start.md">Observable.start</a>
        </td>
    </tr>
    <tr>
        <td>asynchronously</td>
        <td>
            <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/startasync.md">Observable.startAsync</a>
        </td>
    </tr>
    <tr>
        <td rowspan="4">decided at subscribe-time</td>
        <td colspan="2">based on a boolean condition</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/if.md">Observable.if</a></td>
    </tr>
    <tr>
        <td colspan="2">from a pre-set set of sequences</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/case.md">Observable.case</a></td>
    </tr>
    <tr>
        <td colspan="1" rowspan="2">using custom logic</td>
        <td></td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/defer.md">Observable.defer</a></td>
    </tr>
    <tr>
        <td>that depends on a resource</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/using.md">Observable.using</a></td>
    </tr>
    <!-- Function factories -->
    <tr>
        <td rowspan="3">I want to wrap a function</td>
        <td colspan="2"></td>
        <td rowspan="3">and yield the result in a sequence</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/toasync.md">Observable.toAsync</a></td>
    </tr>
        <td colspan="2">which accepts a callback</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromcallback.md">Observable.fromCallback</a></td>
    </tr>
    <tr>
        <td colspan="2">which accepts a Node.js callback</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromnodecallback.md">Observable.fromNodeCallback</a></td>
    </tr>
    <!-- Flatteners -->
    <tr>
        <td rowspan="30">I want to combine multiple sequences</td>
        <td colspan="3">and only receive values from the sequence that yields a value first</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/amb.md">Observable.amb</a></td>
    </tr>
    <tr>
        <td colspan="3">and be notified when all of them have finished</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/forkjoin.md">Observable.forkJoin</a></td>
    </tr>
    <tr>
        <td colspan="3">and output the values from all of them</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/merge.md">Observable.merge</a></td>
    </tr>
    <tr>
        <td rowspan="2">in order</td>
        <td colspan="2">reusing the latest value when unchanged</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/combinelatest.md">Observable.combineLatest</a></td>
    </tr>
    <tr>
        <td colspan="2">using each value only once</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/zip.md">Observable.zip</a></td>
    </tr>
    <tr>
        <td rowspan="3">by subscribing to each in order</td>
        <td colspan="2">when the previous sequence completes</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/concat.md">Observable.concat</a></td>
    </tr>
    <tr>
        <td colspan="2">when the previous sequence errors</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/catch.md">Observable.catch</a></td>
    </tr>
    <tr>
        <td colspan="2">regardless of whether the previous sequence completes or errors</td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/onerrorresumenext.md">Observable.onErrorResumeNext</a></td>
    </tr>
    <tr>
        <td colspan="3">by responding to different combinations of values <a href="http://en.wikipedia.org/wiki/Join-calculus">(join calculus)</a></td>
        <td><a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/when.md">Observable.when</a></td>
    </tr>
</tbody></table>

## See Also ##

*Reference*
 - [`Observable`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)

*Concepts*
- [Querying Observable Sequences](querying.md)
- [Operators By Category](categories.md)
