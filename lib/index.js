var _ = require('lodash');
var Q = require('q');
var url = require('url');
var base64 = require('js-base64').Base64;
var querystring = require('querystring');
var request = require('request');

var GitHubError = require('./error');
var model = require('./model');
var Repository = require('./repository');
var User = require('./user');
var Organization = require('./organization');
var Application = require('./application');
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
        password: null,

        // Request default options
        request: {}
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

// Handle response from a request
GitHub.prototype.onResponse = function(response, body, opts) {
    opts = _.defaults(opts || {}, {
        successOn: ['2XX']
    });

    var statusCode = response? response.statusCode : 0
    var statusType = Math.floor(statusCode/100)+'XX';

    var success = _.some(opts.successOn, function(status) {
        return (
            (_.isString(status) && status == statusType)
            || (status == statusCode)
        );
    });

    // Try parsing body
    if ((opts.json || !success) && _.isString(body)) {
        try {
            body = JSON.parse(body);
        } catch(e) {}
    }

    // Build result object
    var result = {
        statusCode: statusCode,
        statusType: statusType,
        headers: response? response.headers : {},
        body: body
    };

    if (!success) {
        throw new GitHubError(result);
    }

    return result;
}

// Basic API HTTP request
GitHub.prototype.request = function(httpMethod, method, params, opts) {
    var uri, r, that = this, body = new Buffer('');
    var d = Q.defer();

    opts = _.defaults(opts || {}, {
        headers: {},
        json: true,
        process: function(r) { }
    });

    httpMethod = httpMethod.toUpperCase();

    // Build url
    uri = url.resolve(this.opts.endpoint, method);
    if (httpMethod == 'GET') uri = uri + '?' + querystring.stringify(params || {});

    // Build request
    r = request(_.merge({
        method: httpMethod,
        uri: uri,
        json: opts.json,
        body: httpMethod != 'GET'? params : undefined,
        headers: _.extend({
            'User-Agent': this.opts.userAgent,
            'Authorization': this.getAuthorizationHeader(),
        }, opts.headers)
    }, this.opts.request), function(err, response, body) {
        if (err) return d.reject(err);

        try {
            var result = that.onResponse(response, body, opts);
            d.resolve(result);
        } catch(e) {
            d.reject(e);
        }
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

// Relations
GitHub.prototype.repo = model.getter(Repository);
GitHub.prototype.user = model.getter(User);
GitHub.prototype.org = model.getter(Organization);
GitHub.prototype.app = model.getter(Application);


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

// List email addresses for a user
// https://developer.github.com/v3/users/emails/#list-email-addresses-for-a-user
GitHub.prototype.userEmails = pagination(function() {
    return {
        url:'/user/emails'
    };
});

// Add email address(es)
// https://developer.github.com/v3/users/emails/#add-email-addresses
GitHub.prototype.addUserEmails = function(emails) {
    return this.post('/user/emails', emails)
        .get('body');
};

// Delete email address(es)
// https://developer.github.com/v3/users/emails/#delete-email-addresses
GitHub.prototype.deleteUserEmails = function(emails) {
    return this.del('/user/emails', emails)
        .get('body');
};

module.exports = GitHub;
