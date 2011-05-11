// Allow requiring .json files.
require.extensions['.json'] = function (module, filename) {
    module.exports = JSON.parse(require('fs').readFileSync(filename, 'utf8'));
};
