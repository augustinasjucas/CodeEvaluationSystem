const express = require("express");

const PORT = process.env.PORT || 3001;

const path = require('path');
const app = express();

const bodyParser = require('body-parser');                      // For POST requests
app.use(bodyParser.json());


function runCode(code){
    
}

/*
// Have Node serve the files for our built React app. Uncomment this before deploying the WHOLE app.
app.use(express.static(path.resolve(__dirname, '../client/build')));
*/

app.post('/code', function(req, res) {
    var thisCode = req.body;
    res.send({mes: "Code received"});
    runCode(thisCode);
});

/*
// All other GET requests not handled before will return our React app. Uncomment this before deploying the WHOLE app.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
*/

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
