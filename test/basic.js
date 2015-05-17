var j = require('../index.js');
var assert = require('assert');

var BASE = 'http://hijk.rocks/';

describe('Basic type', function () {
    it('Number', function () {
	assert.deepEqual(j(10, {base: BASE}), {
	    id: BASE,
	    type: 'integer',
	});
    });

    it('String', function () {
	assert.deepEqual(j('10', {base: BASE}), {
	    id: BASE,
	    type: 'string',
	});
    });

    it('Boolean', function () {
	assert.deepEqual(j(false, {base: BASE}), {
	    id: BASE,
	    type: 'boolean',
	});
    });
    
    it('Array', function () {
	assert.deepEqual(j([], {base: BASE}), {
	    id: BASE,
	    type: 'array',
	    items: '',
	});

	assert.deepEqual(j([1, 2, 3], {base: BASE}), {
	    id: BASE,
	    type: 'array',
	    items: {
		id: BASE + 1,
		type: 'integer',
	    }
	});
    });

    it('Object', function () {
	assert.deepEqual(j({}, {base: BASE}), {
	    type: 'object',
	    id: BASE,
	    additionalProperties: false,
	    properties: {},
	});
	assert.deepEqual(j({a: 10}, {base: BASE}), {
	    type: 'object',
	    id: BASE,
	    additionalProperties: false,
	    properties: {
		a: {
		    id: BASE + 'a',
		    type: 'integer',
		},
	    },
	});
	assert.deepEqual(j({a: 10, b: '20'}, {base: BASE}), {
	    type: 'object',
	    id: BASE,
	    additionalProperties: false,
	    properties: {
		a: {
		    id: BASE + 'a',
		    type: 'integer',
		},
		b: {
		    id: BASE + 'b',
		    type: 'string',
		}
	    },
	});
    });
});
