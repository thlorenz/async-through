'use strict';

var asyncThru = require('../');

var from = require('from');
var stream = asyncThru(ondata, onend);

function ondata(data) {
  setTimeout(function () {
    stream.queue(data * 2 + '\n');
    // this === stream, so the below also works:
    // this.queue(data * 2 + '\n');
  }, 200 * data);
}

function onend() {
  // this === stream, so the below also works:
  // this.queue(null);
  stream.queue(null);
}

from([1, 3, 4, 5])
  .pipe(stream)
  .on('end', function () { console.log('stream ended'); })
  .pipe(process.stdout);
