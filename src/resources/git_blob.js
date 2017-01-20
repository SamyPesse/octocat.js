const Resource = require('./resource');

/**
 * Resource to model a git blob.
 * https://developer.github.com/v3/git/blobs/
 *
 * @type {Resource}
 */
class GitBlob extends Resource {
    constructor(client, repo, sha) {
        super(client);
        this.repo = repo;
        this.ref = sha;
    }

    /**
     * Return API endpoint for this blob.
     */
    url(...args) {
        return this.repo.url(`git/blobs/${this.sha}/`, ...args);
    }

    /**
     * Get details about the blob.
     * https://developer.github.com/v3/git/blobs/#get-a-blob
     * @return {Promise<JSON>}
     */
    info() {
        return this.client.get(this.url())
            .get('body');
    }
}

module.exports = GitBlob;
