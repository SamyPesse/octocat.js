var _ = require('lodash');
var Q = require('q');
var url = require('url');
var base64 = require('js-base64');
var querystring = require('querystring');
var request = require('request');

var GitHub = function(opts) {
    this.opts = _.defaults(opts || {}, {
        // Endpoint for the API
        endpoint: "https://api.github.com",

        // User-Agent to use for requests
        userAgent: "octocat.js",

        // Access token
        token: null,

        // Basic auth
        username: null,
        password: null
    });

    _.bindAll(this);
};

// Return the authorization header
GitHub.prototype.getAuthorizationHeader = function() {
    if (this.opts.token) {
        return 'token '+this.opts.token;
    } else if (this.opts.username) {
        var token = _.compact([
            this.opts.username,
            this.opts.password
        ]).join(':');

        return 'basic ' + base64.encode(token);
    } else {
        return undefined;
    }
};

// Basic API HTTP request
GitHub.prototype.request = function(httpMethod, method, params, opts) {
    var uri, r;
    var d = Q.defer();

    opts = _.defaults(opts || {}, {
        headers: {},
        json: true
    });

    httpMethod = httpMethod.toUpperCase();

    // Build url
    uri = url.resolve(this.opts.endpoint, method);
    if (httpMethod == 'GET') uri = uri + '?' + querystring.stringify(params);

    // Build request
    r = request({
        method: httpMethod,
        uri: uri,
        json: opts.json,
        headers: _.extend({
            'User-Agent': this.opts.userAgent,
            'Authorization': this.getAuthorizationHeader(),
        }, opts.headers)
    }, function(err, response, body) {
        if (err) {
            return d.reject(err);
        }

        var result = {
            statusCode: response? response.statusCode : 0,
            response: body
        };

        d.resolve(result);
    });

    return d.promise;
};

GitHub.prototype.get = _.partial(GitHub.prototype.request, 'GET');
GitHub.prototype.post = _.partial(GitHub.prototype.request, 'POST');
GitHub.prototype.put = _.partial(GitHub.prototype.request, 'PUT');
GitHub.prototype.del = _.partial(GitHub.prototype.request, 'DELETE');

module.exports = GitHub;
