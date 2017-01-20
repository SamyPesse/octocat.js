var _ = require('lodash');
var util = require('util');

var model = require('./model');
var Authorization = require('./authorization');

var Application = model.create(function(clientId) {
    this.id = clientId;
});

// Relations
Application.prototype.token = model.getter(Authorization);

// Return an url for application url
Application.prototype.url = function() {
    return _.compact(
        ['/applications/'+this.id].concat(_.toArray(arguments))
    ).join('/');
};



module.exports = Application;
