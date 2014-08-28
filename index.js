var casper = require('casper').create();
var lineReader = require('line-reader');

var host = '192.168.241.63';


check(host);

function check(host){

	var result = false;
	var start = 'http://'+host+'/';

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

	casper.run();

	return result;
}