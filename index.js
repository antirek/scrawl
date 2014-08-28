var fs = require('fs');
var casper = require('casper').create();


var input = fs.read('hosts.txt');
var hosts = input.split('\n');



check(hosts.pop(), r);


function r(result){
	casper.echo(result)
	var host = hosts.pop();
	if(host){
		check(host, r);
	}
}


function check(host, callback){

	var result = false;
	var start = 'http://' + host + '/';

	casper.start(start, function() {
	    this.echo(this.getTitle());
	    this.echo(this.getCurrentUrl());
	});

	casper.then(function(){
		this.capture(host + '_1_login.png');

		this.fill('form', {
			'P2': 'admin',
		});
		this.click('input[name=Login]');	
	});

	casper.then(function(){
		this.waitForSelector(
			'#logo-pad',
			function (){
				result = true;
				this.capture(host + '_2_auth.png');
			},
			function (){
				result = false;
				this.capture(host + '_2_notauth.png');
			},
			1000
		);
	});

	casper.then(function(){
		callback(result);
	})

	casper.run();

}