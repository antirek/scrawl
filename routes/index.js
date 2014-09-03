var express = require('express');
var router = express.Router();
var spookyManager = require('../models/SpookyManager')();

router.get('/', function(req, res) {
	res.render('status', {
		status: spookyManager.isBusy(),
		length: spookyManager.queueLength(),
	});
});

router.get('/add', function(req, res) {
	res.render('add', {});
});


router.post('/input', function(req, res){
	//spookyManager.addURL('http://www.mail.ru/');
	var urls = req.body.urls;
	console.log(urls);
	urls = urls.split('\r\n');
	urls = urls.map(function(url){
		return url.trim();
	});

	urls.forEach(function(url){
		spookyManager.addURL(url);
	})
	
	res.redirect('/')
});

module.exports = router;
