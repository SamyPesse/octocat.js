var _ = require('lodash');
var util = require('util');

var model = require('./model');
var pagination = require('./pagination');
var Issue = require('./issue');
var Release = require('./release');

var Repository = model.create(function(repoId) {
    this.id = repoId;
});

// Relations
Repository.prototype.issue = model.getter(Issue);
Repository.prototype.release = model.getter(Release);

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

// Return list of issues
Repository.prototype.issues = pagination(function() {
    return {
        url: this.url('issues')
    };
});

// Create an issue
Repository.prototype.createIssue = function(params) {
    return this.client.post(this.url('issues'), params)
        .get('body');
};

module.exports = Repository;
