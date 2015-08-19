var _ = require('lodash');
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

// Edit this organization
Organization.prototype.edit = function(params) {
    return this.client.patch(this.url(), params)
        .get('body');
};

module.exports = Organization;
