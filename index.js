var fs = require('fs');
var casper = require('casper').create();


var input = fs.read('hosts.txt');
var hosts = input.split('\n');
var capture_folder = 'capture/';



casper.start();

check(hosts.pop(), next);

casper.run(function(){
	casper.echo('ready');
	casper.exit();
});



function next(result){	
	var host = hosts.pop();
	if(host){
		check(host, next);
	}
}



function check(host, callback){

	var currentHost = host;
	var waitTimeout = 10000;

	var capture = {
		login: capture_folder + currentHost + '_1_login.png',
		auth_success: capture_folder + currentHost + '_2_auth.png',
		auth_failed: capture_folder + currentHost + '_2_failed.png',
	}

	var log = function(message){
		casper.echo(currentHost + ': ' + message);
	}

	var result = false;
	var url = 'http://' + currentHost + '/';

	casper.open(url);

	casper.then(function() {
		var statusCode = casper.status().currentHTTPStatus;
	    log('status code: ' + statusCode);
	    
	    if(statusCode == 200){
	    	log(casper.getTitle());
	    	log(casper.getCurrentUrl());
	    }
	});

	casper.then(function(){

		casper.capture(capture.login);

		casper.waitForSelector(
			'#name-pad',
			function(){
				log('open');				
				casper.fill('form', {
					'P2': 'admin',
					});
				
				casper.click('input[name=Login]');
			},
			function(){
				log('not open');
				casper.bypass(1);
			},
			waitTimeout
		);

	});

	casper.then(function(){

		casper.waitForSelector(
			'#logo-pad',
			function (){
				result = true;
				casper.capture(capture.auth_success);
			},
			function (){
				result = false;
				casper.capture(capture.auth_failed);
			},
			waitTimeout
		);

	});

	casper.then(function(){
		log(result);
		callback(result);
	});
}