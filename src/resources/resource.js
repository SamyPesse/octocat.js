const joinURL = require('url-join');

/**
 * Resource from the API.
 * @type {Class}
 */
class Resource {
    constructor(client) {
        this.client = client;
    }

    /**
     * Create an url.
     * @return {String}
     */
    url(...args) {
        return joinURL(...args);
    }

    /**
     * HTTP methods
     */
    get(uri, params, opts) {
        return this.client.get(this.url(uri), params, opts);
    }
    post(uri, params, opts) {
        return this.client.post(this.url(uri), params, opts);
    }
    patch(uri, params, opts) {
        return this.client.patch(this.url(uri), params, opts);
    }
    del(uri, params, opts) {
        return this.client.del(this.url(uri), params, opts);
    }

    /**
     * Create a subresource for this resource.
     * @param {ResourceClass} Type
     * @param {Mixed} ...args
     * @return {Resource}
     */
    resource(Type, ...args) {
        return this.client.resource(Type, this, ...args);
    }

    /**
     * Return a pagination.
     * @param  {Object} request
     * @param  {Object} options
     * @return {Page}
     */
    page(request, options) {

    }
}

module.exports = Resource;
