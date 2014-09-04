var spookyRunner = require('./SpookyRunner');
var db = require('diskdb');
db.connect('capture/db/', ['urls']);

var SpookyManager = function(){

	var queue = [];
	var runner = spookyRunner();

	var addURL = function(url){		
		queue.push(url);
		tryStart();
	}

	var tryStart = function(){
		if(!runner.isBusy()){
			var url = queue.shift();
			if(url){
				runner.run(url);
			}
		}
	}

	var isBusy = function(){
		return runner.isBusy();
	}

	var queueLength = function(){
		return queue.length;
	}

	var qr = function(d){
		var saved = db.urls.save(d);
		console.log(saved);
	}

	runner.on('end', function(data){
		console.log('data');
		console.log(data.result);
		var saved = db.urls.save(data.result);
		console.log(saved);
		tryStart();		
	});

	return {
		addURL: addURL,
		isBusy: isBusy,
		queueLength: queueLength
	}
}

module.exports = SpookyManager;