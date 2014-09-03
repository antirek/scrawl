var spookyRunner = require('./SpookyRunner');

var SpookyManager = function(){

	var runners = {};
	var max_runners_count = 10;
	var isRunning = false;

	var add = function(url){
		
		var runner = spookyRunner();
		var runner_id = runner.getId();
		runners[runner_id] = runner;
		
		runner.on('end', function(data){
			delete runners[runner_id];
		});
		
		runner.run(url);
		console.log('length: ' + Object.keys(runners).length);
		console.log(runners);
	}

	return {
		add: add,
	}
}

module.exports = SpookyManager;