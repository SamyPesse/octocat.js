var client = require('./client');

describe('Requests', function() {

    it('should correctly make a GET request', function() {
        return client.get('/repos/SamyPesse/octocat.js')
        .then(function(response) {

        });
    });

});

