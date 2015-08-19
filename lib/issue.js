var model = require('./model');

var Issue = model.create(function(repo, issueId) {
    this.repo = repo;
    this.id = issueId;
});

// Get details about the issue
Issue.prototype.info = function() {
    return this.client.get(this.repo.url('issues/'+this.id))
        .get('body');
};


module.exports = Issue;
