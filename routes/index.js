var express = require('express');
var router = express.Router();
var spookyManager = require('../models/SpookyManager')();

/* GET home page. */
router.get('/', function(req, res) {

  //var spooky = new spooky();
  spookyManager.addURL('http://www.mail.ru/');
  spookyManager.addURL('http://www.yandex.ru/');
  spookyManager.addURL('http://www.google.com/');
  spookyManager.addURL('http://www.news2.ru/');
  
  res.render('index', { title: 'Express' });
});

module.exports = router;
