var _ = require('lodash');
var Q = require('q');
var url = require('url');
var base64 = require('js-base64').Base64;
var querystring = require('querystring');
var request = require('request');

var model = require('./model');
var Repository = require('./repository');
var User = require('./user');
var Organization = require('./organization');
var pagination = require('./pagination');


var GitHub = function(opts) {
    if (!(this instanceof GitHub)) return new GitHub(opts);

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
        json: true,
        successOn: ['2XX'],
        process: function() {}
    });

    httpMethod = httpMethod.toUpperCase();

    // Build url
    uri = url.resolve(this.opts.endpoint, method);
    if (httpMethod == 'GET') uri = uri + '?' + querystring.stringify(params || {});

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

        var statusCode = response? response.statusCode : 0
        var statusType = Math.floor(statusCode/100)+'XX';

        var success = _.some(opts.successOn, function(status) {
            return (
                (_.isString(status) && status == statusType)
                || (status == statusCode)
            );
        });


        var result = {
            statusCode: statusCode,
            statusType: statusType,
            headers: response? response.headers : {},
            body: body
        };


        if (!success) {
            var err = new Error("Error "+statusCode);
            err.result = result;

            // Use message from request body
            if (body && body.message) err.message = body.message;

            return d.reject(err);
        }

        d.resolve(result);
    });

    opts.process(r);

    return d.promise;
};

GitHub.prototype.get = _.partial(GitHub.prototype.request, 'GET');
GitHub.prototype.patch = _.partial(GitHub.prototype.request, 'PATCH');
GitHub.prototype.post = _.partial(GitHub.prototype.request, 'POST');
GitHub.prototype.put = _.partial(GitHub.prototype.request, 'PUT');
GitHub.prototype.del = _.partial(GitHub.prototype.request, 'DELETE');

// Return API limits
GitHub.prototype.limit = function() {
    return this.get('/rate_limit')
        .get('body')
        .get('rate');
};

// Get a single repository
GitHub.prototype.repo = model.getter(Repository);

// Get a single user
GitHub.prototype.user = model.getter(User);

// Get a single org
GitHub.prototype.org = model.getter(Organization);

// Get the authenticated user
GitHub.prototype.me = function() {
    return (new User(this));
};

// List all public repositories
GitHub.prototype.repos = pagination(function() {
    return {
        url:'/repositories'
    };
});

// List repositories that are accessible to the authenticated user.
GitHub.prototype.userRepos = pagination(function() {
    return {
        url:'/user/repos'
    };
});

module.exports = GitHub;
