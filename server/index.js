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
function findDifference(all, one1){
    one = one1.map((a) => a.taskname);
    var ret = [];
    for(var i = 0; i < all.length; i++){
        if(one.includes(all[i])) continue;
        ret.push(all[i]);
    }
    return ret;
}
async function changeToUserDataTasks (tasks, username){
    var ret = [];
    for(var i = 0; i < tasks.length; i++){
        await db.getTask(tasks[i].taskname).then((task) => {
            ret[i] = {name: task.name, id: tasks[i].taskname, score: -1};
        });
        await db.getScoreForTask(username, tasks[i].taskname).then((score) => {
            ret[i].score = score;
        });
    }
    return new Promise((resolve, reject) => {
        resolve(ret);
    });
}
function getTheSubmissionData(ID, result, compiled, taskName, username){                            // gets the submission data of `ID` submission
                                                                                                    // and writes it to the DB
    var pathToCpp = path.join(__dirname, 'database/codes/' + ID + '.cpp');
    const pth = path.join(__dirname, './tasks/' + taskName + '/info.json');                         // path to info.json
    const info = require(pth);
    const subtasks = info.subtasks;
    db.addSubmission(ID, compiled, result, pathToCpp, taskName, username, grader.evaluateSubtasks(compiled, result, taskName), grader.evaluateSubtasksFully(compiled, result, taskName));
    console.log('evaluated the submission ' + ID + ': ');
    console.log(result);
    console.log('stringified result:');
    console.log(JSON.stringify(result));
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
                db.addSubmission(curNum, false, [], '', taskName, username, -1, []);
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
                            var ret = {score: data.score, subtasks: data.subtasks, taskname: data.taskname, compiled: data.compiled, result: data.result, code: code};
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

app.post('/register', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    db.registerUser(username, password, firstName, lastName).then((good) => {
        res.send({mes: good});
    });
});

app.post('/createNewContest', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var contestName = req.body.contestName;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send({id: -1});
            return ;
        }
        db.checkIfUserIsAdmin(username).then((is) => {
            if(!is){
                res.send({id: -1});
                return ;
            }
            db.createContest(contestName).then((id) => {
                res.send({id: id});
            });
        });
    });
});
app.post('/getAllContests', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send([]);
            return ;
        }
        db.checkIfUserIsAdmin(username).then((is) => {
            if(!is){
                res.send([]);
                return ;
            }
            db.getAllContests().then((data) => {
                res.send(data);
            });
        });
    });
});
app.post('/getNeededTasksOfContest', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var contestID = req.body.contestID;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send({mine: [], missing: []});
            return ;
        }
        db.checkIfUserIsAdmin(username).then((is) => {
            if(!is){
                res.send({mine: [], missing: []});
                return ;
            }
            db.checkIfContestExists(contestID).then((exists) =>{
                if(!exists){
                    res.send({mine: [], missing: []});
                    return ;
                }
                db.getAllTasks().then((allTasks) => {
                    db.getAllTasksOfContest(contestID).then((contestTasks) => {
                        res.send({mine: contestTasks.map((task)=>task.taskname), missing: findDifference(allTasks, contestTasks)});
                    });
                });
            });

        });
    });
});
app.post('/addTaskToContest', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var contestID = req.body.contestID;
    var taskName = req.body.taskName;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send(false);
            return ;
        }
        db.checkIfUserIsAdmin(username).then((is) => {
            if(!is){
                res.send(false);
                return ;
            }
            db.checkIfContestExists(contestID).then((exists) =>{
                if(!exists){
                    res.send(false);
                    return ;
                }
                db.doesTaskExists(taskName).then((exists) => {
                    if(!exists){
                        res.send(false);
                        return ;
                    }
                    db.addTaskToContest(taskName, contestID).then((good) => {
                        res.send(good);
                    });
                });
            });

        });
    });
});

app.post('/removeTaskFromContest', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var contestID = req.body.contestID;
    var taskName = req.body.taskName;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send(false);
            return ;
        }
        db.checkIfUserIsAdmin(username).then((is) => {
            if(!is){
                res.send(false);
                return ;
            }
            db.checkIfContestExists(contestID).then((exists) =>{
                if(!exists){
                    res.send(false);
                    return ;
                }
                db.doesTaskExists(taskName).then((exists) => {
                    if(!exists){
                        res.send(false);
                        return ;
                    }
                    db.removeTaskFromContest(taskName, contestID).then((good) => {
                        res.send(good);
                    });
                });
            });

        });
    });
});

app.post('/getAllSubmissions', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send([]);
            return ;
        }
        db.checkIfUserIsAdmin(username).then((is) => {
            if(!is){
                res.send([]);
                return ;
            }
            db.getAllSubmissions().then((data) => {
                res.send(data);
            });

        });
    });
});
app.post('/changeScore', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var submission = req.body.submissionID;
    var newV = req.body.newScore;
    if(isNaN(newV)){
        res.send(false);
        return ;
    }
    var newScore = +newV;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send(false);
            return ;
        }
        db.checkIfUserIsAdmin(username).then((is) => {
            if(!is){
                res.send(false);
                return ;
            }
            db.findIfSubExists(submission).then((exists) => {
                if(!exists){
                    res.send(false);
                    return ;
                }
                db.changeScore(submission, newScore).then((good) =>{
                    res.send(good);
                })
            });

        });
    });
});


app.post('/checkIfAdmin', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send(false);
            return ;
        }
        db.checkIfUserIsAdmin(username).then((is) => {
            res.send(is);
        });
    });
});

app.post('/getAllContestsAsSolver', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send([]);
            return ;
        }
        db.getAllUnhiddenContests().then((data) => {
            res.send(data);
        });
    });
});
app.post('/changeHidingOfContest', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var contestID = req.body.contestID;
    var newVal = req.body.newVal;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send(false);
            return ;
        }
        db.checkIfUserIsAdmin(username).then((is) => {
            if(!is){
                res.send(false);
                return ;
            }
            db.checkIfContestExists(contestID).then((exists) =>{
                if(!exists){
                    res.send(false);
                    return ;
                }
                db.changeContestHiding(contestID, newVal);
            });

        });
    });
});
app.post('/getContestData', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var contestID = req.body.contestID;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send(false);
            return ;
        }
        db.checkIfUserIsAdmin(username).then((is) => {
            if(!is){
                res.send(false);
                return ;
            }
            db.checkIfContestExists(contestID).then((exists) =>{
                if(!exists){
                    res.send(false);
                    return ;
                }
                db.getContestData(contestID).then((data) => {
                    res.send(data);
                });
            });

        });
    });
});
//getNeededTasksOfContestUser
app.post('/getNeededTasksOfContestUser', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var contestID = req.body.contestID;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send([]);
            return ;
        }
        db.checkIfContestExists(contestID).then((exists) =>{
            if(!exists){
                res.send([]);
                return ;
            }
            db.getAllTasksOfContest(contestID).then((contestTasks) => {
                changeToUserDataTasks(contestTasks, username).then((ret) => {
                    res.send(ret);
                });

            });
        });
    });
});
app.post('/getLeaderboard', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var contest = req.body.contestID;
    db.findIfUserExists(username, password).then((exists) => {
        if(!exists){
            res.send([]);
            return ;
        }
        db.getLeaderboard(contest).then((data) => {
            res.send(data);
        });
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
