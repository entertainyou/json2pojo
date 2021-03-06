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

function process(json, option) {
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

module.exports = process;