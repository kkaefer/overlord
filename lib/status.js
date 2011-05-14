var argv = require('optimist').argv;
var repositories = require(argv.files + '/repositories');
require('fs').watchFile(argv.files + '/repositories', function() {
    repositories = require(argv.files + '/repositories');
});

exports['/'] = function(req, res, next) {
    res.redirect('/status');
};

exports['/status'] = function(req, res, next) {
    res.render('status', {
        repositories: repositories
    });
};

exports['/status/*'] = function(req, res, next) {
    var dirname = req.params[0].replace(/:?\/+/g, '#');
};
