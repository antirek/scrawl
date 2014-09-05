var express = require('express');
var router = express.Router();
var db = require('diskdb');
var S = require('string');
var fs = require('fs');

var nconf = require('nconf');
nconf.file({file: 'config/scrawl.json'});


var spookyManager = require('../models/SpookyManager')();
var captureDbFolder = nconf.get('capture:db')
var captureImagesFolder = nconf.get('capture:images');


var DB = db.connect(captureDbFolder, ['urls']);

spookyManager.setDB(DB);

router.get('/', function(req, res) {
	res.render('status', {
		status: spookyManager.isBusy(),
		length: spookyManager.queueLength(),
	});
});


router.get('/add', function(req, res) {
	res.render('add', {});
});


router.post('/add', function(req, res){
	var urls = req.body.urls;
	urls = urls.split('\r\n');
	urls = urls.map(function(url){
		return url.trim();
	});

	urls.forEach(function(url){
		spookyManager.addURL(url);
	});

	res.redirect('/')
});


router.get('/history', function(req, res) {
	if(DB.urls){
		var urls = DB.urls.find();
		urls.map(function(url){
			if(url.title){
				url.short_title = S(url.title).left(20);
			}
		});
		urls = urls.reverse();
	}

	res.render('history', {urls: urls});
});


router.get('/history/clear', function(req, res) {
	if(DB.urls){
		DB.urls.remove();
		DB = db.connect(captureDbFolder, ['urls']);
		spookyManager.setDB(DB);
	}

	fs.readdir(captureImagesFolder, function(err, files){
		if(err){
			console.log(err)
		}else{
			for(var i = 0; i < files.length; i++){
				fs.unlink(captureImagesFolder + files[i], function(err){
					if(err) console.log(err)
				});
			}
		}
	});

	res.redirect('/history');
});


router.get('/images/:filename', function(req, res){
	var filename = req.params.filename;
	res.sendfile(captureImagesFolder + filename);
});


module.exports = router;