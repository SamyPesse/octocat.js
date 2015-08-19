# octocat.js

Javascript library to access the GitHub API.

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
