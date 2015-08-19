var client = require('./client');

describe('Repository', function() {

    it('should correctly get infos about a repository', function() {
        var repo = client.repo('GitbookIO/gitbook')

        return repo.info()
        .then(function(details) {

        });
    });

});

