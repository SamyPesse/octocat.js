const expect = require('expect');
const client = require('./client');

describe('Repository', () => {

    it('should correctly get infos about a repository', () => {
        const repo = client.repo('GitbookIO/gitbook');

        return repo.info()
        .then((details) => {
            expect(details.id).toBe(18280236);
        });
    });

});
