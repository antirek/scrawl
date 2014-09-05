scrawl
======
web capture crawler

Requirements
------------

- Ubuntu or other Debian-like OS
- latest version node.js


Install PhantomJS & CasperJS & bower
------------------------------------

    npm install -g phantomjs
    npm install -g casperjs
    npm install -g bower


Install
-------

    git clone https://github.com/antirek/scrawl.git
    cd scrawl
    npm install
    bower install
    npm start

config/scrawl.json
------------------

`````
{
  "capture": {
       //image path
    "images": "capture/images/",  
       //json-db path
    "db": "capture/db/"            
  },
  "casper": {
       //user-agent of phantomjs browser
  	"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.94 Safari/537.36"                     
  },
    //viewport width & height of phantomjs browser
  "viewport": {
  	"width": 1200,                 
  	"height": 600
  },
    //capture page with viewport width & height or whole page
  "captureAsViewport": true        
}
`````

