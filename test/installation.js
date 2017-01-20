const client = require('./client');

describe('Installation', () => {
    if (!process.env.GITHUB_TOKEN) {
        return;
    }

    it('should correctly get infos about installation repositories', () => {
        const installation = client.installation();

        return installation.repos();
    });

});
