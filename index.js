'use strict';

function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

function json2jsonschema(json, base, name) {
    var result = {};
    result.id = base + name;
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
	result.items = json.length > 0 ? json2jsonschema(json[0], base, 1) : '';
	break;
    case 'Object':
	result.type = 'object';
	result.properties = {};
	for (var key in json) {
	    if (json.hasOwnProperty(key)) {
		result.properties[key] = json2jsonschema(json[key], base, key);
	    }
	}
	break;
    default:
	;
    }
    return result;
}

function func(json, base, name) {
    base = base || '';
    name = name || '';
    return json2jsonschema(json, base, name);
}

module.exports = func;


