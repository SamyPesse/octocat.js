const Resource = require('./resource');

/**
 * Model to represent an user.
 * @type {Resource}
 */
class User extends Resource {
    constructor(client, github, id) {
        super(client);
        this.id = id;
    }

    /**
     * Return API endpoint for this user
     */
    url(...args) {
        return super.url(this.id ? `users/${this.id}` : 'user', ...args);
    }
    // Get a single user
    info() {
        return this.get('')
            .get('body');
    }

    // Edit authenticated user
    edit(params) {
        return this.patch('', params)
            .get('body');
    }

    /**
     * List repositories for this user.
     * https://developer.github.com/v3/repos/#list-your-repositories
     *
     * @param  {Object} options
     * @return {Promise<Page>}
     */
    repos(options) {
        return this.page('repos', {}, options);
    }

    /**
     * List organizations for this user.
     * https://developer.github.com/v3/orgs/#list-your-organizations
     *
     * @param  {Object} options
     * @return {Promise<Page>}
     */
    orgs(options) {
        return this.page('orgs', {}, options);
    }

    // Create a new repository
    // https://developer.github.com/v3/repos/#create
    createRepo(info) {
        return this.post('repos', info)
            .get('body');
    }

    // Add email address(es)
    // https://developer.github.com/v3/users/emails/#add-email-addresses
    addUserEmails(emails) {
        return this.post('emails', emails)
            .get('body');
    }

    // Delete email address(es)
    // https://developer.github.com/v3/users/emails/#delete-email-addresses
    deleteUserEmails(emails) {
        return this.del('emails', emails)
            .get('body');
    }

    // Check a membership
    // https://developer.github.com/v3/orgs/members/#get-your-organization-membership
    getOrgMembership(org) {
        return this.get(`memberships/orgs/${org}`)
            .get('body');
    }

    // List current user's memberships to all of his organizations
    // https://developer.github.com/v3/orgs/members/#list-your-organization-memberships
    getOrgsMemberships(params, options) {
        return this.page('memberships/orgs', params, options);
    }
}

module.exports = User;
