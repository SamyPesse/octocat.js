const Promise = require('q');
const Resource = require('./resource');

/**
 * Model to represent an organization.
 * @type {Resource}
 */
class Organization extends Resource {
    constructor(client, github, clientID) {
        super(client);
        this.id = clientID;
    }

    /**
     * Return API endpoint for this organization
     */
    url(...args) {
        return super.url(`orgs/${this.id}`, ...args);
    }

    // Get a single organization
    info() {
        return this.get('')
            .get('body');
    }


    // Edit this organization
    edit(params) {
        return this.patch('', params)
            .get('body');
    }

    // Check membership
    // https://developer.github.com/v3/orgs/members/#check-membership
    isMember(user) {
        return this.get(`members/${user}`)
        .then(() => {
            return true;
        }, () => {
            return Promise(false);
        });
    }

    // Return list of members
    // https://developer.github.com/v3/orgs/members/#members-list
    members(params, options) {
        return this.page('members', params, options);
    }

    // Create a new repository
    // https://developer.github.com/v3/repos/#create
    createRepo(info) {
        return this.post('repos', info)
            .get('body');
    }
}

module.exports = Organization;
