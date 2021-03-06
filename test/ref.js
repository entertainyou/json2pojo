const j = require('../lib/json2schema');
var assert = require('assert');

var BASE = 'http://google.com/';

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
		    id: BASE + 'dup',
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
		    id: BASE + 'foo',
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

    it('Merge', function () {
	var r = j({
	    dup: {
		a: 10,
	    },
	    foo: {
		dup: {
		    a: 20,
		    b: 30,
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
		    id: BASE + 'dup',
		    additionalProperties: false,
		    properties: {
			a: {
			    id: BASE + 'a',
			    type: 'integer',
			},
			b: {
			    id: BASE + 'b',
			    type: 'integer',
			},
		    }
		},
		foo: {
		    type: 'object',
		    id: BASE + 'foo',
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
    it('Conflict', function () {
	try {
	    var r = j({
		dup: {
		    a: 10,
		},
		foo: {
		    dup: {
			a: 'Alice',
			b: 30,
		    },
		},
	    }, {base: BASE});
	    assert(false);
	} catch (e) {
	};
    });
});
