var net = require('net');
var server = net.createServer();
var sockets = []; // Since it's a chat server we want a central place to keep track of all the connections.


server.on('connection', function(socket) {
  console.log('got a new connection');
  var identifier = 'user' + sockets.length.toString();
  sockets.push([identifier, socket]);
  sockets.forEach(function(otherSocket) {
    otherSocket[1].write(identifier + " has connected!\n");
  });

  socket.on('data', function(data) {
    console.log(identifier + ': ' +  data.toString());

    sockets.forEach(function(otherSocket) {
      if (otherSocket[1] !== socket) {
        otherSocket[1].write(identifier.toString() + ": " +  data.toString());
      }
    });
  });
  
  socket.on('close', function() {
    console.log('connection closed');
    var index = sockets.indexOf(socket);
    sockets.splice(index, 1);
    sockets.forEach(function(otherSocket) {
      otherSocket[1].write(identifier.toString() + " has disconnected!");
    });
  });

  socket.on('error', function(err) {
    throw err;
  });
});

server.on('error', function(err) {
  console.log('Server error:', err.message);
});

server.on('close', function() {
  console.log('Server closed');
});

server.listen(4001);
