const GitHub = require('../src');

module.exports = new GitHub({
    token: process.env.GITHUB_TOKEN
});
