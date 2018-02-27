var DiffMatchPatch = require('diff-match-patch')

  , diffMatchPatch = new DiffMatchPatch()

  , createMerge = function (options) {
      var cache = options.cache && require('lru-cache')(options.cache)
        , getData = options && options.key ?
            function (obj) { return obj[options.key]} : function (obj) { return obj }

        , diffStats = function (before, after) {
            var cacheKey = before + after;
            if (options.cache) {
              var cachedResponse = cache.get(cacheKey);
              if (cachedResponse) {
                return cachedResponse;
              }
            }

            var stats = { inserts: false, deletes: false }
              , diff = diffMatchPatch.diff_main(before, after)
              , index

            for(index = 0; index < diff.length; ++index) {
              if (diff[index][0] === -1) stats.deletes = true
              if (diff[index][0] === 1) stats.inserts = true
              if (stats.deletes && stats.inserts) break
            }

            if (options.cache) {
              cache.set(cacheKey, stats);
            }
            return stats
          }

      , mergeInserts = function (input, getData) {
          if (input.length < 2) return input.slice(0)

          var index
            , results = [ input.pop() ]
            , stats

          for(index = input.length - 1; index >= 0;  index--) {
            stats = diffStats(
                getData(input[index])
              , getData(results[0])
            )

            if (stats.deletes) {
              results.unshift(input[index])
            }
          }

          return results
        }

      , mergeDeletes = function (input, getData) {
          if (input.length < 2) return input.slice(0)

          var index
            , results = [ input.shift() ]
            , stats

          for(index = 0; index < input.length - 1; ++index) {
            stats = diffStats(
                getData(results[results.length - 1])
              , getData(input[index])
            )

            if (stats.inserts) {
              results.push(input[index])
            }
          }
          // always include the last revision
          results.push(input[input.length - 1])

          return results
        }

      return function (input) {
        return mergeDeletes(mergeInserts(input, getData), getData)
      }
    }

module.exports = createMerge
