exports.consoleToHTML = function(str) {
    var self = exports.consoleToHTML;
    return str.replace(self.regex, function(all, style, color, type, text, close) {
        if (type !== 'm') return text;

        var classes = [];
        if (style && self.styles[style]) {
            classes.push('style-' + self.styles[style]);
        }
        if (color && self.colors[color]) {
            classes.push('color-' + self.colors[color]);
        }
        if (classes.length) {
            return '<span class="' + classes.join(' ') + '">' + text + '</span>';
        } else {
            return text;
        }
    });
};

exports.consoleToHTML.regex =
    /\x1b\[\??(?:(\d+);)?(\d+)([a-z])([\s\S]*?)(?:\x1b\[0m|(?=\x1b\[\??(?:\d+;)?\d+[a-z])|$)/g;

exports.consoleToHTML.colors = {
    31: 'red',
    32: 'green',
    33: 'yellow',
    34: 'blue',
    35: 'purple',
    36: 'cyan'
};

exports.consoleToHTML.styles = {
    1: 'bold',
    4: 'underline'
};

exports.toInterval = function(ms) {
    return Math.round(ms / 1000) + ' seconds';
};

exports.highlightRepoName = function(url) {
    return url.replace(/(\w+)\/(\w+)$/, '<span class="user">$1</span>/<span class="repo">$2</span>');
};
