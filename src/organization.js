var _ = require('lodash');
var Q = require('q');
var util = require('util');

var model = require('./model');
var pagination = require('./pagination');

var Organization = model.create(function(orgId) {
    this.id = orgId;
});

// Return url for the org in the api
Organization.prototype.url = function() {
    return _.compact(
        ['/orgs/'+this.id].concat(_.toArray(arguments))
    ).join('/');
};

// Get a single organization
Organization.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

// Return list of repositories
Organization.prototype.repositories = pagination(function() {
    return {
        url: this.url('repos')
    };
});

// Return list of members
// https://developer.github.com/v3/orgs/members/#members-list
Organization.prototype.members = pagination(function() {
    return {
        url: this.url('members')
    };
});

// Check membership
// https://developer.github.com/v3/orgs/members/#check-membership
Organization.prototype.isMember = function(user) {
    return this.client.get(this.url('members/'+user))
    .then(function() {
        return true;
    }, function() {
        return Q(false);
    });
};

// Edit this organization
Organization.prototype.edit = function(params) {
    return this.client.patch(this.url(), params)
        .get('body');
};

// Create a new repository
// https://developer.github.com/v3/repos/#create
Organization.prototype.createRepo = function(info) {
    return this.client.post(this.url('repos'), info)
        .get('body');
};

module.exports = Organization;
