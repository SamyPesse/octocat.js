var _ = require('lodash');

var model = require('./model');
var pagination = require('./pagination');

var Installation = model.create(function() {});

// Create a request url
Installation.prototype.url = function() {
    return _.compact(
        ['/installation'].concat(_.toArray(arguments))
    ).join('/');
};

// List installation repositories
Installation.prototype.repos = pagination(function(userId) {
    var params = {};
    if (userId) {
        params.user_id = userId;
    }

    return {
        url: this.url('repositories'),
        query: params,
        opts: {
            headers: {
                Accept: 'application/vnd.github.machine-man-preview+json'
            }
        }
    };
});

module.exports = Installation;
