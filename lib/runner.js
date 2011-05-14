var fs = require('fs');
var exec = require('child_process').exec;
var argv = require('optimist').argv;
var Queue = require('./queue');
var repositories = require(argv.files + '/repositories');

var runner = new Queue(runTest, 1);
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
    exec('./scripts/test.sh ' +
        '"' + argv.files + '" ' +
        '"' + dirname + '" ' +
        '"' + hook.repository.url + '" ' +
        '"' + hook.ref + '" ' +
        '"' + hook.after + '"',
        function(err, stdout, stderr) {
            fs.writeFile(
                argv.files + '/logs/' + dirname + '/' + Date.now() + '.json',
                JSON.stringify({
                    err: err,
                    hook: hook,
                    stdout: stdout,
                    stderr: stderr,
                }),
                done
            );

            if (err) {
                // Send notification
            }
        }
    );
}
