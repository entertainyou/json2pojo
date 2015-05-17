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

var root;
function json2jsonschema(json, option) {
    var result = {};
    if (option.name === null) {
	root = result;
    }
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
	if (name !== null) {
	    var newResult = {};
	    newResult['$ref'] = '#/definitions/' + name;
	    
	    root.definitions = root.definitions || {};
	    root.definitions[name] = result;
	    result = newResult;
	};
	break;
    default:
	break;
    }
    return result;
}

function func(json, option) {
    option = option || {};
    option.base = option.base || '';
    option.name = option.name || null;
    if (!'additionalProperties' in option) {
	option.additionalProperties = true;
    }
    return json2jsonschema(json, option);
}

module.exports = func;


