var merge = require('./lib/merge')

  , through = require('through2')

  , createSignificantStream = function () {
      var buffer = []
        , write = function (obj, _, callback) {
            buffer.push(obj)
            buffer = merge(buffer)
            if (buffer.length > 3) {
              stream.push(buffer.shift())
            }
            callback()
          }
        , flush = function (callback) {
            buffer.forEach(function (obj) { stream.push(obj) })
            callback()
          }
        , stream = through.obj(write, flush)

      return stream
    }

module.exports = createSignificantStream