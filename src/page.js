const Promise = require('q');

const DEFAULT_OPTIONS = {
    page: 1,
    per_page: 100,
    headers: {}
};

/**
 * Page that can be updated to iterate over pagination.
 * @type {Class}
 */
class Page {
    constructor(client, uri, params, options = DEFAULT_OPTIONS) {
        this.list = [];
        this.links = {};
        this.client = client;
        this.url = uri;
        this.params = params || {};
        this.options = options;
    }

    /**
     * Fetch current page.
     * @return {Promise<Page>}
     */
    fetch(uri) {
        const { page, per_page, headers } = this.options;

        return this.client.get(
            this.url,
            {
                ...this.params,
                page, per_page
            },
            { headers }
        )
        .then((response) => {
            this.list = response.body;
            this.links = parseLinkHeader(response.headers.link);

            // Return itself
            return this;
        });
    }

    /**
     * Update the page by fetching a specific url.
     * @param {String} uri
     * @return {Promise<Page>}
     */
    update(uri) {
        this.url = uri;
        return this.fetch();
    }

    // Has next or previous page
    hasNext() {
        return !!this.links.next;
    }
    hasPrev() {
        return !!this.links.prev;
    }

    /**
     * Fetch next page.
     * @return {Promise<Page>}
     */
    next() {
        if (!this.hasNext()) {
            return Promise.reject(new Error('Paginated results doesn\'t have nore page'));
        }
        return this.update(this.links.next);
    }

    /**
     * Fetch previous page.
     * @return {Promise<Page>}
     */
    prev() {
        if (!this.hasPrev()) {
            return Promise.reject(new Error('Paginated results doesn\'t have a precedent page'));
        }
        return this.update(this.links.prev);
    }

    /**
     * Fetch all items by iterating over pages.
     * @return {Promise<Array>}
     */
    all() {
        let results = [];

        function handlePage(page) {
            results = results.concat(page.list);

            if (!page.hasNext()) {
                return results;
            }
            return page.next().then(handlePage);
        }

        return Promise(handlePage(this));
    }

}

/**
 * Extract next and prev from link header
 * @param  {String} header
 * @return {Object}
 */
function parseLinkHeader(header) {
    if (!header) {
        return {};
    }

    // Split parts by comma
    const parts = header.split(',');
    const links = {};

    // Parse each part into a named link
    parts.forEach((p) => {
        const section = p.split(';');
        if (section.length != 2) {
            throw new Error('section could not be split on ";"');
        }
        const url = section[0].replace(/<(.*)>/, '$1').trim();
        const name = section[1].replace(/rel="(.*)"/, '$1').trim();
        links[name] = url;
    });

    return links;
}

module.exports = Page;
