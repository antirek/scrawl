var spookyRunner = require('./SpookyRunner');

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
		if(!runner.isRunning()){
			var url = queue.shift();
			if(url){
				runner.run(url);
			}
		}
	}

	var isRunning = function(){
		return runner.isRunning();
	}

	var queueLength = function(){
		return queue.length;
	}

	runner.on('end', function(data){		
		if(DB.urls) DB.urls.save(data.result);
		tryStart();		
	});

	return {
		addURL: addURL,
		isRunning: isRunning,
		queueLength: queueLength,
		setDB: setDB,
	}
}

module.exports = SpookyManager;