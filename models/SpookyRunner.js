var Spooky = require('spooky');

var SpookyRunner = function() {

    var run = function(url){

        var spooky = new Spooky({
                child: {
                    transport: 'http'
                },
                casper: {
                    logLevel: 'debug',
                    verbose: true
                }
            }, function (err) {
                if (err) {
                    e = new Error('Failed to initialize SpookyJS');
                    e.details = err;
                    throw e;
                }
                
                spooky.start(url);

                spooky.then(function () {
                    
                    this.viewport(800, 600);
                    this.emit('hello', 'Current URL ' + this.getCurrentUrl());
                    this.emit('hello', 'Current Title ' + this.getTitle());
                    this.capture('capture/1.png');
                });

                spooky.run();
            
            });



        spooky.on('error', function (e, stack) {
            
            console.error(e);

            if (stack) {
                console.log(stack);
            }
        });

        
        // Uncomment this block to see all of the things Casper has to say.
        // There are a lot.
        // He has opinions.
        spooky.on('console', function (line) {
            console.log(line);
        });
        

        spooky.on('hello', function (greeting) {
            console.log(greeting);
        });

        spooky.on('log', function (log) {
            if (log.space === 'remote') {
                console.log(log.message.replace(/ \- .*/, ''));
            }
        });
    }

    return {
        run: run
    }
}

module.exports = SpookyRunner;