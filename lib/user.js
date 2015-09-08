var _ = require('lodash');
var util = require('util');

var model = require('./model');
var pagination = require('./pagination');

var User = model.create(function(userId) {
    this.id = userId;
});

// Create a request url
User.prototype.url = function() {
    return _.compact(
        [this.id? '/users/'+this.id : '/user'].concat(_.toArray(arguments))
    ).join('/');
};

// Get a single user
User.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

// Edit authenticated user
User.prototype.edit = function() {
    return this.client.patch(this.url())
        .get('body');
};

// Return list of repositories
// https://developer.github.com/v3/repos/#list-your-repositories
User.prototype.repos = pagination(function() {
    return {
        url: this.url('repos')
    };
});

// Return list of organizations
// https://developer.github.com/v3/orgs/#list-your-organizations
User.prototype.orgs = pagination(function() {
    return {
        url: this.url('orgs')
    };
});

module.exports = User;
