var _ = require('lodash');

var model = require('./model');
var pagination = require('./pagination');
var Issue = require('./issue');
var Release = require('./release');
var Hook = require('./hook');
var Commit = require('./commit');
var Branch = require('./branch');

var Repository = model.create(function(repoId) {
    this.id = repoId;
});

// Relations
Repository.prototype.issue = model.getter(Issue);
Repository.prototype.release = model.getter(Release);
Repository.prototype.hook = model.getter(Hook);
Repository.prototype.commit = model.getter(Commit);
Repository.prototype.branch = model.getter(Branch);

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

// Return list of branches
// https://developer.github.com/v3/repos/#list-branches
Repository.prototype.branches = pagination(function() {
    return {
        url: this.url('branches')
    };
});

// List Tags
// https://developer.github.com/v3/repos/#list-tags
Repository.prototype.tags = pagination(function() {
    return {
        url: this.url('tags')
    };
});

// Compare two commits
// https://developer.github.com/v3/repos/commits/#compare-two-commits
Repository.prototype.compare = function(base, head) {
    return this.client.get(this.url('compare/'+base+'...'+head))
        .get('body');
};

// Perform a merge
// https://developer.github.com/v3/repos/merging/
Repository.prototype.merge = function(params) {
    return this.client.post(this.url('merges'), params)
        .get('body');
};

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

// Create a status
// https://developer.github.com/v3/repos/statuses/#create-a-status
Repository.prototype.createStatus = function(sha, params) {
    return this.client.post(this.url('statuses', sha), params)
        .get('body');
};

// Remove the repository
Repository.prototype.destroy = function() {
    return this.client.del(this.url());
};

module.exports = Repository;
