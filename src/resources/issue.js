const Resource = require('./resource');

/**
 * Resource to model an issue.
 * https://developer.github.com/v3/repos/issues/
 *
 * @type {Resource}
 */
class Issue extends Resource {
    constructor(client, repo, id) {
        super(client);
        this.repo = repo;
        this.id = id;
    }

    /**
     * Return API endpoint for this hook.
     */
    url(...args) {
        return this.repo.url(`issues/${this.id}`, ...args);
    }

    /**
     * Get a single issue.
     * @return {Promise<JSON>}
     */
    info() {
        return this.get('')
            .get('body');
    }

    /**
     * Edit an issue
     * @param  {Object} params
     * @return {Promise<JSON>}
     */
    edit(params) {
        return this.patch('', params)
            .get('body');
    }
}

module.exports = Issue;
