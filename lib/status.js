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
        page: parseInt(req.query.page, 10) || 0,
        per_page: 10,
        total: 0
    };

    var dirname = argv.files + '/logs/' + req.params[0].replace(/:?\/+/g, '#');
    fs.readdir(dirname, function(err, files) {
        if (err) return res.render('result', parameters);

        var loader = new Queue(function(file, done) {
            fs.readFile(dirname + '/' + file, 'utf8', function(err, data) {
                if (!err) {
                    data = JSON.parse(data);
                    data.start_timestamp = new Date(data.start_timestamp);
                    data.end_timestamp = new Date(data.end_timestamp);
                    data.hook.repository.pushed_at = new Date(data.hook.repository.pushed_at);
                    parameters.tests.push(data);
                }
                done();
            });
        }, 1).on('empty', function() {
            res.render('result', parameters);
        });

        files = files.filter(isLogfile);
        parameters.total = files.length;
        parameters.total_pages = Math.ceil(parameters.total / parameters.per_page) - 1;

        files.sort().reverse();
        files = files.slice(
            parameters.per_page * parameters.page,
            parameters.per_page * (parameters.page + 1)
        );

        if (files.length) {
            files.forEach(loader.add);
        } else {
            res.render('result', parameters);
        }
    });
};
