var fs = require('fs');
var casper = require('casper').create();


var input = fs.read('hosts.txt');
var hosts = input.split('\n');
var capture_folder = 'capture/';



casper.start();

check(hosts.pop(), r);

casper.run(function(){
	log('ready');		
	this.exit();
});


function r(result){	
	var host = hosts.pop();
	if(host){
		check(host, r);
	}
}


function check(host, callback){

	var curhost = host;

	var capture = {
		login: capture_folder + curhost + '_1_login.png',
		auth_success: capture_folder + curhost + '_2_auth.png',
		auth_failed: capture_folder + curhost + '_2_failed.png',
	}

	var log = function(message){
		casper.echo(curhost + ': ' + message);
	}

	var result = false;
	var url = 'http://' + curhost + '/';

	casper.open(url);
	
	casper.then(function() {
		var statusCode = this.status().currentHTTPStatus;
	    log('status code: ' + statusCode);
	    
	    if(statusCode == 200){
	    	log(casper.getTitle());
	    	log(casper.getCurrentUrl());
	    }
	});

	casper.then(function(){

		this.capture(capture.login);

		this.waitForSelector(
			'#name-pad',
			function(){
				log('open');				
				this.fill('form', {
					'P2': 'admin',
					});
				
				this.click('input[name=Login]');
			},
			function(){
				log('not open');
				this.bypass(1);
			},
			3000
		);
	});

	casper.then(function(){
		this.waitForSelector(
			'#logo-pad',
			function (){
				result = true;
				this.capture(capture.auth_success);
			},
			function (){
				result = false;
				this.capture(capture.auth_failed);
			},
			3000
		);
	});

	casper.then(function(){
		log(result);
		callback(result);
	});
}