$(function () {

    // Make a simple binding
    var label1 = document.querySelector('#label1');
    var hello = new Rx.BehaviorSubject('Hello');
    hello.subscribe(function (text) {
        label1.textContent = text;
    });

    // Create simple bindings for first and last name
    var firstName1 = new Rx.BehaviorSubject('');
    var lastName1 = new Rx.BehaviorSubject('');

    // Create first and last name composite
    var fullName1 = firstName1.combineLatest(lastName1, function (first, last) {
        return first + ' ' + last;
    });

    // Subscribe to them all
    var fn1 = document.querySelector('#firstName1');
    firstName1.subscribe(function (text) { fn1.value = text });

    var ln1 = document.querySelector('#lastName1');
    lastName1.subscribe(function (text) { ln1.value = text });

    var full1 = document.querySelector('#fullName1');
    fullName1.subscribe(function (text) { full1.value = text });

    // Create two way bindings for both first name and last name
    Rx.Observable.fromEvent(fn1, 'keyup')
        .subscribe(function (e) { firstName1.onNext(e.target.value); })

    Rx.Observable.fromEvent(ln1, 'keyup')
        .subscribe(function (e) { lastName1.onNext(e.target.value); })

});
