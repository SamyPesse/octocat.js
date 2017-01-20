const Resource = require('./resource');

/**
 * Resource to model a git branch.
 * https://developer.github.com/v3/repos/commits/#get-a-single-commit
 *
 * @type {Resource}
 */
class Commit extends Resource {
    constructor(client, repo, sha) {
        super(client);
        this.repo = repo;
        this.ref = sha;
    }

    /**
     * Return API endpoint for this commit.
     */
    url(...args) {
        return this.repo.url(`commits/${this.sha}/`, ...args);
    }

    /**
     * Get details about the commit.
     * https://developer.github.com/v3/repos/commits/#get-a-single-commit
     * @return {Promise<JSON>}
     */
    info() {
        return this.client.get(this.url())
            .get('body');
    }

    /**
     * List Statuses for a specific commit.
     * https://developer.github.com/v3/repos/statuses/#list-statuses-for-a-specific-ref
     *
     * @return {Pagination}
     */
    statuses(options) {
        return this.page('statuses', {}, options);
    }
}

module.exports = Commit;
