Breakout - API Transport Abstraction
------------------------------------

Breakout tives you one simple way to write an API across transports using NodeJS. For instance, you can write one route and one handler function and have it automatically exposed via a json http api and via the NowJS everyone pocket.

Out of the Box
--------------

Out of the box you get support for an http json api via Express and a NowJS api. In your configuration simply pass in your instances for each, e.g.

<code><pre>
var express = require('express')
  , routes = require('./routes')
var app = module.exports = express.createServer();

var now = require('now');
var everyone = now.initialize(app);

var breakout = require('breakout');
breakout.use('http', app).use('now', everyone);
</pre></code>

Defining You API
----------------

<code><pre>
breakout.map('Fruit.read', function( args, respond ){
  console.log( args );
  respond( { donkey: true } );
});

breakout.map('Fruit.save', function( args, respond ){
  console.log( args );
  respond( { donkey: false } );
});
</pre></code>


Server-side Handler Signature
-----------------------------

<pre><code>
	function( data, respond ){
		// manipulate data
		data  = 'wee';
		// call responder with response	
		respond( myResponse );
	}
</pre></code>

TODO
----
* be able to handle http route params