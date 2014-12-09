// Run with "tessel run blinky.js"

// Import the interface to Tessel hardware
var tessel = require('tessel');

// Must use lite compat due to https://github.com/tessel/runtime/issues/658
var Observable = require('../../dist/rx.lite.compat').Observable;

// Set the led pins as outputs with initial states
// Truthy initial state sets the pin high
// Falsy sets it low.
var led1 = tessel.led[0].output(1);
var led2 = tessel.led[1].output(0);

Observable.interval(100)
  .subscribe(function () {
    console.log('first blinks');
    led1.toggle();
  });

Observable.interval(150)
  .subscribe(function () {
    console.log('second blinks');
    led2.toggle();
  });
