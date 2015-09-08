var _ = require('lodash');
var util = require('util');

var model = require('./model');
var pagination = require('./pagination');
var Issue = require('./issue');
var Release = require('./release');
var Hook = require('./hook');

var Repository = model.create(function(repoId) {
    this.id = repoId;
});

// Relations
Repository.prototype.issue = model.getter(Issue);
Repository.prototype.release = model.getter(Release);
Repository.prototype.hook = model.getter(Hook);

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

// Return list of hooks
Repository.prototype.hooks = pagination(function() {
    return {
        url: this.url('hooks')
    };
});

// Create a new release
Repository.prototype.createRelease = function(params) {
    return this.client.post(this.url('releases'), params)
        .get('body');
};

// Create an issue
Repository.prototype.createIssue = function(params) {
    return this.client.post(this.url('issues'), params)
        .get('body');
};

// Create a hook
// https://developer.github.com/v3/repos/hooks/#create-a-hook
Repository.prototype.createHook = function(params) {
    return this.client.post(this.url('hooks'), params)
        .get('body');
};

// Remove the repository
Repository.prototype.destroy = function() {
    return this.client.del(this.url());
};

module.exports = Repository;
