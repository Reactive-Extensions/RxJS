var Rx = require('../../.');
var Observable = Rx.Observable;
var fileserver = require('./fileserver');

function getStockData(data, scheduler) {
  var dataLength = data.length;
  var rowLength = data[0].length;
  scheduler || (scheduler = Rx.Scheduler['default']);
  return Observable.create(function (observer) {
    return scheduler.scheduleRecursiveFuture(rowLength - 1, 1000, function (currentRow, recurse) {
      var results = [];
      for (var i = 0; i < dataLength; i++) {
        results.push(data[i][currentRow]);
      }
      currentRow--;
      observer.onNext(results);
      if (currentRow === 0) {
        observer.onCompleted();
      } else {
        recurse(currentRow, 1000);
      }
    });
  });
}

var source = getStockData(fileserver.loadData()).share();

var groupedTickStream = source
  .flatMap(function (value) {
    var date = new Date().getTime();

    return Observable.from(value).tap(function(x) {
      x.timestamp = date;
    });
  })
  .groupBy(function (quote) {
    return quote.symbol;
  })
  .share();

// if there is a spike in the price, render that as a circle
groupedTickStream
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
    console.log('Symbol:' , x.symbol , 'had a price spike of ',
      Math.round(x.spike * 100) , '% on',
      new Date(x.timestamp) , 'with close of $' , x.lastClose);
  }, function (err) {
    console.log(err.stack);
  });
