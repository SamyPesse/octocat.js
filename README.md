# octocat.js

Javascript library to access the GitHub API.

- :sparkles: Promise based
- :sparkles: Support GitHub Enterprise


### Installation

```
$ npm install octocat
```

### Usage

#### Create an API client

```js
var GitHub = require('octocat');

// Using an access token
var client = new GitHub({
    token: "my-access-token"
});

// Using an username/password
var client = new GitHub({
    username: "SamyPesse",
    password: "my-password"
});

// Connecting to an enterprise version
var client = new GitHub({
    endpoint: "https:///github.mycompany.com"
});
```

#### Direct API access

All of these methods return promises.

```js
client.request('GET', '/repos/SamyPesse/octocat.js', { /* query/body parameters */})

client.get('/repos/SamyPesse/octocat.js', { /* query parameters */})
client.post('/repos/SamyPesse/octocat.js', { /* body parameters */})
client.put('/repos/SamyPesse/octocat.js', { /* body parameters */})
client.del('/repos/SamyPesse/octocat.js', { /* body parameters */})
```

#### Repositories

```js
var repo = client.repo('SamyPesse/octocat.js')

// Get details about the repository
repo.info().then(function(infos) { ... });
```

#### Releases

```js
var release = repo.release('1');

// Get details about the release
release.info().then(function(infos) { ... });

// Upload a file/stream to the release
release.upload('./myfile.zip').then(function() { ... });
release.upload(stream, { name: "myfile.zip" }).then(function() { ... });
```

#### Releases Assets

```js
var asset = release.asset('1');

// Get details about the release
asset.info().then(function(infos) { ... });

// Download the asset to a file
asset.download('./myfile.zip').then(function() { ... });

// Download the asset to a stream
asset.download(stream).then(function() { ... });
```
