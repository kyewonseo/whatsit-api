var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviceAccountSchema = new Schema({
  type: String,
  project_id: String,
  private_key_id: String,
  private_key: String,
  client_email: String,
  client_id: String,
  auth_uri: String,
  token_uri: String,
  auth_provider_x509_cert_url: String,
  client_x509_cert_url: String
});

module.exports = serviceAccountSchema;
