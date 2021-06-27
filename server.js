const { exec } = require('child_process');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');																// file system
var port = 3000;
server.listen(process.env.PORT || port);											// viskas čia yra burtažodžiai ir magija, kurios reikia :D

/// KAD VEIKTŲ: 'npm install'

console.log("Server is working!");

app.get('/index', function(req, res){												// sistemaAA.com/index žiūrės į /index.html failą
	res.sendFile(__dirname + '/index.html');
});


var connections = []; 																// visų dabar prisijungtų 'socketų' sąrašas


function launchCode(code){
	var codeName = 'failas.cpp';
	fs.writeFile(codeName, code, function (err) {									// sukuria šitą failą
  		if (err) throw err;
	});
	exec('g++ -o failas -std=c++17 failas.cpp && ./failas', (error, stdout, stderr) => {
	  if (error) {
	    console.error(`exec error: ${error}`);
	    return;
	  }
	  console.log(`stdout: ${stdout}`);
	  console.error(`stderr: ${stderr}`);
	});
}


io.sockets.on('connection', function(socket){										// kai tik kažkas pasijungs puslapį, šitas aktyvuosis

	connections.push(socket);

	console.log('Naujas prisijungimas. Viso šiuo metu prisijungusių: ' + connections.length);

	socket.on('disconnect', function(data){ 										// kai tik šitas prisijungimas atsijungs, bus vykdomas viskas, kas viduje
		connections.splice(connections.indexOf(socket), 1);							// išimamas šitas prisijungimas iš sąrašo
	});

	socket.on('buttonPressed', function(data){										// jei klientas atsiunčia 'buttonPressed' requestą, darysim tai, kas čia parašyta
		console.log('Mygtukas paspaustas, jo viduje yra: "' + data.code + '"');
		launchCode(data.code);														// iškviečia funkciją, kuri paleidžia kodą
	});

});
