var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var schema = require('../schemas/label_map');

module.exports = mongoose.model('LabelMap', schema);