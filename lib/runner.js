var fs = require('fs');
var exec = require('child_process').exec;

var Queue = require('./queue');
var runner = new Queue(runTest, 1);

var argv = require('optimist').argv;
var repositories = require(argv.files + '/repositories');
fs.watchFile(argv.files + '/repositories', function() {
    fs.readFile(argv.files + '/repositories', 'utf8', function(err, data) {
        if (!err) repositories = JSON.parse(data);
    });
});

module.exports = function(req, res, next) {
    if (req.body && req.body.repository && req.body.repository.url in repositories) {
        runner.add(req.body);
        res.send(200);
    } else {
        res.send(403);
    }
};

function runTest(hook, done) {
    console.warn('running test for %s -- %s', hook.repository.url, hook.after);
    var dirname = hook.repository.url.replace(/:?\/+/g, '#');
    var start = Date.now();
    exec('./scripts/test.sh ' +
        '"' + argv.files + '" ' +
        '"' + dirname + '" ' +
        '"' + hook.repository.url + '" ' +
        '"' + hook.ref + '" ' +
        '"' + hook.after + '"',
        function(err, stdout, stderr) {
            var result = {
                code: err ? err.code : 0,
                hook: hook,
                stdout: stdout.replace(/^\n+/, '').replace(/\s+$/, ''),
                stderr: stderr.replace(/^\n+/, '').replace(/\s+$/, ''),
                start_timestamp: start,
                end_timestamp: Date.now()
            };

            fs.writeFile(
                argv.files + '/logs/' + dirname + '/' + Date.now() + '.json',
                JSON.stringify(result),
                done
            );

            if (err) {
                // Send notification
            }
        }
    );
}
