var client = require('./client');

describe('Organization', function() {

    it('should correctly get infos about an organization', function() {
        var user = client.org('GitbookIO')

        return user.info()
        .then(function(details) {

        });
    });

});

