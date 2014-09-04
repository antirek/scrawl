var Spooky = require('spooky');
var EventEmitter = require('events').EventEmitter;
var md5 = require('MD5');


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

        var result = {};
        result.url = url;

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
                //console.log(result);
                if (err) {
                    e = new Error('Failed to initialize SpookyJS');
                    e.details = err;
                    throw e;
                }
                
                spooky.start();

                spooky.open(url);

                var filename = md5(new Date()) + '.png';

                
                
                spooky.then([{
                        filename1 : filename
                    },function () {

                    var statusCode = this.status().currentHTTPStatus;
                    console.log('status code: ' + statusCode);
                    this.emit('data','statusCode:' + statusCode);                 

                    if(statusCode != null) {
                        this.emit('data', 'currentUrl:' + this.getCurrentUrl());
                        this.emit('data', 'title:' + this.getTitle());
                        this.viewport(800, 600);
                        
                        this.capture('capture/images/' + filename1);
                        this.emit('data', 'filename:' + filename1);                 
                    }

                }]);

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

        spooky.on('data', function(data){
            
            var q = data.split(':');
            var key = (q[0]) ? q.shift() : false;
            var value = (q[0]) ? q.join(':') : false;
            if(key && value){
                result[key] = value;
            }
            
            console.log(result);
        });

        spooky.on('end', function(status){
            running = false;
            var m = {};
            result.date = new Date();
            m.status = status;
            m.result = result;
            emit('end', m)
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