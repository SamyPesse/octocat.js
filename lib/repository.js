var _ = require('lodash');
var util = require('util');


var model = require('./model');
var Issue = require('./issue');

var Repository = model.create(function(repoId) {
    this.id = repoId;
});

// Relations
Repository.prototype.issue = model.getter(Issue);

// Create a request url
Repository.prototype.url = function(suffix) {
    return _.compact(['/repos/'+this.id, suffix]).join('/');
}

// Get details about the repository
Repository.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};


module.exports = Repository;
