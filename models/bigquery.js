var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var schema = require('../schemas/bigquery');

module.exports = mongoose.model('Bigquery', schema);
