//import './grader.js'

const express = require("express");

const PORT = process.env.PORT || 3001;

const path = require('path');
const app = express();
const bodyParser = require('body-parser');                                                          // For POST requests
const grader = require('./grader.js');
const db = require('./dbAPI.js');

var submissions = [];                                                                               // just for now, since no DB is present
var currentSubmissionNumber; db.getLastSubmissionNumber().then(data => currentSubmissionNumber = data + 1);


app.use(bodyParser.json());


console.log('currentSubmissionNumber = ' + currentSubmissionNumber);
/*
// Have Node serve the files for our built React app. Uncomment this before deploying the WHOLE app.
app.use(express.static(path.resolve(__dirname, '../client/build')));
*/

function getTheSubmissionData(ID, result, compiled, taskName){                                      // gets the submission data of `ID` submission
                                                                                                    // and writes it to the DB
    var pathToCpp = path.join(__dirname, 'database/codes/' + ID + '.cpp');
    db.addSubmission(ID, compiled, result, pathToCpp, taskName);
    console.log('evaluated the submission ' + ID + ': ');
    console.log(result);
    console.log('-----');
}


app.post('/submit', function(req, res) {
    var thisCode = req.body.code;
    var curNum = currentSubmissionNumber++;
    res.send({submissionNumer: curNum});
    grader.createFile(path.join(__dirname, 'database/codes/' + curNum + '.cpp'), thisCode).then( () => {
        grader.runCode(thisCode, 'task-001', curNum, getTheSubmissionData);
    });
});

app.post('/getResult', function(req, res) {
    var number = req.body.submissionID;
    db.findIfSubExists(number).then((data) => {
        if(!data) {                                                                                 // if such submission is not in the db
            res.send({});
        }else{
            db.getSubResult(number).then((data) => {                                                // if submission is in the db, send it
                res.send(data);
            });
        }
    });
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
