var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var datasetSchema = new Schema({
  name: String,
  desc: String,
  thumbnail: String, //Thumbnail image url
  status: String, //Preparing, Live, Stop
  type: String, //g-spreadsheet, video, bigquery
  // member: [ObjectId], //[User]
  data: [ObjectId] //ObjectID of g-spreadsheet, video, bigquery
});

module.exports = datasetSchema;
