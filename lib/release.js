var path = require('path');
var mime = require('mime-types');

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

    opts = _.defaults(opts || {}, {
        name: null,
        mime: null
    });

    // Normalize to a stream
    if (_.isString(output)) {
        opts.name = opts.name || path.basename(output);
        output = fs.createReadStream(output);
    } else {
        if (!opts.name) throw "Need a 'name' when uploading a stream";
    }
    if (!opts.mime) opts.mime = mime.lookup(opts.name) || 'application/octet-stream';

    return Q()
    .then(function() {
        return that._infos || that.info();
    })
    .then(function(release) {
        var d = Q.defer();
        var uploadUrl = release.uploadUrl.replace('{?name}', '?name='+encodeURIComponent(opts.name));

        output.on('error', function(err) {
            d.reject(err);
        });

        that.client.post(uploadUrl, {}, {
            headers: {
                'Content-Type': opts.mime
            },
            process: function(r) {
                output.pipe(r);
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


module.exports = Release;
