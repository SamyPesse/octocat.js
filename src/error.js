const is = require('is');

/**
 * API error object.
 * @type {Class}
 */
class GitHubError extends Error {
    constructor(message) {
        super(message);

        this.name = this.constructor.name;
        this.message = message;
        this.statusCode = 0;
        this.statusType = '0xx';
        this.response = null;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }

    get code() {
        return this.statusCode;
    }

    /**
     * Create an error object for a fetch response.
     * @param  {Response} response
     * @return {GitHubError} error
     */
    static createForResponse(opts) {
        const err = new GitHubError(`Error ${opts.statusCode}`);
        err.statusCode = opts.statusCode;
        err.statusType = opts.statusType;
        err.response = opts.response;
        err.body = opts.body;
        err.headers = opts.headers;

        if (is.object(err.body) && err.body.message) {
            err.message = err.body.message || err.message;
            err.documentationUrl = err.body.documentation_url;
            err.errors = err.body.errors || [];
        }

        return err;
    }
}

module.exports = GitHubError;
