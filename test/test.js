'use strict';

var google = require('../lib/google-places');

var a = new google({
  key: 'AIzaSyD0UPKPAgJxZgl4JhKUERAfRqjxYHlGCo8',
  cacheClient: 'redis',
  redisURL: 'redis://:@redis:6379',
  cacheDuration: 60 * 60 * 1000 // 1 día
});

console.time('autocomplete1');
console.time('details1');
a.autocomplete({
  input: 'Vale'
}, function(err, response) {
  console.timeEnd('autocomplete1');
});

a.details({
  reference: 'CjQnAAAAyIh5GJD8eN_XcPzitEAzn-74YxVOQBKMpFnwkXyXCw2F7U2CbReskNeFmQ74bKVWEhDH7OqEhhKB6crEQzXu7Ns1GhSyojkV5BhiZ5upEOUB-sf8VDl2lw'
}, function(err, response) {
  console.timeEnd('details1');
});

setTimeout(function() {
  console.time('autocomplete2');
  console.time('details2');
  a.autocomplete({
    input: 'Vale'
  }, function(err, response) {
    console.timeEnd('autocomplete2');
  });
  a.details({
    reference: 'CjQnAAAAyIh5GJD8eN_XcPzitEAzn-74YxVOQBKMpFnwkXyXCw2F7U2CbReskNeFmQ74bKVWEhDH7OqEhhKB6crEQzXu7Ns1GhSyojkV5BhiZ5upEOUB-sf8VDl2lw'
  }, function(err, response) {
    console.timeEnd('details2');
    process.exit();
  });
}, 1000);
