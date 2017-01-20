const Resource = require('./resource');

/**
 * Resource to model a git branch.
 * https://developer.github.com/v3/repos/
 *
 * @type {Resource}
 */
class Branch extends Resource {
    constructor(client, repo, ref) {
        super(client);
        this.repo = repo;
        this.ref = ref;
    }

    /**
     * Return API endpoint for this branch
     */
    url(...args) {
        return this.repo.url(`branches/${this.ref}`, ...args);
    }

    /**
     * Get details about the branch
     * https://developer.github.com/v3/repos/#get-branch
     * @return {Promise<JSON>}
     */
    info() {
        return this.get('')
            .get('body');
    }
}

module.exports = Branch;
