var spawn = require('child_process').spawn;

// launch a child process
var child = spawn('tail', ['-f', './log.log']);

child.stdout.on('data', function(data) {
  console.log('tail output: ' + data);
});

child.stderr.on('data', function(data) {
  console.log('tail error output: ' + data);
});
