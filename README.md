# octocat.js

[![npm version](https://badge.fury.io/js/octocat.svg)](http://badge.fury.io/js/octocat)
[![Build Status](https://travis-ci.org/SamyPesse/octocat.js.png?branch=master)](https://travis-ci.org/SamyPesse/octocat.js)

Javascript library to access the GitHub API.

- ✨ Promise based
- ✨ Support GitHub Enterprise
- ✨ Easy handling of paginated results

### Installation

```
$ npm install octocat --save
```

### Usage

#### Create an API client

```js
const GitHub = require('octocat');

// Using an access token
const client = new GitHub({
    token: 'my-access-token'
});

// Using an username/password
const client = new GitHub({
    username: 'SamyPesse',
    password: 'my-password'
});

// Connecting to an enterprise version
const client = new GitHub({
    endpoint: 'https:///github.mycompany.com'
});
```

#### HTTP API access

All of these methods return promises.

```js
client.request('GET', '/repos/SamyPesse/octocat.js', { /* query/body parameters */})

client.get('/repos/SamyPesse/octocat.js', { /* query parameters */})
client.post('/repos/SamyPesse/octocat.js', { /* body parameters */})
client.patch('/repos/SamyPesse/octocat.js', { /* body parameters */})
client.put('/repos/SamyPesse/octocat.js', { /* body parameters */})
client.del('/repos/SamyPesse/octocat.js', { /* body parameters */})
```

These methods return a `response` object that looks like:

```js
{
    // HTTP Status code
    statusCode: 200,

    // Type of status: 2XX, 3XX, 4xx
    statusType: '2XX',

    // Headers returned by the server
    headers: { ... },

    // Body of the request
    body: { ... }
}
```

In case of error, the response can also be accessible using as a `response` property.

#### Pagination

Some methods of Octonode return paginated results. Check on GitHub which API methods are paginated.

These methods return a `Page` object:

- `page.list` contains the list of results in the current page
- `page.next()` update with the results of the next page (Promised)
- `page.prev()` update with the results of the previous page (Promised)
- `page.hasNext()` and `page.hasPrev()`
- `page.all()` return all the results by recursively calling the API

#### Users

```js
// Get a single user
const user = client.user('SamyPesse');
user.info().then(function(infos) { ... });

// Get the authenticated user
const user = client.me();

// Edit the authenticated user
user.edit({
    name: "New Name"
})
```

#### Repositories

```js
// Create a new repository
client.createRepo({ ... }).then(function() { });

// Get public repositories (paginated)
client.repos().then(function(page) { ... });

// List user repositories
user.repos().then(function(page) { ... });

// Get a single repository
const repo = client.repo('SamyPesse/octocat.js');
repo.info().then(function(infos) { ... });

// Compare two commits
repo.compare('master', 'dev').then(function(infos) { ... });

// Perform a merge
repo.merge({ base: 'master', head: 'dev' }).then(function() { ... });

// Delete the repository
repo.destroy()
```

#### Issues

```js
// List issues for a repository
repo.issues().then(function(page) { ... });

// Create an issue in a repository
repo.createIssue({
    title: "An awesome issue"
});

// Get a single issue in a repository
const issue = repo.issue(200);
issue.info().then(function(infos) { ... });

// Edit an issue
issue.edit({
    title: "New Title"
})
```

#### Organization

```js
// List organizations of an user
user.orgs().then(function(orgs) { ... });

// Check an user's membership to an organization
user.getOrgMembership('organization').then(function(membership) { ... });

// List an user's memberships to all of his organizations
user.getOrgsMemberships({ state: 'active' }).then(function(page) { ... });

// Get a single organization
const org = client.org('GitbookIO');
org.info().then(function(infos) { ... });

// Edit the organization
org.edit({
    name: "The new name"
})

// List members of the organization
org.members().then(function(page) { ... });

// Create a new repository
org.createRepo({ ... }).then(function() { });
```

#### Commits

```js
// List commits for a repository
repo.commits().then(function(commits) { ... });

// Get a single commit
const commit = repo.commit('6dcb09b5b57875f334f61aebed695e2e4193db5e');
commit.info().then(function(infos) { ... });
```

#### Statuses

```js
// Create a Status
repo.createStatus('sha', { ... }).then(function() { ... });

// List Statuses for a specific Ref
commit.statuses().then(function(statuses) { ... });
```

#### Branches

```js
// List branches for a repository
repo.branches().then(function(branches) { ... });

// Get a single branch
const branch = repo.branch('master');
branch.info().then(function(infos) { ... });
```

#### Tags

```js
// List tags for a repository
repo.tags().then(function(tags) { ... });
```

#### Webhooks

```js
// List hooks for a repository
repo.hooks().then(function(hooks) { ... });

// Get a single hook
const hook = repo.hook('1');
hook.info().then(function(infos) { ... });

// Edit a hook
hook.edit({
    name: "Test"
})

// Delete the hook
hook.destroy()
```

#### Releases

```js
// List releases of a repository
repo.releases().then(function(assets) { ... });

// Get details about the release
const release = repo.release('1');
release.info().then(function(infos) { ... });

// Edit a release
release.edit({
    name: "Test"
})

// Delete the release
release.destroy()
```

#### Uploading assets

```js
// Upload a new asset as file/stream
release.upload('./myfile.zip').then(function() { ... });
release.upload(stream, { name: "myfile.zip" }).then(function() { ... });
```

`release.upload` will also notify with progress:

```js
release.upload('./myfile.zip')
.progress((p) => {
    /*
    { percentage: 96.61881065572815,
      transferred: 45088768,
      length: 46666656,
      remaining: 1577888,
      eta: 0,
      runtime: 11,
      delta: 196608,
      speed: 3920762.434782609 }
    */
})
.then(() => {

});

```

#### Releases Assets

```js
// List assets of a release
release.assets().then(function(assets) { ... });

// Get details about the release
const asset = release.asset('1');
asset.info().then(function(infos) { ... });

// Download the asset to a file
asset.download('./myfile.zip').then(function() { ... });

// Download the asset to a stream
asset.download(stream).then(function() { ... });

// Delete the asset
asset.destroy()
```

#### Emails

```js
// List email addresses
client.userEmails().then(function(emails) { ... });

// Add email address(es)
client.addUserEmails([ 'octocat@github.com' ]).then(function() { ... });

// Delete email address(es)
client.deleteUserEmails([ 'octocat@github.com' ]).then(function() { ... });
```

#### Authorization for a specific app

```js
const app = client.application('clientId');
const token = app.token('access_token');

// Check an authorization
token.info().then(function(infos) { ... });

// Reset an authorization
token.reset().then(function() { ... });

// Delete an authorization
token.destroy().then(function() { ... });
```

#### Git Data

###### Reference

```js
const ref = repo.gitRef('heads/master');

// Get a reference
ref.info().then(function(infos) { ... });

// Edit / Delete
ref.edit({ ... }).then(function() { ... });
ref.destroy().then(function() { ... });
```

###### Commit

```js
const commit = repo.gitCommit('<sha>');

// Get a commit
commit.info().then(function(infos) { ... });
```

#### Rate Limiting

You can also check your rate limit status by calling the following.

```js
client.limit().then(function(rate) { ... })
```
