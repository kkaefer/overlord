process.argv[2] = '--files=test/fixture';

var fs = require('fs');
var assert = require('assert');
var overlord = require('..');

exports['webhook api'] = function() {
    assert.response(overlord, {
        url: '/api/webhook',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify({ "repository": { "url": "https://github.com/kkaefer/bar" } })
    }, {
        status: 403
    });
};

exports['complete request'] = function() {
    assert.response(overlord, {
        url: '/api/webhook',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify(require('./fixture/repo1_request1'))
    }, {
        status: 200
    });

    assert.response(overlord, {
        url: '/api/webhook',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify(require('./fixture/repo1_request2'))
    }, {
        status: 200
    });
};
