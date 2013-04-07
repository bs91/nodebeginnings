// Unpause the stdin stream.
process.stdin.resume(); // this is paused by default and basically we need it on so that the child process can receive messages from the parent process.
process.stdin.on('data', function(data) {
  var number;
  try {
    // parse the input into a number
    number = parseInt(data.toString(), 10);
    // increment
    number += 1;
    // ouput number
    process.stdout.write(number + "\n");
  } catch(err) {
    process.stderr.write(err.message + "\n");
  }
});
