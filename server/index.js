//import './grader.js'

const express = require("express");

const PORT = process.env.PORT || 3001;

const path = require('path');
const app = express();
const bodyParser = require('body-parser');                                                          // For POST requests
const grader = require('./grader.js');
const db = require('./dbAPI.js');
const fs = require('fs');

var submissions = [];                                                                               // just for now, since no DB is present
var currentSubmissionNumber; db.getLastSubmissionNumber().then(data => currentSubmissionNumber = data + 1);


app.use(bodyParser.json());


console.log('currentSubmissionNumber = ' + currentSubmissionNumber);
/*
// Have Node serve the files for our built React app. Uncomment this before deploying the WHOLE app.
app.use(express.static(path.resolve(__dirname, '../client/build')));
*/

function getTheSubmissionData(ID, result, compiled, taskName, username){                            // gets the submission data of `ID` submission
                                                                                                    // and writes it to the DB
    var pathToCpp = path.join(__dirname, 'database/codes/' + ID + '.cpp');
    db.addSubmission(ID, compiled, result, pathToCpp, taskName, username, grader.evaluateSubtasks(compiled, result, taskName));
    console.log('evaluated the submission ' + ID + ': ');
    console.log(result);
    console.log('-----');
}


app.post('/submit', function(req, res) {
    var thisCode = req.body.code;
    var username = req.body.username;
    var password = req.body.password;
    var taskName = req.body.taskName;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists) {
            res.send({});
            return ;
        }
        db.doesTaskExists(taskName).then((exists) => {
            if(!exists) {
                res.send({});
                return ;
            }
            db.doesUserHavePermissionToTask(taskName, username).then((has) => {
                if(!has){
                    res.send({});
                    return ;
                }
                var curNum = currentSubmissionNumber++;
                res.send({submissionNumer: curNum});
                db.addSubmission(curNum, false, [], '', taskName, username, -1);
                grader.createFile(path.join(__dirname, 'database/codes/' + curNum + '.cpp'), thisCode).then( () => {
                    grader.runCode(thisCode, taskName, curNum, username, getTheSubmissionData);
                });
            });
        });
    });
});

app.post('/getSubmissions', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var taskName = req.body.taskName;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists) {
            res.send([]);
            return ;
        }
        db.doesTaskExists(taskName).then((exists) => {
            if(!exists) {
                res.send([]);
                return ;
            }
            db.doesUserHavePermissionToTask(taskName, username).then((has) => {
                if(!has){
                    res.send([]);
                    return ;
                }
                db.findSubmissions(username, taskName).then((data) => {
                    res.send(data);
                });
            });
        });
    });
});


app.post('/getResult', function(req, res) {
    var number = req.body.submissionID;
    var username = req.body.username;
    var password = req.body.password;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send({});
            return ;
        }
        db.findIfSubExists(number).then((data) => {
            if(!data) {
                res.send({});
            }else{
                db.getSubResult(number).then((data) => {
                    if(data.codepath == '') {
                        res.send({});
                        return ;
                    }
                    fs.readFile(data.codepath, 'utf-8', (err, code) => {
                        if (err) {
                            res.send({});
                        }else{
                            var ret = {taskname: data.taskname, compiled: data.compiled, result: data.result, code: code};
                            // FOR SOME AWFUL REASON, THE FRONTEND RECEIVES THE SAME ARRAY EXCEPT THE FIRST TO ELEMENTS ARE MISSING
                            // SO I INSERT ONE MORE null ELEMENT IN FROM OF THE ARRAY. I DO NOT KNOW WHY THIS IS THE CASE AND HOW TO
                            // FIX IT IN A NORMAL WAY!
                            // TODO: fix this!!
                            if(Array.isArray(ret.result)) ret.result.splice(0, 0, null);
                            res.send(ret);
                        }
                    });
                });
            }
        });
    });
});
app.post('/getTaskData', function(req, res) {
    var taskName = req.body.taskName;
    var username = req.body.username;
    var password = req.body.password;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send({});
            return ;
        }
        db.doesUserHavePermissionToTask(taskName, username).then((has) => {
            if(!has){
                res.send({});
                return ;
            }
            db.getTask(taskName).then((data) => {
                res.send(data);
            });
        });
    });
});
app.post('/getUserTasks', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send([]);
            return ;
        }
        db.findAllTasksOfUser(username).then((tasks) => {
            res.send(tasks);
        });

    });
});
app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    db.findIfUserExists(username, password).then((exists) => {
        res.send(exists);
    });
});


/*
// All other GET requests not handled before will return our React app. Uncomment this before deploying the WHOLE app.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
*/

app.listen(PORT, () => {
  console.log('Server listening on ${PORT}');
});
