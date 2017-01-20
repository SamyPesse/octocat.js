const Resource = require('./resource');

/**
 * Resource to model an oauth authorization.
 * https://developer.github.com/v3/oauth_authorizations
 *
 * @type {Resource}
 */
class Authorization extends Resource {
    constructor(client, app, tokenID) {
        super(client);
        this.app = app;
        this.token = tokenID;
    }

    /**
     * Return API endpoint for this authorization
     */
    url(...args) {
        return this.app.url(`tokens/${this.token}/`, ...args);
    }

    /**
     * Get a token resource for this application.
     * @param  {String} tokenID
     * @return {Authorization}
     */
    token(tokenID) {
        return this.resource(Authorization, tokenID);
    }

    /**
     * Get details about the authorization
     * https://developer.github.com/v3/oauth_authorizations/#check-an-authorization
     * @return {Promise<JSON>}
     */
    info() {
        return this.client.get(this.url())
            .get('body');
    }

    /**
     * Reset an authorization
     * https://developer.github.com/v3/oauth_authorizations/#reset-an-authorization
     * @return {Promise<JSON>}
     */
    reset() {
        return this.client.post(this.url())
            .get('body');
    }

    /**
     * Revoke an authorization for an application
     * https://developer.github.com/v3/oauth_authorizations/#revoke-an-authorization-for-an-application
     * @return {Promise<JSON>}
     */
    destroy() {
        return this.client.del(this.url())
            .get('body');
    }
}

module.exports = Authorization;
