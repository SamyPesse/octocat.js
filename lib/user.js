var _ = require('lodash');
var util = require('util');

var model = require('./model');
var pagination = require('./pagination');

var User = model.create(function(userId) {
    this.id = userId;
});

// Create a request url
User.prototype.url = function() {
    return _.compact(
        ['/user/'+this.id].concat(_.toArray(arguments))
    ).join('/');
};

// Get details about the repository
User.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

// Return list of repositories
User.prototype.repositories = pagination(function() {
    return {
        url: this.url('repos')
    };
});

module.exports = User;
