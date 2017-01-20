const is = require('is');

/**
 * API error object.
 * @type {Class}
 */
class GitHubError extends Error {
    constructor(message) {
        super(message);

        this.name = 'GitHubError';
        this.message = message;
        this.statusCode = 0;
        this.code = 0;
        this.statusType = '0xx';
        this.response = null;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }

    /**
     * Create an error object for a fetch response.
     * @param  {Response} response
     * @return {GitHubError} error
     */
    static createForResponse(opts) {
        let message = `Error ${opts.statusCode}`;
        let errors, documentationUrl;

        if (is.object(opts.body) && opts.body.message) {
            message = opts.body.message || opts.message;
        }

        const err = new GitHubError(message);

        Object.defineProperty(err, 'response', {
            value: opts.response,
            enumerable: false
        });

        err.statusCode = opts.statusCode;
        err.code = err.statusCode;
        err.statusType = opts.statusType;
        err.body = opts.body;
        err.headers = opts.headers;
        err.documentationUrl = documentationUrl;
        err.errors = errors || [];

        return err;
    }
}

module.exports = GitHubError;
