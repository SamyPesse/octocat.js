var model = require('./model');
var ReleaseAsset = require('./release-asset');

var Release = model.create(function(repo, releaseId) {
    this.repo = repo;
    this.id = releaseId;
});

// Relations
Release.prototype.asset = model.getter(ReleaseAsset);

// Get details about the release
Release.prototype.info = function() {
    return this.client.get(this.repo.url('releases/'+this.id))
        .get('body');
};


module.exports = Issue;
