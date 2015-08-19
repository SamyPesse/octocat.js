var Q = require('q');
var querystring = require('querystring');
var _ = require('lodash');

// Extract next and prev from link header
function parseLinkHeader(header) {
    // Split parts by comma
    var parts = header.split(',');
    var links = {};

    // Parse each part into a named link
    _.each(parts, function(p) {
        var section = p.split(';');
        if (section.length != 2) {
            throw new Error("section could not be split on ';'");
        }
        var url = section[0].replace(/<(.*)>/, '$1').trim();
        var name = section[1].replace(/rel="(.*)"/, '$1').trim();
        links[name] = url;
    });
    return links;
}

var Page = function(client, request) {
    this.list = [];
    this.links = {};
    this.client = client;
    this.request = request;

    _.bindAll(this);
};

// Update results
Page.prototype.update = function(uri) {
    var that = this;

    that.request.url = uri;
    return this.client.get(uri, this.request.query, this.request.opts)
    .then(function(response) {
        that.list = response.body;
        that.links = parseLinkHeader(response.headers.link);

        // Return itself
        return that;
    });
};

// Has next or previous page
Page.prototype.hasNext = function() {
    return !!this.links.next;
};
Page.prototype.hasPrev = function() {
    return !!this.links.prev;
};

// Navigate the pages
Page.prototype.next = function() {
    if (!this.hasNext()) return Q.reject(new Error("Paginated results doesn't have nore page"));
    return this.update(this.links.next);
};
Page.prototype.prev = function() {
    if (!this.hasPrev()) return Q.reject(new Error("Paginated results doesn't have a precedent page"));
    return this.update(this.links.prev);
};

// Handle a paginated method
module.exports = function(fn) {
    return function() {
        var opts = {};
        var args = _.toArray(arguments);

        // Extract options
        if (_.isObject(args[args.length - 1])) {
            opts = args.pop();
        }
        opts = _.defaults(opts, {
            page: 0,
            perPage: 100
        });

        // Get request
        var request = fn.apply(this, args);
        var client = this.client || this;

        // Apply page and perPage
        request.url = request.url + '?' + querystring.stringify({
            page: opts.page,
            per_page: opts.perPage
        });

        // Create page object
        var page = new Page(client, request);

        return page.update(request.url);
    };
};
