const expect = require('expect');
const client = require('./client');

describe('Requests', () => {

    it('should correctly make a GET request', () => {
        return client.get('/repos/GitbookIO/gitbook')
        .then((response) => {
            expect(response.body).toBeAn('object');
            expect(response.headers).toBeAn('object');
        });
    });

    it('should be able to get rate limits', () => {
        return client.limit()
        .then((rate) => {
            expect(rate.limit).toBeAn('number');
            expect(rate.remaining).toBeAn('number');
        });
    });

});
