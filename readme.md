# significant-stream[![build status](https://secure.travis-ci.org/micnews/significant-stream.svg)](http://travis-ci.org/micnews/significant-stream)

Stream where only significant changes are pushed through

[![NPM](https://nodei.co/npm/significant-stream.png?downloads&stars)](https://nodei.co/npm/significant-stream/)

[![NPM](https://nodei.co/npm-dl/significant-stream.png)](https://nodei.co/npm/significant-stream/)

## Installation

```
npm install significant-stream
```

## Example

### Input

```javascript
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
```

### Output

```
stream1 will only ouput the second string, since the diff between them is an append
data from stream1 Hello, world!
stream2 has similar behaviour as stream1, but it is an object
data from stream2 { foo: 'Oh, Yeah', bar: 'boop' }
```

## Licence

Copyright (c) 2014 Mic Network, Inc

This software is released under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
