var express = require('express');
var router = express.Router();
var db = require('../utils/db')
var Response = require('../utils/response');
var RESP = require('../utils/response_values');
var response = new Response();
var wiDataset = require('../lib/dataset');
var AwPubSub = require('whatsit-pubsub')
var AwResponse = require('../utils/AwResponse')

router.get('/', function(req, res) {

  if (Object.keys(req.query).length === 0) {

    var awResponse = new AwResponse();
    awResponse.code = 400;
    awResponse.message = "checked request query";
    res.json(awResponse.create())

  } else {

    var projectId = req.query.projectId;
    console.log('projectId =>' + projectId);

    if (projectId == null ||
      projectId == undefined) {

      var awResponse = new AwResponse();
      awResponse.code = 400;
      awResponse.message = "projectId is invalid";
      res.json(awResponse.create())

    } else {
      db.connectDB()
        .then( () => wiDataset.getDatasetsByProjectId(projectId))
        .then( (datasets) => {
          var awResponse = new AwResponse();
          awResponse.code = 200;
          awResponse.data = {Datasets: datasets};
          res.json(awResponse.create())
        }).catch( function (error) {
        console.error(error)
        var awResponse = new AwResponse();
        awResponse.code = 500;
        awResponse.message = error;
        res.json(awResponse.create())
      })
    }

  }

});

router.get('/:datasetId', function(req, res) {
  var datasetId = req.params.datasetId;
  console.log('datasetId =>' + datasetId);

  if (datasetId == null ||
    datasetId == undefined) {

    var awResponse = new AwResponse();
    awResponse.code = 400;
    awResponse.message = "datasetId is invalid";
    res.json(awResponse.create())
  } else {
    db.connectDB()
      .then( () => wiDataset.getDatasetByDatasetId(datasetId))
      .then( (dataset) => {

        var awResponse = new AwResponse();
        awResponse.code = 200;
        awResponse.data = dataset;
        res.json(awResponse.create())

      }).catch( function (error) {
      console.error(error)
      var awResponse = new AwResponse();
      awResponse.code = 500;
      awResponse.message = error;
      res.json(awResponse.create())
    })
  }
});

router.post('/', function (req, res) {
  db.connectDB()
    .then( () => wiDataset.addDataset(req.body))
    .then( (result) => {
      console.log('publish :whatsit/index/' + req.body.type);
      let awPubSub = new AwPubSub()
      awPubSub.nrp.emit('whatsit/index/' + req.body.type, result.datasetId);

      var awResponse = new AwResponse();
      awResponse.code = 200;
      awResponse.data = result;
      res.json(awResponse.create())
    }).catch( function (error) {
    console.error(error)
    var awResponse = new AwResponse();
    awResponse.code = 500;
    awResponse.message = error;
    res.json(awResponse.create())
  })
})

router.put('/:datasetId', function (req, res) {
  var datasetId = req.params.datasetId;

  if (datasetId == null ||
    datasetId == undefined) {

    var awResponse = new AwResponse();
    awResponse.code = 400;
    awResponse.message = "datasetId is invalid";
    res.json(awResponse.create())
  }

  db.connectDB()
    .then( () => wiDataset.updateDatasetByDatasetId(datasetId, req.body))
    .then( (result) => {
      var awResponse = new AwResponse();
      awResponse.code = 200;
      awResponse.data = result;
      res.json(awResponse.create())
    }).catch( function (error) {
    console.error(error)
    var awResponse = new AwResponse();
    awResponse.code = 500;
    awResponse.message = error;
    res.json(awResponse.create())
  })
})

router.put('/:datasetId/contents', function (req, res) {
  var datasetId = req.params.datasetId;

  if (datasetId == null ||
    datasetId == undefined) {

    var awResponse = new AwResponse();
    awResponse.code = 400;
    awResponse.message = "datasetId is invalid";
    res.json(awResponse.create())
  }

  if (req.body.data[0].images.length === 0) {

    var awResponse = new AwResponse();
    awResponse.code = 400;
    awResponse.message = "image length is zero";
    res.json(awResponse.create())
  }

  db.connectDB()
    .then( () => wiDataset.updateDatasetContents(req.body))
    .then( (result) => {
      var awResponse = new AwResponse();
      awResponse.code = 200;
      awResponse.data = result;
      res.json(awResponse.create())
    }).catch( function (error) {
    console.error(error)
    var awResponse = new AwResponse();
    awResponse.code = 500;
    awResponse.message = error;
    res.json(awResponse.create())
  })
})

router.get('/:datasetId/contents', function(req, res) {
  var datasetId = req.params.datasetId;
  var count = req.query.count;
  
  console.log('datasetId =>' + datasetId);
  console.log('count =>' + count);

  if (datasetId == null ||
    datasetId == undefined) {

    var awResponse = new AwResponse();
    awResponse.code = 400;
    awResponse.message = "datasetId is invalid";
    res.json(awResponse.create())
  } else {
    db.connectDB()
      .then( () => wiDataset.getDatasetContentsByDatasetId(datasetId, count))
      .then( (dataset) => {

        var awResponse = new AwResponse();
        awResponse.code = 200;
        awResponse.data = dataset;
        res.json(awResponse.create())

      }).catch( function (error) {
      console.error(error)
      var awResponse = new AwResponse();
      awResponse.code = 500;
      awResponse.message = error;
      res.json(awResponse.create())
    })
  }
});
module.exports = router;
