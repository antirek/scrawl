var express = require('express');
var router = express.Router();
var spookyManager = require('../models/SpookyManager')();
var db = require('diskdb');
db.connect('capture/db/', ['urls']);
var S = require('string');

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
	var urls = db.urls.find();
	urls.map(function(url){
		url.title = S(url.title).left(20);
		console.log(url);
	});
	res.render('history', {urls: urls.reverse()});
});


router.get('/images/:filename', function(req, res){
	var filename = req.params.filename;
	console.log(filename);
	res.sendfile('capture/images/' + filename);
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
