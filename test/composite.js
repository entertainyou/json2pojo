var assert = require('assert');
var j = require('../index');

var BASE = 'http://hijk.rocks/';

describe('Composite', function () {
    it('Array of object', function () {
	assert.deepEqual(j([{}], {base: BASE}), {
	    id: BASE,
	    type: 'array',
	    items: {
		$ref: '#/definitions/0',
	    },
	    definitions: {
		0: {
		    type: 'object',
		    id: BASE + '0',
		    additionalProperties: false,
		    properties: {},
		},
	    },
	});
	assert.deepEqual(j([{a: 10}], {base: BASE}), {
	    id: BASE,
	    type: 'array',
	    items: {
		$ref: '#/definitions/0',
	    },
	    definitions: {
		0: {
		    type: 'object',
		    id: BASE + 0,
		    additionalProperties: false,
		    properties: {
			a: {
			    type: 'integer',
			    id: BASE + 'a',
			}
		    },
		}
	    },
	});
    });

    it('Object has object value', function () {
	var r = j({
	    a: {b: 10},
	    c: 'BOY',
	}, {base: BASE});
	var expected = {
	    id: BASE,
	    type: 'object',
	    additionalProperties: false,
	    properties: {
		a: {
		    $ref: '#/definitions/a',
		},
		c: {
		    id: BASE + 'c',
		    type: 'string',
		}
	    },
	    definitions: {
		a: {
		    id: BASE + 'a',
		    type: 'object',
		    additionalProperties: false,
		    properties: {
			b: {
			    id: BASE + 'b',
			    type: 'integer',
			},
		    },
		},
	    },
	};
	assert.deepEqual(r, expected);
    });
});
