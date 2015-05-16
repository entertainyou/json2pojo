'use strict';

function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

function json2jsonschema(json, option) {
    var result = {};
    result.id = option.base + option.name;
    switch (getType(json)) {
    case 'Number':
	result.type = 'integer';
	break;
    case 'String':
	result.type = 'string';
	break;
    case 'Boolean':
	result.type = 'boolean';
	break;
    case 'Array':
	result.type = 'array';
	option.name = 1;
	result.items = json.length > 0 ? json2jsonschema(json[0], option) : '';
	break;
    case 'Object':
	result.type = 'object';
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
	;
    }
    return result;
}

function func(json, option) {
    option = option || {};
    option.base = option.base || '';
    option.name = option.name || '';
    if (!'addtionalProperties' in option) {
	option.addtionalProperties = true;
    }
    return json2jsonschema(json, option);
}

module.exports = func;


