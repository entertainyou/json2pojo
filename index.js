
const json2schema = require('./lib/json2schema');
const assert = require('assert');

if (!module.parent) {
  if (process.argv.length !== 4) {
    console.log('incorrect argument length\n', process.argv[0], process.argv[1], 'dir', 'base');
    return;
  }
  var dir = process.argv[2];
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

    var promises = buffer.split('\n').map(function (url) {
      return rp({
        uri: url,
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0',
        }
      });
    });

    return Promise.all(promises).then(function (results) {
      results.forEach(function (elem, index) {
        if (elem.length < 10) {
          console.log('Found error at %d %s', index, buffer.split('\n')[index], elem);
          throw new Error('FOO');
        }

        var u = buffer.split('\n')[index];
        var _path = url.parse(u).pathname;
        var data = JSON.parse(elem);
        var basename = path.basename(_path);
        assert(!result[basename]);
        result[basename] = data;
      });
      return result;
    }).catch(function (err) {
      console.log('ERROR: ', err);
      throw err;
    });
  }

  visitEntryFile(dir).then(function (json) {
    var result = json2schema(json, {base: base});
    console.log(JSON.stringify(result));
  });
}
