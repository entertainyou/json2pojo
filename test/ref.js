var assert = require('assert');
var j = require('../index');

var BASE = 'http://hijk.rocks';

describe('Reference', function () {
    it('Simple', function () {
	var r = j({
	    dup: {
		a: 10,
	    },
	    foo: {
		dup: {
		    a: 10,
		},
	    },
	}, {base: BASE});
	var expected = {
	    id: BASE,
	    type: 'object',
	    properties: {
		dup: {
		    $ref: '#/definitions/dup',
		},
		foo: {
		    $ref: '#/definitions/foo',
		}
	    },
	    additionalProperties: false,
	    definitions: {
		dup: {
		    type: 'object',
		    id: 'dup',
		    additionalProperties: false,
		    properties: {
			a: {
			    id: BASE + 'a',
			    type: 'integer',
			}
		    }
		},
		foo: {
		    type: 'object',
		    id: 'foo',
		    additionalProperties: false,
		    properties: {
			dup: {
			    $ref: '#/definitions/dup',
			}
		    }
		}
	    }
	};
	assert.deepEqual(r, expected);
    });
});