var _ = require('lodash');
var Q = require('q');
var fs = require('fs');

var model = require('./model');

var ReleaseAsset = model.create(function(release, releaseId) {
    this.release = release;
    this.id = releaseId;
});

// Return api url to the asset
ReleaseAsset.prototype.url = function() {
    return this.release.repo.url('releases/assets/'+this.id);
};

// Get details about the asset
ReleaseAsset.prototype.info = function() {
    var that = this;

    return this.client.get(this.url())
        .get('body');
};

// Download the asset
ReleaseAsset.prototype.download = function(output) {
    var d = Q.defer();
    var that = this;

    // Normalize to a stream
    if (_.isString(output)) {
        output = fs.createReadStream(output);
    }

    output.on('error', function(err) {
        d.reject(err);
    });

    this.client.get(this.url(), {}, {
        headers: {
            'Accept': 'application/octet-stream'
        },
        process: function(r) {
            r.pipe(output);
        }
    })
    .then(function() {
        d.resolve();
    }, function(err) {
        d.reject(err);
    });

    return d.promise;
};

// Remove the asset
ReleaseAsset.prototype.destroy = function() {
    return this.client.del(this.url);
};

module.exports = ReleaseAsset;
