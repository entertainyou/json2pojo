var j = require('../index.js');
var assert = require('assert');

var BASE = 'http://hijk.rocks/';

describe('Basic type', function () {
    it('Number', function () {
	assert.deepEqual(j(10, BASE), {
	    id: BASE,
	    type: 'integer',
	});
    });

    it('String', function () {
	assert.deepEqual(j('10', BASE), {
	    id: BASE,
	    type: 'string',
	});
    });

    it('Boolean', function () {
	assert.deepEqual(j(false, BASE), {
	    id: BASE,
	    type: 'boolean',
	});
    });
    
    it('Array', function () {
	assert.deepEqual(j([], BASE), {
	    id: BASE,
	    type: 'array',
	    items: '',
	});

	assert.deepEqual(j([1, 2, 3], BASE), {
	    id: BASE,
	    type: 'array',
	    items: {
		id: BASE + 1,
		type: 'integer',
	    }
	});
    });

    it('Object', function () {
	assert.deepEqual(j({}, BASE), {
	    type: 'object',
	    id: BASE,
	    properties: {},
	});
	assert.deepEqual(j({a: 10}, BASE), {
	    type: 'object',
	    id: BASE,
	    properties: {
		a: {
		    id: BASE + 'a',
		    type: 'integer',
		},
	    },
	});
	assert.deepEqual(j({a: 10, b: '20'}, BASE), {
	    type: 'object',
	    id: BASE,
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

describe('Composite', function () {
    it('Array of object', function () {
	assert.deepEqual(j([{}], BASE), {
	    id: BASE,
	    type: 'array',
	    items: {
		type: 'object',
		id: BASE + 1,
		properties: {},
	    },
	});
	assert.deepEqual(j([{a: 10}], BASE), {
	    id: BASE,
	    type: 'array',
	    items: {
		type: 'object',
		id: BASE + 1,
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
