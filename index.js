
const json2schema = require('./lib/json2schema');
const assert = require('assert');

if (!module.parent) {
  if (process.argv.length !== 4) {
    console.log('incorrect argument length\n', process.argv[0], process.argv[1], 'dir', 'base');
    return;
  }
  var entry = process.argv[2];
  var base = process.argv[3];
  var fs = require('fs');
  var path = require('path');
  var rp = require('request-promise');
  var url = require('url');

  function visitEntryFile(file) {
    var result = {};
    var buffer = fs.readFileSync(file, {
      encoding: 'utf8',
    });

    var promises = buffer.trim().split('\n').map(function (line) {
      const items = line.split(' ');
      const method = items[0];
      const url = items[1];
      const data = items[3];
      return rp({
        method: method,
        uri: url,
        body: data || '',
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0',
        }
      });
    });

    return Promise.all(promises).then(function (results) {
      results.forEach(function (elem, index) {
        const items = buffer.split('\n')[index].split(' ');
        const name = items[2];
        assert(!result[name]);
        result[name] = JSON.parse(elem);
      });
      return result;
    }).catch(function (err) {
      console.error('ERROR: ', err);
      throw err;
    });
  }

  visitEntryFile(entry).then(function (json) {
    var result = json2schema(json, {base: base});
    console.log(JSON.stringify(result));
  });
}
