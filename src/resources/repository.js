const Resource = require('./resource');
const Issue = require('./issue');
const Release = require('./release');
const Hook = require('./hook');
const Commit = require('./commit');
const Branch = require('./branch');
const GitRef = require('./git_ref');
const GitCommit = require('./git_commit');
const GitBlob = require('./git_blob');

/**
 * Model to represent a a repository.
 * @type {Resource}
 */
class Repository extends Resource {
    constructor(client, github, id) {
        super(client);
        this.id = id;
    }

    /**
     * Return API endpoint for this application
     */
    url(...args) {
        return super.url(`repos/${this.id}/`, ...args);
    }

    /**
     * Resources
     */
    issue(id) { return this.resource(Issue, id); }
    release(id) { return this.resource(Release, id); }
    hook(id) { return this.resource(Hook, id); }
    commit(id) { return this.resource(Commit, id); }
    branch(id) { return this.resource(Branch, id); }
    gitCommit(id) { return this.resource(GitCommit, id); }
    gitRef(id) { return this.resource(GitRef, id); }
    gitBlob(id) { return this.resource(GitBlob, id); }

    // Get details about the repository
    info() {
        return this.get('/')
            .get('body');
    }

    // Return list of releases
    releases(opts) {
        return this.page('releases', {}, opts);
    }

    // Return list of issues
    issues(opts) {
        return this.page('issues', {}, opts);
    }

    // Return list of hooks
    hooks(opts) {
        return this.page('hooks', {}, opts);
    }

    // Return list of branches
    // https://developer.github.com/v3/repos/#list-branches
    branches(opts) {
        return this.page('branches', {}, opts);
    }

    // List Tags
    // https://developer.github.com/v3/repos/#list-tags
    tags(opts) {
        return this.page('tags', {}, opts);
    }

    // Compare two commits
    // https://developer.github.com/v3/repos/commits/#compare-two-commits
    compare(base, head) {
        return this.get(`compare/${base}...${head}`)
            .get('body');
    }

    // Perform a merge
    // https://developer.github.com/v3/repos/merging/
    merge(params) {
        return this.client.post(this.url('merges'), params)
            .get('body');
    }

    // Create a new release
    createRelease(params) {
        return this.client.post(this.url('releases'), params)
            .get('body');
    }

    // Create an issue
    createIssue(params) {
        return this.client.post(this.url('issues'), params)
            .get('body');
    }

    // Create a hook
    // https://developer.github.com/v3/repos/hooks/#create-a-hook
    createHook(params) {
        return this.client.post(this.url('hooks'), params)
            .get('body');
    }

    // Create a status
    // https://developer.github.com/v3/repos/statuses/#create-a-status
    createStatus(sha, params) {
        return this.client.post(this.url('statuses', sha), params)
            .get('body');
    }

    // Remove the repository
    destroy() {
        return this.client.del(this.url());
    }

}

module.exports = Repository;
