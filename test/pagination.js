const expect = require('expect');
const client = require('./client');

describe('Pagination', () => {

    it('should correctly return a Page object', () => {
        return client.repos()
        .then((page) => {
            expect(page).toIncludeKey('list');
            expect(page).toIncludeKey('next');
            expect(page).toIncludeKey('prev');

            return page.next();
        });
    });

});
