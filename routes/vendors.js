/******************************************
 *  Author : Harsh Jagdishbhai Kevadia   
 *  Created On : Tue Aug 15 2017
 *  File : vendors.js
 *******************************************/
var express = require('express');
var router = express.Router();

/* GET vendors listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;