var fs = require('fs');
fs.open('./test.txt', 'r+', function(err, fd) {
  // got fd file descriptor
  if (err) { throw err }
  var readBuffer = new Buffer(1024),
      bufferoffset = 0,
      bufferLength = readBuffer.length,
      filePosition = 0;
  fs.read(fd,
          readBuffer,
          bufferoffset,
          bufferLength,
          filePosition,
          function read(err, readBytes, buffer) {
            if (err) { throw err; }
            console.log('just read ' + readBytes + ' bytes');
            console.log('readBytes : ' + readBytes);
            if (readBytes > 0) {
             // console.log('wtf is this: ' + readBuffer.slice(0, readBytes) + ' : till this');
              console.log('buffer: ' + buffer.slice(0, readBytes));
              
              var writeBuffer = new Buffer('yet again'),
                  bufferPosition = 0,
                  bufferLength = writeBuffer.length,
                  filePosition = 0;
              fs.write(fd,
                       writeBuffer,
                       0,
                       bufferLength,
                       filePosition,
                       function wrote(err, written, buffer) {
                         if (err) { throw err; }
                         console.log('wrote: ' + written + ' bytes');
                         console.log('buffer: ' + buffer.slice(0, written));
                       });
                       
            }
          });
});
