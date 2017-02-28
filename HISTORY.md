# Release notes
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

### 1.1.0

- Add method `getOrgsMemberships` to `User` model

### 1.0.6

- Add back method `.members()` on organizations

### 1.0.5

- Fix options for request not being applied

### 1.0.4

- Fix methods `client.patch/post/del`

### 1.0.3

- Fix option `request` for `GitHub` to provide custom HTTP request options

### 1.0.2

- Fix require on linux

### 1.0.1

- **Important:** `1.0.0` was already published a while ago

### 1.0.0

- Switch to ES 6 and Babel
- Fix error message for `GitHubError`
- Deprecate method `client.createRepo`, `client.addUserEmails`, `client.deleteUserEmails`, use `client.me().createRepo(...)` instead
