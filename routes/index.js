var express = require('express');
var router = express.Router();
var spookyManager = require('../models/SpookyManager')();
var db = require('diskdb');
db.connect('capture/db/', ['urls']);

router.get('/', function(req, res) {
	res.render('status', {
		status: spookyManager.isBusy(),
		length: spookyManager.queueLength(),
	});
});

router.get('/add', function(req, res) {
	res.render('add', {});
});


router.get('/history', function(req, res) {
	
	db.urls.save({ 
		title: 'hello', 
		url: 'http://www.mail.ru/',
		date: new Date(),
		file: '1',
	});
	res.render('history', {});
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
	});
	
	res.redirect('/')
});

module.exports = router;
