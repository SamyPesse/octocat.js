var model = require('./model');

var Authorization = model.create(function(app, token) {
    this.app = app;
    this.token = token;
});

// Return api url for the issue
Authorization.prototype.url = function(part) {
    return this.app.url('tokens/'+this.token, part);
};

// Get details about the authorization
// https://developer.github.com/v3/oauth_authorizations/#check-an-authorization
Authorization.prototype.info = function() {
    return this.client.get(this.url())
        .get('body');
};

// Reset an authorization
// https://developer.github.com/v3/oauth_authorizations/#reset-an-authorization
Authorization.prototype.reset = function() {
    return this.client.post(this.url())
        .get('body');
};

// Revoke an authorization for an application
// https://developer.github.com/v3/oauth_authorizations/#revoke-an-authorization-for-an-application
Authorization.prototype.destroy = function() {
    return this.client.del(this.url());
};

module.exports = Authorization;
