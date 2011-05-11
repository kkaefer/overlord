var Queue = require('./queue');
var repositories = global.FIXTURE ? global.FIXTURE.repositories : require('../config/repositories');

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
    done();
}
