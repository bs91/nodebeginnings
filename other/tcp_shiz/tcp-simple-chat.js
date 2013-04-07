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
  }
  return -1
}

function userCommand(cmd, socket, sockets) {
  var params = [];
  if (cmd.indexOf(" ") !== -1) {
    params = cmd.split(" ");
    cmd = params.shift();
  }
  switch (cmd.toString().toLowerCase().trim()) {
    case "help":
      socket.write("nickname <newNick> (changes nickname to new nickname), users (prints a list of who is currently online)\n");
      break;
    case "nickname":
      if (params[0]) {
        var index = socketIndex(sockets, socket);
        console.log(index);
        sockets[index].setName(params[0].toString().trim());
        console.log(sockets);
      }
      else {
        socket.write("You must supply a new nickname, no change has occured.\n");
      }
      break;
    case "users":
      sockets.forEach(function(otherSocket) {
        socket.write(otherSocket.getName().toString() + "\n");
      });
      break;
    default:
      socket.write("That isn't a valid command, try help for a list of commands.\n");
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
  sockets.push(new Socket('user' + id, socket));
  var index = socketIndex(sockets, socket);

  broadcast(socket, sockets,  sockets[index].getName() + " has connected!\n", false);
  socket.write("You can issue commands with cmd: <command>, try help for a list of available commands.\n");
  socket.on('data', function(data) {
    console.log(sockets[index].getName() + ': ' +  data.toString());
    if(data.toString().indexOf('cmd: ') === 0) {
      var command = data.toString().substring(5);
      userCommand(command, socket, sockets);
      return
    }
    broadcast(socket, sockets, sockets[index].getName() + ": " +  data.toString() + "\n", true);
  });
  
  socket.on('close', function() {
    console.log('connection closed');
    broadcast(socket, sockets, sockets[index].getName() + " has disconnected!\n", false);
    sockets.splice(index, 1);
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
