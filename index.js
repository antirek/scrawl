var fs = require('fs');
var casper = require('casper').create();


var input = fs.read('hosts.txt');
var hosts = input.split('\n');
var capture_folder = 'capture/';
var output = capture_folder + 'output.html';


casper.start();

check(hosts.pop(), next);

casper.run(function(){
	casper.echo('ready');
	casper.exit();
});


function next(){	
	var host = hosts.pop();
	if(host){
		check(host, next);
	}
}


function check(host, callback){

	var currentHost = host;
	var waitTimeout = 3000;

	var capture = {
		start: capture_folder + currentHost + '_1_start.png',
	}

	var log = function(message){
		casper.echo(currentHost + ': ' + message);
	}

	var hlop = function(res){
		var str = res.statusCode;
		fs.write(output, str, "W");
	}

	var result = {};
	var url = 'http://' + currentHost + '/';

	casper.open(url);

	casper.then(function() {

		var statusCode = casper.status().currentHTTPStatus;
	    log('status code: ' + statusCode);
	    result.statusCode = statusCode;
	    
	    if(statusCode == 200){
	    	log(casper.getTitle());
	    	log(casper.getCurrentUrl());

	    	result.title = casper.getTitle();
	    	result.url = casper.getCurrentUrl();
	    }

	    if(statusCode != null){
	    	log('capture start')
	    	casper.capture(capture.start);
	    	result.capture_file = capture.start;
	    }

	});

	casper.then(function(){
		log('end');
		hlop(result);
		callback();
	});
}
