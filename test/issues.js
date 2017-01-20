const expect = require('expect');
const client = require('./client');

describe('Issues', () => {

    it('should correctly get infos about an issue', () => {
        const repo = client.repo('GitbookIO/gitbook');
        const issue = repo.issue(200);

        return issue.info()
        .then((details) => {
            expect(details.number).toEqual('200');
        });
    });

    it('should correctly list issues for a repository', () => {
        const repo = client.repo('GitbookIO/gitbook');

        return repo.issues()
        .then((page) => {
            expect(page.list[0]).toIncludeKey('number');
        });
    });

});
