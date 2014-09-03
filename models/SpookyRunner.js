var Spooky = require('spooky');
var EventEmitter = require('events').EventEmitter;

var SpookyRunner = function() {

    var emitter = new EventEmitter();
    var running = false;

    var isBusy = function(){
        return running;
    }
    
    var emit = function(event, data){
        emitter.emit(event, data);
    }

    var on = function(event, callback){
        emitter.on(event, callback);
    }

    var run = function(url){

        running = true;

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
                    this.emit('console', 'Current URL ' + this.getCurrentUrl());
                    this.emit('console', 'Current Title ' + this.getTitle());
                    this.capture('capture/' + Math.random() + '.png');
                });

                spooky.then(function(){
                    this.emit('end', 'ok');
                });

                spooky.run();
            });

        spooky.on('error', function (e, stack) {
            running = false;
            console.error(e);

            if (stack) {
                console.log(stack);
            }
        });

        spooky.on('console', function (line) {
            console.log(line);
        });

        spooky.on('end', function(data){
            running = false;
            emit('end', data)
        });        

        spooky.on('log', function (log) {
            if (log.space === 'remote') {
                console.log(log.message.replace(/ \- .*/, ''));
            }
        });
    }

    return {
        run: run,
        on: on,
        isBusy: isBusy,    
    }
}

module.exports = SpookyRunner;