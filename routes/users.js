/******************************************
 *  Author : Harsh Jagdishbhai Kevadia   
 *  Created On : Tue Aug 15 2017
 *  File : users.js
 *******************************************/
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;