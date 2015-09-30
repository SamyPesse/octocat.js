var _ = require('lodash');
var util = require('util');

function GitHubError(opts) {
    opts = _.defaults(opts || {}, {
        statusCode: 0,
        body: {}
    });

    if (_.isString(body)) {
        try {
            opts.body = JSON.parse(opts.body);
        } catch (e) {
            // ignore json error
        }
    }

    this.name = 'GitHubError';
    this.message = "Error "+opts.statusCode;
    this.statusCode = opts.statusCode
    this.result = opts;
    this.stack = (new Error()).stack;

    var body = opts.body;
    if (body && body.message) {
        this.message = body.message;
        this.documentationUrl = body.documentation_url;
        this.errors = body.errors || [];
    }
}
util.inherits(GitHubError, Error);


module.exports = GitHubError;
