'use strict';

var through = require('through');

/**
 * Returns a stream that works just like a normal through stream except that it keeps track of pending items that are
 * being processed inside the `ondata` function.
 * This allows the processing code to be async yet ensures that `onend` doesn't get called until no items are pending.
 * 
 * @name exports
 * @function
 * @param ondata_ {Function} function (data) { .. } to process data item and queue the result
 * @param onend_ {Function} (optional) function () { .. }
 * @return {Stream} async-through stream
 */
var go = module.exports = function (ondata_, onend_) {
  
  if (!ondata_) throw new Error('Need to provide ondata function b/c using async-through makes no sense without it.');
  
  var stream = through(ondata, onend)
    , pending = 0
    , ended
    , onended;

  onend_ = onend_ || function () { stream.queue(null) }

  var stream_queue = stream.queue;
  stream.queue = function (data, moreComing) {
    if (data === null ) return onend();

    stream_queue.call(stream, data);
    maybeEnd(false, moreComing);
  }


  function ondata (val) {
    ++pending;
    ondata_.call(stream, val);
  }

  function onend () {
    maybeEnd(true);
  }

  function maybeEnd (ended_, moreComing) {
    if (ended_) ended = true; else if(!moreComing) --pending;
    if (!pending && ended && !onended) {
      onended = true;
      onend_.call(stream);
      stream_queue(null);
    } 
  }
  
  return stream;
};
