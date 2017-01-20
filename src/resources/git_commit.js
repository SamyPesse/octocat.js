const Resource = require('./resource');

/**
 * Resource to model a git commit.
 * https://developer.github.com/v3/git/commits/
 *
 * @type {Resource}
 */
class GitCommit extends Resource {
    constructor(client, repo, sha) {
        super(client);
        this.repo = repo;
        this.ref = sha;
    }

    /**
     * Return API endpoint for this commit.
     */
    url(...args) {
        return this.repo.url(`git/commits/${this.sha}/`, ...args);
    }

    /**
     * Get details about the commit.
     * https://developer.github.com/v3/git/commits/#get-a-commit
     * @return {Promise<JSON>}
     */
    info() {
        return this.client.get(this.url())
            .get('body');
    }
}

module.exports = GitCommit;
