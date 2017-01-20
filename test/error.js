const expect = require('expect');
const client = require('./client');

describe('Error', () => {

    it('should correctly normalize an error', () => {
        const repo = client.repo('GitbookIO/gitbook-nonexistant-repo');

        return repo.info()
        .then((details) => {
            throw new Error('Should have returned an error');
        }, (err) => {
            expect(err.name).toEqual('GitHubError');
            expect(err.message).toEqual('Not Found');
            expect(err.statusCode).toEqual(404);
            expect(err.statusType).toEqual('4XX');
            expect(err.response).toExist();
        });
    });

});
