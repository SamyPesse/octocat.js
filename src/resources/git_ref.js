const Resource = require('./resource');

/**
 * Resource to model a git ref.
 * https://developer.github.com/v3/git/refs/
 *
 * @type {Resource}
 */
class GitRef extends Resource {
    constructor(client, repo, name) {
        super(client);
        this.repo = repo;
        this.name = name;
    }

    /**
     * Return API endpoint for this ref.
     */
    url(...args) {
        return this.repo.url(`git/refs/${this.name}`, ...args);
    }

    /**
     * Get details about the commit.
     * https://developer.github.com/v3/git/refs/#get-a-reference
     * @return {Promise<JSON>}
     */
    info() {
        return this.get('')
            .get('body');
    }

    /**
     * Update a Reference
     * https://developer.github.com/v3/git/refs/#update-a-reference
     * @param  {Object} params
     * @return {Promise<JSON>}
     */
    edit(params) {
        return this.patch('', params)
            .get('body');
    }

    /**
     * Delete a Reference
     * https://developer.github.com/v3/git/refs/#delete-a-reference
     * @return {Promise<JSON>}
     */
    destroy() {
        return this.del('')
            .get('body');
    }
}

module.exports = GitRef;
