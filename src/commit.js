var model = require('./model');
var pagination = require('./pagination');

var Commit = model.create(function(repo, ref) {
    this.repo = repo;
    this.ref = ref;
});

// Return api url for the commit
Commit.prototype.url = function(part) {
    return this.repo.url('commits/'+this.ref, part);
};

// Get a single commit
// https://developer.github.com/v3/repos/commits/#get-a-single-commit
Commit.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

// List Statuses for a specific Ref
// https://developer.github.com/v3/repos/statuses/#list-statuses-for-a-specific-ref
Commit.prototype.statuses = pagination(function() {
    return {
        url: this.url('statuses')
    };
});


module.exports = Commit;
