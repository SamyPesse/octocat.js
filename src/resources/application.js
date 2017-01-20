const Resource = require('./resource');
const Authorization = require('./authorization');

/**
 * Model to represent an oauth application.
 * @type {Resource}
 */
class Application extends Resource {
    constructor(client, clientID) {
        super(client);
        this.id = clientID;
    }

    /**
     * Return API endpoint for this application
     */
    url(...args) {
        return super.url(`applications/${this.id}/`, ...args);
    }

    /**
     * Get a token resource for this application.
     * @param  {String} tokenID
     * @return {Authorization}
     */
    token(tokenID) {
        return this.resource(Authorization, tokenID);
    }
}

module.exports = Application;
