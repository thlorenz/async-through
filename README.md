# async-through [![build status](https://secure.travis-ci.org/thlorenz/async-through.png)](http://travis-ci.org/thlorenz/async-through)

[![testling badge](https://ci.testling.com/thlorenz/async-through.png)](https://ci.testling.com/thlorenz/async-through)

Readable stream that ensures that onend is only called once no ondata items are pending, thus supporting async operations inside ondata.

```js
var asyncThru = require('async-through')

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
```

```
2
6
8
10
stream ended
```

#### `onend` is optional

```js
var from = require('from');

// onend is optional
var stream = asyncThru(ondata);

function ondata(data) {
  setTimeout(function () {
    stream.queue(data * 2 + '\n');
  }, 200 * data);
}

from([1, 3, 4, 5])
  .pipe(stream)
  .on('end', function () { console.log('stream ended'); })
  .pipe(process.stdout);
```

#### one to many

```js
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
```

```
2
0.5
4
1
6
1.5
stream ended
```

## Installation

    npm install async-through

## API

### *asyncThrough(ondata, onend)*

```
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
```

### one-to-many

If you want to `queue` multiple results per incoming item, do so by providing `true` as the second paramater to `queue`
in order to signal that more results for this item are coming.

```js
stream.queue(fst, true);
stream.queue(snd, true);
stream.queue(trd, true);
stream.queue(last);
```

## License

MIT
