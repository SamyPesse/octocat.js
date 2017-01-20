var model = require('./model');

var GitRef = model.create(function(repo, ref) {
    this.repo = repo;
    this.id = ref;
});

// Return api url for the git ref
GitRef.prototype.url = function(part) {
    return this.repo.url('git/refs/'+this.id, part);
};

// Get a Reference
// https://developer.github.com/v3/git/refs/#get-a-reference
GitRef.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

// Update a Reference
// https://developer.github.com/v3/git/refs/#update-a-reference
GitRef.prototype.edit = function(params) {
    return this.client.patch(this.url(), params)
        .get('body');
};

// Delete a Reference
// https://developer.github.com/v3/git/refs/#delete-a-reference
GitRef.prototype.destroy = function() {
    return this.client.del(this.url());
};

module.exports = GitRef;
