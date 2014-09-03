var express = require('express');
var router = express.Router();
var spookyManager = require('../models/SpookyManager')();

/* GET home page. */
router.get('/', function(req, res) {

  //var spooky = new spooky();
  spookyManager.add('http://www.mail.ru/');  
  res.render('index', { title: 'Express' });
});

module.exports = router;
