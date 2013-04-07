var child_process = require('child_process'); // Gets us the child process stuff, you shouldn't use this object directly yo.
var exec = child_process.exec;
//exec(command, options, callback);
var options = { 'encoding': 'utf8',
  'timeout': 0,
  'maxBuffer': 200*1024,
  'killSignal': 'SIGTERM',
  'cwd': null,
  'env': null };
// You can exec any linux command creating removing files, or doing things that produc stdout. If you create/remove it will just return null stdout and perform the operation.
exec('ls -al', function(err, stdout, stderr) {
  if (err) { throw err; }
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
});

// If you would like to change environment variables for a child process:
// Copy the actual environment variables into a new object
var env = process.env,
    varName,
    envCopy = {};
    for (varName in env) {
      envCopy[varName] = env[varName];
    }
// assign custom variables
envCopy['CUSTOM ENV VAR'] = 'some value';
envCopy['CUSTOM ENV VAR2'] = 'some other value';
// Execute some command with process.env and my custom variables
exec('ls -la', {env: envCopy }, function( err, stdout, stderr) {
  if (err) { throw err; }
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
});
    
