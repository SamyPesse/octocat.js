const expect = require('expect');
const client = require('./client');

describe('Pagination', () => {

    it('should correctly return a Page object', () => {
        return client.repos()
        .then((page) => {
            expect(page.list).toBeAn('array');
            expect(page.next).toBeAn('function');
            expect(page.prev).toBeAn('function');

            return page.next();
        });
    });

});
