var exec = require('child_process').exec;
var options = { encoding: 'utf8',
                timeout: 0,
                maxBuffer: 200*1024,
                killSignal: 'SIGTERM',
                cwd: null,
                env: {'number' : '123'}};
exec('node child.js', options, function(err, stdout, stderr) {
  if (err) { throw err; }
  console.log('stdout:\n', stdout);
  console.log('stderr:\n', stderr);
});
