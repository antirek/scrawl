var spookyRunner = require('./SpookyRunner');

var SpookyManager = function(){

	
	var queue = [];
	var runner = spookyRunner();


	var addURL = function(url){		
		queue.push(url);
		console.log(url);
		tryStart();
	}

	var tryStart = function(){
		if(!runner.isBusy()){

			var url = queue.shift();
			console.log(url);
			if(url){
				runner.run(url);
			}
		}
	}

	runner.on('end', function(){
		tryStart();
	});

	return {
		addURL: addURL,
	}
}

module.exports = SpookyManager;