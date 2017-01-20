const expect = require('expect');
const client = require('./client');

describe('User', () => {

    it('should correctly get infos about an user', () => {
        const user = client.user('SamyPesse');

        return user.info()
        .then((details) => {
            expect(details.login).toEqual('SamyPesse');
        });
    });

});
