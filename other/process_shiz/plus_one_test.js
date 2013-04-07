var spawn = require('child_process').spawn;

// Spawn child node to execute plus_one.js
var child = spawn('node', ['plus_one.js']);

// Call this function every 1 second (1000 milliseconds)
setInterval(function() {
  // Create random number
  var number = Math.floor(Math.random() * 10000);
  // Send number to child process.
  child.stdin.write(number.toString()); // Have to send in a string or you will have an invalid datatype error.
  // Get response from child and print it
  child.stdout.once('data', function(data) {
    console.log('number: ' + number);
    console.log('resonse: ' + data);
  });
}, 1000);
child.stderr.on('data', function(data) {
  process.stdout.write(data);
});
