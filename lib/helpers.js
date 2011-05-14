exports.consoleToHTML = function(str) {
    return str.replace(this.regex, function(all, style, color, text, close) {
        var classes = [];
        if (style && this.styles[style]) {
            classes.push('style-' + this.styles[style]);
        }
        if (color && this.colors[color]) {
            classes.push('color-' + this.colors[color]);
        }
        if (classes.length) {
            return '<span class="' + classes.join(' ') + '">' + text + '</span>';
        } else {
            return text;
        }
    });
};

exports.consoleToHTML.regex =
    /\x1b\[(?:(\d+);)?(\d+)m([\s\S]*?)(?:\x1b\[0m|(?=\x1b\[(?:\d+;)?\d+m)|$)/g;

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
