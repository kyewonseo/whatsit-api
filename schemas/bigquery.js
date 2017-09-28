var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var serviceAccountSchema = require('./service_account');

var bigquerySchema = new Schema({
  dataset_name: String,
  table_name: String,
  service_account: serviceAccountSchema
});

module.exports = bigquerySchema;
