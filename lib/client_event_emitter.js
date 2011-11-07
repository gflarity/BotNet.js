var tls = require('tls');
var fs = require('fs');
var msgpack = require('msgpack2');
var util = require('util');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

var ClientEventEmitter = function ClientEventEmitter( key, cert, ca ) {

    var that = this;

    this.tls_options = { 'key' : key, 'cert' : cert, 'ca' : ca };
    this.cleartextStreamsByName = {};

};
util.inherts( ClientEventEmitter, EventEmitter2 );
exports.ClientEventEmitter = ClientEventEmitter;

ClientEventEmitter.prototype.connect = function connect( name, host, port ) {

    var that = this;

    var on_connected = function() {

	//TODO make this logging a bit more configurable
	console.log('client connected',                                                            
		    cleartextStream.authorized ? 'authorized' : 'unauthorized');                     
        
	//make a msgPackStream and we receive objects over the socket, emit them
	var msgPackStream = new msgpack.Stream( cleartextStream );
	var onMsg = function( msg ) {

	    that.emit( msg.event, msg.params );
	};
	msgPackStream.addListener( 'msg', onMsg );
    
    };

    var cleartextStream = tls.connect(port, options, on_connected );    

    //TODO error checking     
    this.streamsByName[name] = { 'cleartextStream' : cleartextStream, 
				 'msgPackStream' : msgPackStream };

}; 


ClientEventEmitter.prototype.emit = function emit( event ) {

    var components = event.split('.');

    //we only emit local events, all events, or events with our explict name space
    if ( components.length === 1 || components[0] == this.name ) {

	EventEmitter2.prototype.emit.apply(this, Array.prototype.slice.call( arguments, 1 ) );
    }
    else {
	
	var name = components[0];
	var streams = this.streamsByName[components[0]]; 
	if ( streams ) {
	    var msg = { 'event' : event, 'params' : Array.prototype.slice.call( arguments, 1 )  }
	    streams.cleartextStream.write( msgpack.pack( msg );
	}
    }    
};

    /*
var options = {
    // These are necessary only if using the client certificate authentication
    key: fs.readFileSync('tls/client-key.pem'),
    cert: fs.readFileSync('tls/client-cert.pem'),

    // This is necessary only if the server uses the self-signed certificate
    ca: [ fs.readFileSync('tls/ca-cert.pem') ]
};

var cleartextStream = tls.connect(8000, options, function() {
	console.log('client connected',
		    cleartextStream.authorized ? 'authorized' : 'unauthorized');


	var msg = { event : 'all.test', params : [] };
	cleartextStream.write( msgpack.pack( msg ) ); 
	
    });

cleartextStream.on('data', function(data) {
	console.log(data);
    });
cleartextStream.on('end', function() {
	server.close();
    });

    */