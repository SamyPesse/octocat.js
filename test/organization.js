const expect = require('expect');
const client = require('./client');

describe('Organization', () => {

    it('should correctly get infos about an organization', () => {
        const user = client.org('GitbookIO');

        return user.info()
        .then((details) => {
            expect(details.login).toEqual('GitbookIO');
        });
    });

});
