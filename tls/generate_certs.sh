echo "creating your own CA for your botnet"
openssl req -new -x509 -days 9999 -config ca.cnf -keyout ca-key.pem -out ca-cert.pem

echo "creating private key for client"
openssl genrsa -out client-key.pem 1024
openssl req -new -config client.cnf -key client-key.pem -out client-csr.pem

echo "creating private key for server"
openssl genrsa -out server-key.pem 1024
openssl req -new -config server.cnf -key server-key.pem -out server-csr.pem

echo "creating a cert for the client signed by the CA"
openssl x509 -req -days 9999 -in client-csr.pem -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out client-cert.pem

echo "creating a cert for the server signed by the CA"
openssl x509 -req -days 9999 -in server-csr.pem -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem

echo "verifying the client cert against the CA cert"
openssl verify -CAfile ca-cert.pem client-cert.pem

echo "verifying the server cert against the CA cert"
openssl verify -CAfile ca-cert.pem server-cert.pem
