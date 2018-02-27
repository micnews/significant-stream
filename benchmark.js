var benchmark = require('async-benchmark')
  , concat = require('concat-stream')
  , test = require('tape')
  , createStream = require('./significant-stream')
  , runTest = function (input, options, done) {
      var stream = createStream(options)
      stream.pipe(concat({ encoding: 'object' }, done))
      input.forEach(function (data) { stream.write(data) })
      stream.end()
    }
  , inputs = [
      Array(500).join('A'),
      Array(500).join('B') + Array(100).join('C'),
      Array(500).join('B') + Array(100).join('C') + 'beep boop',
    ]
  , benchCache = function (done) { runTest(inputs, { cache: { max: 500 } }, done) }
  , benchNoCache = function (done) { runTest(inputs, {}, done) }

benchmark('SignificantStream with cache', benchCache, function (err, event) {
  console.log(event.target.toString())
  benchmark('SignificantStream no cache', benchNoCache, function (err, event) {
    console.log(event.target.toString())
  })
})
