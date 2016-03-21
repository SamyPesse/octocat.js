var model = require('./model');

var GitCommit = model.create(function(repo, sha) {
    this.repo = repo;
    this.sha = sha;
});

// Return api url for the git commit
GitCommit.prototype.url = function(part) {
    return this.repo.url('git/commits/'+this.sha, part);
};

// Get a Commit
// https://developer.github.com/v3/git/commits/#get-a-commit
GitCommit.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

module.exports = GitCommit;
