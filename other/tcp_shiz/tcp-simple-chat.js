var net = require('net');
var server = net.createServer();

function Socket(name, socket) {
  this.name = name;
  this.socket = socket;
}

Socket.prototype = {
  constructor: Socket,
  getName:function() {
    return this.name;
  },
  setName:function(newName) {
    this.name = newName;
  },
  getSocket:function() {
    return this.socket;
  },
  setSocket:function(newSocket) {
    this.socket = newSocket;
  }
}
var sockets = [];

function broadcast(socket, sockets, writeData, excludeSelf) {
  sockets.forEach(function(otherSocket) {
    if (excludeSelf) {
      if (otherSocket.getSocket() !== socket) {
        otherSocket.getSocket().write(writeData);
      }
    }
    else {
      otherSocket.getSocket().write(writeData);
    }
  });
}

function socketIndex(sockets, searchItem) {
  for (var i = 0; i < sockets.length; i++) {
    console.log(typeof(searchItem));
    if (typeof(searchItem) === "string") {
      if (sockets[i].getName() === searchItem) {
        return i;
      }
    }
    else {
      if (sockets[i].getSocket() === searchItem) {
        return i;
      }
    }
    return -1;
  }
}

server.on('connection', function(socket) {
  console.log('got a new connection');
  var date = new Date();
  var components = [
    date.getYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  ];
  var id = components.join("");
  var identifier = 'user' + id;

  sockets.push(new Socket(identifier, socket));
  broadcast(socket, sockets, identifier + " has connected!\n", false);

  socket.on('data', function(data) {
    console.log(identifier + ': ' +  data.toString());
    broadcast(socket, sockets, identifier.toString() + ": " +  data.toString(), true);
  });
  
  socket.on('close', function() {
    console.log('connection closed');
    var index = socketIndex(sockets, socket);
    sockets.splice(index, 1);
    broadcast(socket, sockets, identifier.toString() + " has disconnected!\n", false);
  });

  socket.on('error', function(err) {
    console.log(err.message);
  });
});

server.on('error', function(err) {
  console.log('Server error:', err.message);
});

server.on('close', function() {
  console.log('Server closed');
});

server.listen(4001);
