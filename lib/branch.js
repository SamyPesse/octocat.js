var model = require('./model');

var Branch = model.create(function(repo, ref) {
    this.repo = repo;
    this.ref = ref;
});

// Return api url for the branch
Branch.prototype.url = function(part) {
    return this.repo.url('branches/'+this.ref, part);
};

// Get Branch
// https://developer.github.com/v3/repos/#get-branch
Branch.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

module.exports = Branch;
