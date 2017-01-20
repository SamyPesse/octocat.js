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

    it('should correctly make a POST request', () => {
        return client.post('/repos/GitbookIO/something')
        .then((response) => {
            throw new Error('should have fail');
        }, (err) => {
            expect(err.statusCode).toBe(404);
        });
    });

    it('should correctly make a PATCH request', () => {
        return client.patch('/repos/GitbookIO/something')
        .then((response) => {
            throw new Error('should have fail');
        }, (err) => {
            expect(err.statusCode).toBe(404);
        });
    });

    it('should correctly make a DELETE request', () => {
        return client.del('/repos/GitbookIO/something')
        .then((response) => {
            throw new Error('should have fail');
        }, (err) => {
            expect(err.statusCode).toBe(404);
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
