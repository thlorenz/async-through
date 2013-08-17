'use strict';

var asyncThru = require('../');

var from = require('from');

var stream = asyncThru(ondata);

function ondata(data) {
  setTimeout(function () {
    stream.queue(data * 2 + '\n', true);
    stream.queue(data / 2 + '\n');
  }, 200 * data);
}

from([1, 2, 3])
  .pipe(stream)
  .on('end', function () { console.log('stream ended'); })
  .pipe(process.stdout);
