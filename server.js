var tls = require('tls');
var fs = require('fs');
var msgpack = require('msgpack2');

var EventEmitter2 = require('eventemitter2').EventEmitter2;


//events come off msgpack and get dispatched
var emitter = new EventEmitter2( {
	wildcard: true, // should the event emitter use wildcards.
	delimiter: '::', // the delimiter used to segment namespaces, defaults to 
	maxListeners: 20, // the max number of listeners that can be assigned to an event, defaults to 10.
    } );


//add some logging
var onAny = function( params ) {

    console.log( "Received '" + this.event + "' with params '" + params + "'" );

}
emitter.onAny( onAny );

var options = {
    key: fs.readFileSync('tls/server-key.pem'),
    cert: fs.readFileSync('tls/server-cert.pem'),

    // This is necessary only if using the client certificate authentication.
    requestCert: true,

    //reject certs not signed by our ca
    rejectUnauthorized : true,

    // This is necessary only if the client uses the self-signed certificate.
    ca: [ fs.readFileSync('tls/ca-cert.pem') ]
};

var server = tls.createServer(options, function(cleartextStream) {

	console.log('server connected',
		    cleartextStream.authorized ? 'authorized' : 'unauthorized');
	var msgPackStream = new msgpack.Stream( cleartextStream );


	var onMsg = function( msg ) {

	    emitter.emit( msg.event, msg.params );
	};
	msgPackStream.addListener( 'msg', onMsg );
    });

server.listen(8000, function() {
	console.log('server bound');
    });

