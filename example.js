var stream1 = require('./significant-stream')()
  , stream2 = require('./significant-stream')({ key: 'foo' })

stream1.on('data', function (row) { console.log('data from stream1', row) })

console.log('stream1 will only ouput the second string, since the diff between them is an append')
stream1.write('Hello')
stream1.write('Hello, world!')
stream1.end()

console.log('stream2 has similar behaviour as stream1, but it is an object')
stream2.on('data', function (obj) { console.log('data from stream2', obj) })
stream2.write({ foo: 'Yeah', bar: 'beep' })
stream2.write({ foo: 'Oh, Yeah', bar: 'boop' })
stream2.end()