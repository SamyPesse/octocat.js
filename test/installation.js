var client = require('./client');

if (!process.env.GITHUB_TOKEN) return;

describe('Installation', function() {

    it('should correctly get infos about installation repositories', function() {
        var installation = client.installation()

        return installation.repos()
        .then(function(page) {
            page.should.have.property('list');
            page.should.have.property('next');
            page.should.have.property('prev');
        });
    });

});

