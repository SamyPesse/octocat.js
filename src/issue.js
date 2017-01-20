var model = require('./model');

var Issue = model.create(function(repo, issueId) {
    this.repo = repo;
    this.id = issueId;
});

// Return api url for the issue
Issue.prototype.url = function(part) {
    return this.repo.url('issues/'+this.id, part);
};

// Get details about the issue
Issue.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

// Edit this issue
Issue.prototype.edit = function(params) {
    return this.client.patch(this.url(), params)
        .get('body');
};

module.exports = Issue;
