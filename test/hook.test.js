var assert = require('assert');

global.FIXTURE = {
    repositories: {
        "https://github.com/kkaefer/foo": {}
    }
};

var overlord = require('..');

exports['webhook api'] = function() {
    assert.response(overlord, {
        url: '/api/webhook',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify({ "repository": { "url": "https://github.com/kkaefer/foo" } })
    }, {
        status: 200
    });

    assert.response(overlord, {
        url: '/api/webhook',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify({ "repository": { "url": "https://github.com/kkaefer/bar" } })
    }, {
        status: 403
    });
};
