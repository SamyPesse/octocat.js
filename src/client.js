const Promise = require('q');
const is = require('is');
const base64 = require('js-base64').Base64;
const request = require('request');

const GitHubError = require('./error');

/**
 * Client for the API.
 */
class GitHub {
    constructor(opts = {}) {
        this.opts = {
            // Endpoint for the API
            endpoint:  'https://api.github.com',
            // User-Agent to use for requests
            userAgent: 'octocat.js',
            // Access token
            token:     null,
            // Basic auth
            username:  null,
            password:  null,
            // Request default options
            request:   {},
            ...opts
        };
    }

    /**
     * Return the value for the authentication header.
     * @return {String}
     */
    getAuthorizationHeader() {
        const { token, username, password } = this.opts;

        if (token) {
            return `token ${this.opts.token}`;
        }
        else if (username) {
            return 'Basic ' + base64.encode(password ? `${username}:${password}` : username);
        }
        else {
            return undefined;
        }
    }

    /**
     * Parse an HTTP response to handle error.
     */
    onResponse(response, body, opts = {}) {
        opts = {
            successOn: ['2XX'],
            ...opts
        };

        const statusCode = response ? response.statusCode : 0;
        const statusType = Math.floor(statusCode / 100) + 'XX';
        const success = opts.successOn.some(status => (status == statusType || status == statusCode));

        // Try parsing body
        if ((opts.json || !success) && is.string(body)) {
            try {
                body = JSON.parse(body);
            } catch (e) {
                // Ignore errors
            }
        }

        // Build result object
        const result = {
            response,
            statusCode,
            statusType,
            headers: response ? response.headers : {},
            body
        };

        if (!success) {
            throw GitHubError.createForResponse(result);
        }

        return result;
    }

    /**
     * Execute an API request.
     */
    request(httpMethod, method, params, opts = {}) {
        opts = {
            headers: {},
            json: true,
            process(r) { },
            ...opts
        };

        httpMethod = httpMethod.toUpperCase();

        const d = Promise.defer();
        const uri = this.getURL(httpMethod, method, params);

        // Build request
        const r = request(
            {
                method: httpMethod,
                uri,
                json: opts.json,
                body: httpMethod != 'GET' ? params : undefined,
                headers: {
                    'User-Agent': this.opts.userAgent,
                    'Authorization': this.getAuthorizationHeader(),
                    ...opts.headers,
                    ...(opts.request.headers || {})
                }
            },
            (err, response, body) => {
                if (err) {
                    return d.reject(err);
                }

                try {
                    const result = this.onResponse(response, body, opts);
                    d.resolve(result);
                } catch (e) {
                    d.reject(e);
                }
            }
        );

        opts.process(r);

        return d.promise;
    }

    /**
     * HTTP methods
     */
    get(uri, params, opts) {
        return this.request('GET', this.url(uri), params);
    }
    post(uri, params, opts) {
        return this.client.post('POST', this.url(uri), params);
    }
    patch(uri, params, opts) {
        return this.client.patch('PATCH', this.url(uri), params);
    }
    del(uri, params, opts) {
        return this.client.del('DELETE', this.url(uri), params);
    }

    /**
     * Create a subresource for this client.
     * @param {ResourceClass} Type
     * @param {Mixed} ...args
     * @return {Resource}
     */
    resource(Type, ...args) {
        return new Type(this.client, ...args);
    }
}

module.exports = GitHub;
