var WebSocketServer = require('websocket').server;
var http = require('http');
var fileserver = require('./fileserver');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  return true;
}

var data = fileserver.loadData();
var dataLength = data.length;
var rowLength = data[0].length;

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('stock-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    var currentRow = rowLength - 1;
    var id = setInterval(function () {

        var results = [];
        for (var i = 0; i < dataLength; i++) {
            results.push(data[i][currentRow]);
        }
        currentRow--;
        connection.sendUTF(JSON.stringify(results));

        if (currentRow === 0) {
            clearInterval(id);
        }        

    }, 1000);

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});