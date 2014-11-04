var concat = require('concat-stream')
  , test = require('tape')
 
  , createStream = require('./significant-stream')

  , runTest = function (input, callback) {
      var stream = createStream({ key: 'body' })
      stream.pipe(concat(callback))
      input.forEach(function (data) { stream.write(data) })
      stream.end()
    }

test('empty', function (t) {
  runTest([], function (actual) {
    t.deepEqual(actual, [])
    t.end()
  })
})

test('one revision', function (t) {
  var inputs = [ { body: 'Hello, world', date: new Date(0) } ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, inputs)
    t.end()
  })
})

test('multiple compatible actual', function (t) {
  var inputs = [
          { body: 'Hello', date: new Date(0) }
        , { body: 'Hello, world', date: new Date(1000) }
        , { body: 'Hello, world!', date: new Date(2000) }
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, [ inputs[2] ])
    t.end()
  })
})

test('more complex, but compatible actual', function (t) {
  var inputs = [
          { body: 'Hello', date: new Date(0) }
        , { body: 'world!', date: new Date(1000) }
        , { body: 'Hello, world!', date: new Date(2000)}
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, [ inputs[2] ])
    t.end()
  })
})

test('removing', function (t) {
  var inputs = [
          { body: 'Hello, world!', date: new Date(0) }
        , { body: 'Hello', date: new Date(1000) }
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, inputs)
    t.end()
  })
})

test('multiple deletes', function (t) {
  var inputs = [
          { body: 'Hello, world!', date: new Date(0) }
        , { body: 'Hello, world', date: new Date(1000) }
        , { body: 'Hello', date: new Date(2000) }
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, [ inputs[0], inputs[2] ])
    t.end()
  })
})

test('deletes & inserts', function (t) {
  var inputs = [
          { body: 'beep boop', date: new Date(0)}
        , { body: 'Hello, world!', date: new Date(1000) }
        , { body: 'Hello, world', date: new Date(2000) }
        , { body: 'Hello', date: new Date(3000) }
        , { body: 'Hello2', date: new Date(4000)}
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, [ inputs[0], inputs[1], inputs[4] ])
    t.end()
  })
})

test('multiple ends with remove', function (t) {
  var inputs = [
          { body: 'Hello', date: new Date(0) }
        , { body: 'Foo', date: new Date(1000) }
        , { body: '', date: new Date(2000) }
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, inputs)
    t.end()
  })
})

test('unchanged', function (t) {
  var inputs = [
          { body: 'Hello', date: new Date(0) }
        , { body: 'Hello', date: new Date(1000) }
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, [ inputs[1] ])
    t.end()
  })
})

test('lots of inputs', function (t) {
  var inputs = [
          { body: 'Hello', date: new Date(0) }
        , { body: 'Hello', date: new Date(1000)}
        , { body: 'Hello, world!', date: new Date(2000) }
        , { body: 'foo', date: new Date(3000) }
        , { body: 'foobar', date: new Date(4000) }
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, [ inputs[2], inputs[4] ])
    t.end()
  })
})
