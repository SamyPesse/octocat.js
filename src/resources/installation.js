const Resource = require('./resource');

// https://developer.github.com/v3/integrations/
//
// To access the integration API, we must provide a custom media type in the
// Accept header.
const DEFAULT_HEADERS = {
    Accept: 'application/vnd.github.machine-man-preview+json'
};

/**
 * Model to represent an installation.
 * @type {Resource}
 */
class Installation extends Resource {

    /**
     * Return API endpoint for this application
     */
    url(...args) {
        return super.url('installation', ...args);
    }

    /**
     * List repositroy for an user or all.
     * @param  {String} userID?
     * @return {Authorization}
     */
    repos(userID, options = {}) {
        const params = {};
        if (userID) {
            params.user_id = userID;
        }

        return this.page('repositories', params, {
            ...options,
            headers: DEFAULT_HEADERS
        });
    }
}

module.exports = Installation;
