var client = require('./client');

describe('Requests', function() {

    it('should correctly make a GET request', function() {
        return client.get('/repos/GitbookIO/gitbook')
        .then(function(response) {

        });
    });

    it('should be able to get rate limits', function() {
        return client.limit()
        .then(function(rate) {
            rate.should.have.property('limit');
            rate.should.have.property('remaining');
            rate.should.have.property('reset');
        });
    });

});

