var Spooky = require('spooky');
var EventEmitter = require('events').EventEmitter;
var md5 = require('MD5');
var nconf = require('nconf');
nconf.file({file: 'config/scrawl.json'});


var captureImageFolder = nconf.get('capture:images');
var casperUserAgent = nconf.get('casper:userAgent');
var viewport = nconf.get('viewport');
var captureAsViewport = nconf.get('captureAsViewport');


var SpookyRunner = function() {

    var emitter = new EventEmitter();
    var running = false;

    var isRunning = function(){
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
                    verbose: true,
                    pageSettings: {                        
                        userAgent: casperUserAgent
                    }
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
                        filename: filename,
                        captureImageFolder: captureImageFolder,
                        viewport: viewport,
                        captureAsViewport: captureAsViewport
                    },function () {

                    var statusCode = this.status().currentHTTPStatus;                   
                    this.emit('data','statusCode:' + statusCode);                 

                    if(statusCode != null) {
                        this.emit('data', 'currentUrl:' + this.getCurrentUrl());
                        this.emit('data', 'title:' + this.getTitle());

                        this.viewport(viewport.width, viewport.height);
                        
                        if(captureAsViewport){
                            this.capture(captureImageFolder + filename,
                                {top:0, left:0, width: viewport.width, height: viewport.height});
                        }else{
                            this.capture(captureImageFolder + filename);
                        }

                        this.emit('data', 'filename:' + filename);
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
        isRunning: isRunning,    
    }
}

module.exports = SpookyRunner;