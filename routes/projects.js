var express = require('express')
var router = express.Router();
var bunyan = require('bunyan')
var db = require('../utils/db')
var Response = require('../utils/response');
var RESP = require('../utils/response_values');
var response = new Response();
var config = require('../config.json')
var Project = require('../models/project');
var Instance = require('../models/instance');
var schedule = require('../lib/schedule')
var wiProject = require('../lib/project')
var wiUser = require('../lib/user')

router.post('/', function(req, res){
    db.connectDB()
    .then( () => wiUser.getUserById(req.body.owner))
    .then( user => wiProject.createProject(user, req.body))
    .then( (project) => {
      response.responseStatus = RESP.SUCCESS;
      response.responseMessage = RESP.SUCCESS
      response.data = project
      res.json(response)
    }).catch( function (error) {
      console.error(error)
      response.responseStatus = RESP.FAIL;
      response.responseMessage = error;
      res.json(response)
    })
});

router.post('/:projectId/subscribe/email', function(req, res){
  // console.log(req)
  db.connectDB()
    .then( data => awProject.addEmailSubcriber(req.params.projectId, req.body.email))
    .then( (project) => {
      response.responseStatus = RESP.SUCCESS
      response.responseMessage = "Successfully added"
      response.data = project
      log.info(response)
      res.json(response)
      // updateSchedule(project)
    }).catch( function (error) {
    console.error(error)
    response.responseStatus = RESP.FAIL;
    response.responseMessage = error;
    res.json(response)
  })
});

router.delete('/:projectId/subscribe/email', function(req, res){
  // console.log(req)
  connectDB()
    .then( data => awProject.deleteEmailSubcriber(req.params.projectId, req.query.email))
    .then( (data) => {
      response.responseStatus = data.status
      response.responseMessage = data.msg
      response.data = null
      log.info(response)
      res.json(response)
      // updateSchedule(project)
    }).catch( function (error) {
    console.error(error)
    response.responseStatus = RESP.FAIL;
    response.responseMessage = error;
    res.json(response)
  })
});


router.put('/:projectId', function(req, res){
  // console.log(req)
  connectDB()
    .then( data => awProject.updateProject(req.params.projectId, req.body))
    .then( (project) => {
      response.responseMessage = "Successfully updated"
      response.data = project
      log.info(response)
      res.json(response)
      // updateSchedule(project)
    }).catch( function (error) {
    console.error(error)
    response.responseStatus = RESP.FAIL;
    response.responseMessage = error;
    res.json(response)
  })
});

router.get('/:projectId', function(req, res){
  console.log(req.params.projectId)
  db.connectDB()
  .then( () => wiProject.getProjectByProjectId(req.params.projectId))
  .then( (project) => {
    response.responseMessage = RESP.SUCCESS
    response.data = project
    res.json(response)
  }).catch( function (error) {
    console.error(error)
    response.responseStatus = RESP.FAIL;
    response.responseMessage = error;
    res.json(response)
  })
});

router.delete('/:projectId', function(req, res){
  db.connectDB()
    .then( () => wiProject.deleteProjectByProjectId(req.params.projectId))
    .then( () => {
      response.responseStatus = RESP.SUCCESS
      response.responseMessage = `${req.params.projectId} is successfully deleted`
      res.json(response)
    }).catch( function (error) {
    console.error(error)
    response.responseStatus = RESP.FAIL;
    response.responseMessage = error;
    res.json(response)
  })
});

router.get('/users/:userId', function(req, res){
  console.log(req.params)
  connectDB()
    .then( data => getProjectsByUserId(req.params, data))
  .then( (projects) => {
    response.responseMessage = RESP.SUCCESS
    response.data = {
      projects: projects
    }
    res.json(response)
  }).catch( function (error) {
    console.error(error)
    response.responseStatus = RESP.FAIL;
    response.responseMessage = error;
    res.json(response)
  })
});

function deleteInstancesByProjectId (projectId) {
  return new Promise((resolve, reject) => {
    Instance.remove(
      {
        "project.projectId": projectId
      }, function (err, res) {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve()
    });
  })
}

function getProjectsByUserId (data) {
  return new Promise((resolve, reject) => {
    console.log('.....' + JSON.stringify(data))
      Project.find(
      {"owner": data.userId},
      function(err, projects) {
        if (err) {
          console.error(err)
          reject(err)
        }
        console.log(projects)
        resolve(projects)
      }
    )
  })
}



module.exports = router;
