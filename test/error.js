var client = require('./client');

describe('Error', function() {

    it('should correctly normalize an error', function() {
        var repo = client.repo('GitbookIO/gitbook-nonexistant-repo')

        return repo.info()
        .then(function(details) {
            throw new Error('Should have returned an error');
        }, function(err) {
            err.name.should.equal('GitHubError');
            err.message.should.equal('Not Found');
            err.statusCode.should.equal(404);
        });
    });

});

