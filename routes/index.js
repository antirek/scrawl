var express = require('express');
var router = express.Router();
var spooky = require('../models/SpookyManager')

/* GET home page. */
router.get('/', function(req, res) {

  //var spooky = new spooky();
  var q = spooky();
  q.run('http://www.mail.ru/');
  res.render('index', { title: 'Express' });
});

module.exports = router;
