var _ = require('lodash');
var Q = require('q');
var request = require('request');

var GitHub = function(opts) {
    this.opts = _.defaults(opts || {}, {


    });
};

module.exports = GitHub;
