var Rx = require('../../.');
var Observable = Rx.Observable;
var fileserver = require('./fileserver');

function getStockData(data, scheduler) {
  var dataLength = data.length;
  var rowLength = data[0].length;
  scheduler || (scheduler = Rx.Scheduler.timeout);
  return Observable.create(function (observer) {
    var currentRow = rowLength - 1;

    return scheduler.scheduleRecursiveWithRelative(1000, function (self) {
      var results = [];
      for (var i = 0; i < dataLength; i++) {
          results.push(data[i][currentRow]);
      }
      currentRow--;
      observer.onNext(results);
      if (currentRow === 0) {
        observer.onCompleted();
      } else {
        self(1000);
      }
    });
  });
}

// Calculate averages/max/min per buffer
function calculate(t) {
  var len = t.buffer.length,
      averageVolume = 0,
      averageClose = 0,
      averageHigh = 0,
      averageLow = 0,
      maxVolume = 0,
      maxClose = 0,
      maxHigh = 0,
      maxLow = Math.pow(2, 53) - 1;

  for (var i = 0; i < len; i++) {
    var current = t.buffer[i];
    var high = parseInt(current.high);
    var low = parseInt(current.low);
    var close = parseInt(current.close);
    var volume = parseInt(current.volume);

    if (volume > maxVolume) maxVolume = volume;
    if (close > maxClose) maxClose = close;
    if (high > maxHigh) maxHigh = high;
    if (low < maxLow) maxLow = low;

    averageVolume += volume;
    averageClose += close;
    averageHigh += high;
    averageLow += low;
  }

  // Calculate averages
  averageVolume = averageVolume / len;
  averageClose = averageClose / len;
  averageHigh = averageHigh / len;
  averageLow = averageLow / len;

  return {
    timestamp: t.buffer[len - 1].timestamp,
    symbol: t.stockStream.key,
    firstClose: t.buffer[0].close,
    lastClose: t.buffer[len - 1].close,
    firstDate: t.buffer[0].date,
    lastDate: t.buffer[len - 1].date,
    averageVolume: averageVolume,
    averageClose: averageClose,
    averageHigh: averageHigh,
    averageLow: averageLow,
    maxVolume: maxVolume,
    maxClose: maxClose,
    maxHigh: maxHigh,
    maxLow: maxLow
  };
}

var source = getStockData(fileserver.loadData()).share();

var groupedTickStream = source
  .flatMap(function (value) {
    var data = JSON.parse(value.data),
        date = new Date().getTime();

    return Observable.from(data).tap(function(x) {
      x.timestamp = date;
    });
  })
  .groupBy(function (quote) {
    return quote.symbol;
  })
  .share();

// Define a stream grouped by a 5 day window with a 1 day skip
var stream = groupedTickStream
  .flatMap(
    function(stockStream) {
      return stockStream.bufferWithCount(5, 1);
    },
    function(stockStream, buffer) {
      return { stockStream: stockStream, buffer: buffer };
    })
  .filter(function(t) {
    return t.buffer.length === 5;
  })
  .map(calculate)
  .share();

// if there is a spike in the price, render that as a circle
var spikes = groupedTickStream
  .flatMap(
    function (stockStream) {
      // Get the previous day and current day
      return stockStream.bufferWithCount(2, 1);
    },
    function (stockStream, buffer) {
      // Project forward the symbol, timestamp and buffer
      var len = buffer.length;
      return {
        symbol: stockStream.key,
        timestamp: buffer[len - 1].timestamp,
        buffer: buffer
      };
  })
  .filter(function (x) {
    return x.buffer.length === 2;
  })
  .tap(function (x) {
    // Project forward the first close, last close and spike
    x.firstClose = x.buffer[0].close;
    x.lastClose = x.buffer[1].close;
    x.spike = (x.lastClose - x.firstClose) / x.firstClose;
  })
  .filter(function (x) {
    return Math.abs(x.spike) >= 0.1;
  })
  .subscribe(function (x) {
    console.log('Symbol: ' + x.symbol + ' had a price spike of ' + x.spike + ' on ' + x.timestamp + ' with close of ' + x.lastClose);
  }, function (err) {
    console.log(err);
  });
