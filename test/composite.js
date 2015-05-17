var assert = require('assert');
var j = require('../index');

var BASE = 'http://hijk.rocks/';

describe('Composite', function () {
    it('Array of object', function () {
	assert.deepEqual(j([{}], {base: BASE}), {
	    id: BASE,
	    type: 'array',
	    items: {
		type: 'object',
		id: BASE + 1,
		additionalProperties: false,
		properties: {},
	    },
	});
	assert.deepEqual(j([{a: 10}], {base: BASE}), {
	    id: BASE,
	    type: 'array',
	    items: {
		type: 'object',
		id: BASE + 1,
		additionalProperties: false,
		properties: {
		    a: {
			type: 'integer',
			id: BASE + 'a',
		    }
		},
	    },
	});
    });
});
