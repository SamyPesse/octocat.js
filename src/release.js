var Q = require('q');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var mime = require('mime-types');
var querystring = require('querystring');
var progress = require('progress-stream');

var model = require('./model');
var ReleaseAsset = require('./release-asset');

var Release = model.create(function(repo, releaseId) {
    this.repo = repo;
    this.id = releaseId;
    this._infos;
});

// Relations
Release.prototype.asset = model.getter(ReleaseAsset);

// Return list of assets
Release.prototype.assets = function() {
    return this.client.get(this.url('assets'))
        .get('body');
};

// Return api url for the release
Release.prototype.url = function(part) {
    return this.repo.url('releases/'+this.id, part);
};

// Get details about the release
Release.prototype.info = function() {
    var that = this;

    return this.client.get(this.url())
        .get('body')
        .tap(function(infos) {
            that._infos = infos;
        });
};

// Edit this release
Release.prototype.edit = function(params) {
    return this.client.patch(this.url(), params)
        .get('body');
};

// Upload an asset
Release.prototype.upload = function(output, opts) {
    var that = this;
    var originalOutput;

    opts = _.defaults(opts || {}, {
        name: null,
        label: undefined,
        mime: null,
        size: null
    });

    // Normalize to a stream
    if (_.isString(output)) {
        originalOutput = output;
        opts.name = opts.name || path.basename(output);
        output = fs.createReadStream(output);
    } else {
        if (!opts.name || !opts.size) throw "Need 'name' and 'size' options when uploading a stream";
    }
    if (!opts.mime) opts.mime = mime.lookup(opts.name) || 'application/octet-stream';

    return Q()
    .then(function() {
        if (opts.size) return opts.size;

        return Q.nfcall(fs.stat, originalOutput).get('size');
    })
    .then(function(size) {
        opts.size = size;
        return that._infos || that.info();
    })
    .then(function(release) {
        var count = 0;
        var d = Q.defer();

        var uploadUrl = release.upload_url.replace(/\{(\S+)\}/, '')+'?'+querystring.stringify({
            name: opts.name,
            label: opts.label
        });

        var prg = progress({
            length: opts.size,
            time: 100
        });

        prg.on('progress', function(state) {
            d.notify(state);
        });

        output.on('error', function(err) {
            d.reject(err);
        });

        that.client.post(uploadUrl, undefined, {
            json: false,
            headers: {
                'Content-Type': opts.mime,
                'Content-Length': opts.size
            },
            process: function(r) {
                output.pipe(prg).pipe(r);
            }
        })
        .then(function() {
            d.resolve();
        }, function(err) {
            d.reject(err);
        });

        return d.promise;
    });
};

// Remove the release
Release.prototype.destroy = function() {
    return this.client.del(this.url());
};

module.exports = Release;
