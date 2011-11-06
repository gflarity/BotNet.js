var tls = require('tls');
var fs = require('fs');
var msgpack = require('msgpack2');

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

