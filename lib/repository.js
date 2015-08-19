var _ = require('lodash');
var util = require('util');

var model = require('./model');
var pagination = require('./pagination');
var Issue = require('./issue');

var Repository = model.create(function(repoId) {
    this.id = repoId;
});

// Relations
Repository.prototype.issue = model.getter(Issue);

// Create a request url
Repository.prototype.url = function() {
    return _.compact(
        ['/repos/'+this.id].concat(_.toArray(arguments))
    ).join('/');
};

// Get details about the repository
Repository.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

// Return list of releases
Repository.prototype.releases = pagination(function() {
    return {
        url: this.url('releases')
    };
});

module.exports = Repository;
