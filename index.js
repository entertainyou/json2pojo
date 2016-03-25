#!/usr/bin/env node

'use strict';

var assert = require('assert');
var _ = require('underscore');

function getJsonSchemaType(obj) {
  var type = Object.prototype.toString.call(obj).slice(8, -1);
  
  switch (type) {
  case 'Number':
    return 'integer';
  case 'String':
    return 'string';
  case 'Boolean':
    return 'boolean';
  case 'Array':
    return 'array';
  case 'Object':
    return 'object';
  default:
    return 'UNKNOWN';
  }
}

function getJsonSchema(json, option) {
  var result = {};
  result.id = option.base + (option.name || '');
  result.type = getJsonSchemaType(json);
  switch (result.type) {
  case 'array':
    option.name = (option.name || '') + '0';
    result.items = json.length > 0 ? json2jsonschema(json[0], option) : '';
    break;
  case 'object':
    var name = option.name;
    result.properties = {};
    if (!option.additionalProperties) {
      result.additionalProperties = false;
    }
    for (var key in json) {
      if (json.hasOwnProperty(key)) {
	option.name = key;
	result.properties[key] = json2jsonschema(json[key], option);
      }
    }
    break;
  default:
    break;
  }
  return result;
}

var definitions = {};

function gotDefinition(name, def) {
  var old = definitions[name];
  if (!old) {
    definitions[name] = def;
  } else {
    var common = _.intersection(Object.keys(old.properties), Object.keys(def.properties));
    var diff = _.difference(Object.keys(old.properties), Object.keys(def.properties));
    var result = def;
    common.forEach(function (key) {
      assert.deepEqual(old[key], def[key]);
    });
    // Object.assign
    diff.forEach(function (key) {
      if (!key in result.properties) {
	result.properties[key] = def[key];
      };
    });
    definitions[name] = result;
  }
}

function json2jsonschema(json, option) {
  var name = option.name;
  var result = getJsonSchema(json, option);
  if (name !== null && result.type === 'object') {
    var newResult = {};
    newResult['$ref'] = '#/definitions/' + name;
    gotDefinition(name, result);
    result = newResult;
  }
  return result;
}

function func(json, option) {
  option = option || {};
  option.base = option.base || '';
  if (option.base.length !== 1 && option.base[option.base.length - 1] !== '/') {
    option.base += '/';
  }
  option.name = null;
  if (!'additionalProperties' in option) {
    option.additionalProperties = true;
  }
  definitions = {};
  var result = json2jsonschema(json, option);
  if (Object.keys(definitions).length !== 0) {
    result.definitions = definitions;
  }
  return result;
}

module.exports = func;

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
    // console.log(buffer.split('\n'));
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
    var result = func(json, {base: base});
    console.log(JSON.stringify(result));
  });
}
