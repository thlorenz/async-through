'use strict';
/*jshint asi: true */

var test = require('tape')
var asyncThru = require('../')

var concatStream = require('concat-stream')
var from = require('from')

test('\nusing this, providing both ondata and onend', function (t) {

  var stream = asyncThru(ondata, onend);

  function ondata(data) {
    setTimeout(function () {
      this.queue(data * 2 + '\n');
    }.bind(this), 20);
  }

  function onend() {
    this.queue(null);
  }

  var ended, data = ''
  from([1, 3, 4, 5])
    .pipe(stream)
    .on('end', function () { ended = true })
    .pipe(concatStream(function (data) {
      t.equal(data, '2\n6\n8\n10\n', 'data')
      t.ok(ended, 'ended')
      t.end()
    }))
})

test('\nusing stream instead of this, providing both ondata and onend', function (t) {

  var stream = asyncThru(ondata, onend);

  function ondata(data) {
    setTimeout(function () {
      stream.queue(data * 2 + '\n');
    }, 20);
  }

  function onend() {
    stream.queue(null);
  }

  var ended, data = ''
  from([1, 3, 4, 5])
    .pipe(stream)
    .on('end', function () { ended = true })
    .pipe(concatStream(function (data) {
      t.equal(data, '2\n6\n8\n10\n', 'data')
      t.ok(ended, 'ended')
      t.end()
    }))
})

test('\nusing this, providing both ondata only', function (t) {

  var stream = asyncThru(ondata);

  function ondata(data) {
    setTimeout(function () {
      this.queue(data * 2 + '\n');
    }.bind(this), 20);
  }

  var ended, data = ''
  from([1, 3, 4, 5])
    .pipe(stream)
    .on('end', function () { ended = true })
    .pipe(concatStream(function (data) {
      t.equal(data, '2\n6\n8\n10\n', 'data')
      t.ok(ended, 'ended')
      t.end()
    }))
})

test('\nusing stream instead of this, providing both ondata only', function (t) {

  var stream = asyncThru(ondata);

  function ondata(data) {
    setTimeout(function () {
      stream.queue(data * 2 + '\n');
    }, 20);
  }

  var ended, data = ''
  from([1, 3, 4, 5])
    .pipe(stream)
    .on('end', function () { ended = true })
    .pipe(concatStream(function (data) {
      t.equal(data, '2\n6\n8\n10\n', 'data')
      t.ok(ended, 'ended')
      t.end()
    }))
})
