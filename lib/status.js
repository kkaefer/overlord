var fs = require('fs');
var Queue = require('./queue');

var argv = require('optimist').argv;
var repositories = require(argv.files + '/repositories');
fs.watchFile(argv.files + '/repositories', function() {
    fs.readFile(argv.files + '/repositories', 'utf8', function(err, data) {
        if (!err) repositories = JSON.parse(data);
    });
});

exports['/'] = function(req, res, next) {
    res.redirect('/status');
};

exports['/status'] = function(req, res, next) {
    res.render('status', {
        repositories: repositories
    });
};

function isLogfile(file) {
    return /^\d+\.json$/.test(file);
}

exports['/status/*'] = function(req, res, next) {
    if (!repositories[req.params[0]]) res.send(404);

    var parameters = {
        repository: req.params[0],
        tests: [],
        page: req.query.page || 0,
        total: 0
    };

    var dirname = argv.files + '/logs/' + req.params[0].replace(/:?\/+/g, '#');
    fs.readdir(dirname, function(err, files) {
        if (err) return res.render('result', parameters);

        var loader = new Queue(function(file, done) {
            fs.readFile(dirname + '/' + file, 'utf8', function(err, data) {
                if (!err) {
                    data = JSON.parse(data);
                    data.timestamp = new Date(parseInt(file, 10));
                    parameters.tests.push(data);
                }
                done();
            });
        }, 1).on('empty', function() {
            res.render('result', parameters);
        });

        files = files.filter(isLogfile);
        files.sort().reverse();
        files.slice(parameters.page, parameters.page + 10).forEach(loader.add);
        parameters.total = files.length;
    });
};
