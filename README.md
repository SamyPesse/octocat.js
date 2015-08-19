# octocat.js

Javascript library to access the GitHub API.

- :sparkles: Promise based
- :sparkles: Support GitHub Enterprise
- :sparkles: Easy handling of paginated results

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

#### Pagination

Some methods of Octonode return paginated results. Check on GitHub which API methods are paginated.

These methods return a `Page` object:

- `page.current` contains the list of results in the current page
- `page.next()` update with the results of the next page (Promised)
- `page.prev()` update with the results of the previous page (Promised)

#### Repositories

```js
var repo = client.repo('SamyPesse/octocat.js')

// Get details about the repository
repo.info().then(function(infos) { ... });

```

#### Releases

```js
// List releases of a repository
repo.releases().then(function(assets) { ... });

// Get details about the release
var release = repo.release('1');
release.info().then(function(infos) { ... });

// Upload a new asset as file/stream
release.upload('./myfile.zip').then(function() { ... });
release.upload(stream, { name: "myfile.zip" }).then(function() { ... });
```

#### Releases Assets

```js
// List assets of a release
release.assets().then(function(assets) { ... });

// Get details about the release
var asset = release.asset('1');
asset.info().then(function(infos) { ... });

// Download the asset to a file
asset.download('./myfile.zip').then(function() { ... });

// Download the asset to a stream
asset.download(stream).then(function() { ... });
```
