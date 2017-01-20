const Resource = require('./resource');

/**
 * Resource to model a hook.
 * https://developer.github.com/v3/repos/hooks/
 *
 * @type {Resource}
 */
class Hook extends Resource {
    constructor(client, repo, id) {
        super(client);
        this.repo = repo;
        this.id = id;
    }

    /**
     * Return API endpoint for this hook.
     */
    url(...args) {
        return this.repo.url(`hooks/${this.id}`, ...args);
    }

    /**
     * Get a single hook.
     * https://developer.github.com/v3/repos/hooks/#get-single-hook
     * @return {Promise<JSON>}
     */
    info() {
        return this.get('')
            .get('body');
    }

    /**
     * Edit a hook.
     * https://developer.github.com/v3/repos/hooks/#edit-a-hook
     * @param  {Object} params
     * @return {Promise<JSON>}
     */
    edit(params) {
        return this.patch('', params)
            .get('body');
    }

    /**
     * Delete a hook.
     * https://developer.github.com/v3/repos/hooks/#delete-a-hook
     * @return {Promise<JSON>}
     */
    destroy() {
        return this.del('')
            .get('body');
    }
}

module.exports = Hook;
