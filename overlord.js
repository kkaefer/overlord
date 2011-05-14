#!/usr/bin/env node
var path = require('path');
var express = require('express');
var tools = require('./lib/tools');

// Load configuration
var argv = require('optimist').argv;
if (!argv.files) argv.files = './files';
argv.files = path.join(__dirname, argv.files);

var app = exports = module.exports = express.createServer();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
app.use(express.bodyParser());

app.post('/api/webhook', require('./lib/runner'));
app.get('/', require('./lib/status'));


if (!module.parent) {
    app.listen(3000);
    console.warn("Overlord listening on port %d.", app.address().port);
}
