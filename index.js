var fs = require('fs');
var casper = require('casper').create();


var input = fs.read('hosts.txt');
var hosts = input.split('\n');
var capture_folder = 'capture/';
var output = 'output.html';


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
		var date = new Date();
		var day = [date.getFullYear(), date.getMonth(), date.getDate()];
		var time = [date.getHours(), date.getMinutes(), date.getSeconds()];
		casper.echo(day.join('-') + ' ' + time.join(':') + ' ' + currentHost + ': ' + message);
	}

	var hlop = function(res){
		var head = '<a href="http://'+res.host+'/">'+res.host + '</a> ' + res.statusCode;

		var img = '<img src='+res.capture_file+' width=300 height=10>';

		var str = head + img +'<br/>';
		fs.write(output, str, "W+");
	}

	var result = {};
	var url = 'http://' + currentHost + '/';

	casper.open(url);

	casper.then(function() {

		var statusCode = casper.status().currentHTTPStatus;
	    log('status code: ' + statusCode);

	    result.host = currentHost;
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
