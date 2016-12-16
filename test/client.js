var should = require('should');
var GitHub = require('../lib');

module.exports = new GitHub({
    token: process.env.GITHUB_TOKEN
});
