var _ = require('lodash');
var util = require('util');

function GitHubError(opts) {
    Error.captureStackTrace(this, this.constructor);

    opts = _.defaults(opts || {}, {
        statusCode: 0,
        body: {}
    });

    this.name = 'GitHubError';
    this.message = "Error "+opts.statusCode;
    this.statusCode = opts.statusCode
    this.result = opts;

    var body = opts.body;
    if (_.isObject(body) && body.message) {
        this.message = body.message || this.message;
        this.documentationUrl = body.documentation_url;
        this.errors = body.errors || [];
    }
}
util.inherits(GitHubError, Error);


module.exports = GitHubError;
