var concat = require('concat-stream')
  , test = require('tape')

  , createStream = require('./significant-stream')

  , runTest = function (input, callback) {
      var stream = createStream()
      stream.pipe(concat({ encoding: 'object' }, callback))
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
  var inputs = [ 'Hello, world', ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, inputs)
    t.end()
  })
})

test('multiple compatible actual', function (t) {
  var inputs = [
          'Hello'
        , 'Hello, world'
        , 'Hello, world!'
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, [ inputs[2] ])
    t.end()
  })
})

test('more complex, but compatible actual', function (t) {
  var inputs = [
          'Hello'
        , 'world!'
        , 'Hello, world!'
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, [ inputs[2] ])
    t.end()
  })
})

test('removing', function (t) {
  var inputs = [
          'Hello, world!'
        , 'Hello'
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, inputs)
    t.end()
  })
})

test('multiple deletes', function (t) {
  var inputs = [
          'Hello, world!'
        , 'Hello, world'
        , 'Hello'
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, [ inputs[0], inputs[2] ])
    t.end()
  })
})

test('deletes & inserts', function (t) {
  var inputs = [
          'beep boop'
        , 'Hello, world!'
        , 'Hello, world'
        , 'Hello'
        , 'Hello2'
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, [ inputs[0], inputs[1], inputs[4] ])
    t.end()
  })
})

test('multiple ends with remove', function (t) {
  var inputs = [
          'Hello'
        , 'Foo'
        , ''
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, inputs)
    t.end()
  })
})

test('unchanged', function (t) {
  var inputs = [
          'Hello'
        , 'Hello'
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, [ inputs[1] ])
    t.end()
  })
})

test('lots of inputs', function (t) {
  var inputs = [
          'Hello'
        , 'Hello'
        , 'Hello, world!'
        , 'foo'
        , 'foobar'
      ]

  runTest(inputs, function (actual) {
    t.deepEqual(actual, [ inputs[2], inputs[4] ])
    t.end()
  })
})

test('object as input', function (t) {
  var input = [ { data: 'hej' }, { data: 'hejhopp' } ]
    , stream = createStream({ key: 'data' })

  stream.pipe(concat({ encoding: 'object' }, function (array) {
    t.deepEqual(array, [ input[1] ])
    t.end()
  }))

  input.forEach(function (row) { stream.write(row) })
  stream.end()
})

test('with cache', function (t) {
  var input = [ 'beep', 'beep boop' ]
    , stream = createStream({ cache: { max: 500 } })

  stream.pipe(concat({ encoding: 'object' }, function (array) {
    t.deepEqual(array, [ input[1] ])
    t.end()
  }))

  input.forEach(function (row) { stream.write(row) })
  stream.end()
})
