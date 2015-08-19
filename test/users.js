var client = require('./client');

describe('User', function() {

    it('should correctly get infos about an user', function() {
        var user = client.user('SamyPesse')

        return user.info()
        .then(function(details) {

        });
    });

});

