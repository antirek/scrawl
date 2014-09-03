var Spooky = require('spooky');
var EventEmitter = require('events').EventEmitter;

var SpookyRunner = function() {

    var emitter = new EventEmitter();
    var id = null;

    var get_new_id = function (){
        return Math.random();
    }

    id = get_new_id();

    var getId = function(){
        return id;
    }

    var emit = function(event, data){
        emitter.emit(event, data);
    }

    var on = function(event, callback){
        emitter.on(event, callback);
    }

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
                    this.emit('console', 'Current URL ' + this.getCurrentUrl());
                    this.emit('console', 'Current Title ' + this.getTitle());
                    this.capture('capture/'+Math.random()+'.png');
                });

                spooky.then(function(){
                    this.emit('end', 'ok');
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

        spooky.on('end', function(data){
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
        getId: getId,      
    }
}

module.exports = SpookyRunner;