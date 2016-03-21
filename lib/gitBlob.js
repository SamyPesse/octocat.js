var model = require('./model');

var GitBlob = model.create(function(repo, sha) {
    this.repo = repo;
    this.sha = sha;
});

// Return api url for the git commit
GitBlob.prototype.url = function(part) {
    return this.repo.url('git/blobs/'+this.sha, part);
};

// Get a Blob
// https://developer.github.com/v3/git/blobs/#get-a-blob
GitBlob.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

module.exports = GitBlob;
