var client = require('./client');

describe('Pagination', function() {

    it('should correctly return a Page object', function() {
        return client.repos()
        .then(function(page) {
            page.should.have.property('list');
            page.should.have.property('next');
            page.should.have.property('prev');

            return page.next().then(function(page) {
            });
        });
    });

});

