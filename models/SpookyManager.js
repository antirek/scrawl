var spookyRunner = require('./SpookyRunner');

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

	runner.on('end', function(){
		tryStart();
	});

	return {
		addURL: addURL,
		isBusy: isBusy,
		queueLength: queueLength
	}
}

module.exports = SpookyManager;