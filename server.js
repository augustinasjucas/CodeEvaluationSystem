var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000;
server.listen(process.env.PORT || port);

/// KAD VEIKTŲ: 'npm install'

console.log("Server is working!");

app.get('/index', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
