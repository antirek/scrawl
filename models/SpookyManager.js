var spookyRunner = require('./SpookyRunner');
var db = require('diskdb');


var SpookyManager = function(){

	var DB = null;
	var queue = [];
	var runner = spookyRunner();

	var addURL = function(url){		
		queue.push(url);
		tryStart();
	}

	var setDB = function(db){
		DB = db;
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

	runner.on('end', function(data){
		console.log('data');
		console.log(data.result);
		if(DB.urls) DB.urls.save(data.result);
		tryStart();		
	});

	return {
		addURL: addURL,
		isBusy: isBusy,
		queueLength: queueLength,
		setDB: setDB,
	}
}

module.exports = SpookyManager;