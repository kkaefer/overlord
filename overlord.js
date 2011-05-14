#!/usr/bin/env node

// Allow requiring .json files.
require.extensions['.json'] = function (module, filename) {
    module.exports = JSON.parse(require('fs').readFileSync(filename, 'utf8'));
};

var path = require('path');
var express = require('express');

// Load configuration
var argv = require('optimist').argv;
argv.files = path.join(__dirname, argv.files || 'files');

var app = exports = module.exports = express.createServer();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/assets'));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.use(express.bodyParser());
app.helpers(require('./lib/helpers'));

app.post('/api/webhook', require('./lib/runner'));

app.get('/', require('./lib/status')['/']);
app.get('/status', require('./lib/status')['/status']);
app.get('/status/*', require('./lib/status')['/status/*']);

if (!module.parent) {
    app.listen(3000);
    console.warn("Overlord listening on port %d.", app.address().port);
}
