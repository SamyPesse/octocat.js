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
    repos(userID, opts) {
        const params = {};
        if (userID) {
            params.user_id = userID;
        }

        return this.page({
            url: this.url('repositories'),
            query: params,
            opts: {
                headers: DEFAULT_HEADERS
            }
        }, opts);
    }
}

module.exports = Installation;
