var model = require('./model');

var Hook = model.create(function(repo, issueId) {
    this.repo = repo;
    this.id = issueId;
});

// Return api url for the hook
Hook.prototype.url = function(part) {
    return this.repo.url('hooks/'+this.id, part);
};

// Get single hook
// https://developer.github.com/v3/repos/hooks/#get-single-hook
Hook.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

// Edit a hook
// https://developer.github.com/v3/repos/hooks/#edit-a-hook
Hook.prototype.edit = function(params) {
    return this.client.patch(this.url(), params)
        .get('body');
};

// Delete a hook
// https://developer.github.com/v3/repos/hooks/#delete-a-hook
Hook.prototype.destroy = function() {
    return this.client.del(this.url());
};

module.exports = Hook;
