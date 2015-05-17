'use strict';

function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

function getJsonSchemaType(obj) {
    switch (getType(obj)) {
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
function json2jsonschema(json, option) {
    var name = option.name;
    var result = getJsonSchema(json, option);
    if (name !== null && result.type === 'object') {
	var newResult = {};
	newResult['$ref'] = '#/definitions/' + name;
	definitions[name] = result;
	result = newResult;
    }
    return result;
}

function func(json, option) {
    option = option || {};
    option.base = option.base || '';
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


