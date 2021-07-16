const fs = require('fs');
const path = require('path');

var submissions = [];                                                       // temporary. has:
var users =[{username: 'insertUsername', password: 'insertHashedPassword'}];// temporary. has: username(string), password(string)

function getLastSubmissionNumber(){                                         // return the number of the last submission
    return new Promise((resolve, reject) => {
        //////// to be replaced with db
        resolve(0);
        ////////
    });
}

function addSubmission(index, compiled, result, codePath, taskName){        // index - the number of the submission
                                                                            // compiled - true/false
                                                                            // result - error message if not compiled, array of test results else
                                                                            // codePath - path to the code
                                                                            // taskName - the shortname to the task
    //////// to be replaced db
    submissions[index] = {compiled: compiled, result: result, codePath: codePath, taskName: taskName};
    ////////

}
function findIfSubExists(index){                                            // finds whether submission `index` is in DB and returns true/false
    return new Promise((resolve, reject) => {
        //////// to be replaced with db
        if(submissions[index]) resolve(true);
        else resolve(false);
        ////////
    });
}
function getSubResult(index){                                               // returns the result of `index` submission
    return new Promise((resolve, reject) => {
        //////// to be replaced with db
        resolve(submissions[index]);
        ////////
    });
}
function findIfUserExists(username, password){
    return new Promise((resolve, reject) => {
        //////// to be replaced with db
        for(var i = 0; i < users.length; i++) if(users[i].username == username && users[i].password == password) resolve(true);
        resolve(false);
        ////////
    });
}

function getTask(taskName){                                                         // gets task info from files
    return new Promise((resolve, reject) => {
        var pathToInfo = path.join(__dirname, 'tasks/' + taskName + '/info.json');
        var pathToStatement = path.join(__dirname, 'tasks/' + taskName + '/statement.txt');
        var ret = {statement: '',  name: '', timeLimit: 0, memoryLimit: 0};
        if(fs.existsSync(pathToInfo)) {
            var info = require(pathToInfo);
            ret.name = info.name;
            ret.timeLimit = info.time_limit;
            ret.memoryLimit = info.memory_limit;
        }else{
            resolve({});
        }
        if(fs.existsSync(pathToStatement)) {
            try{
                const data = fs.readFileSync(pathToStatement, 'utf8')
                ret.statement = data;
            }catch (err){
                resolve({});
            }
        }else{
            resolve({});
        }
        resolve(ret);
    });
}
function doesUserHavePermissionToTask(taskName, username){                          // finds out wether a user can access a task
    return new Promise((resolve, reject) => {
        var pathToInfo = path.join(__dirname, 'tasks/' + taskName + '/info.json');
        if(fs.existsSync(pathToInfo)) {
            var info = require(pathToInfo);
            if(info.users.includes(username)) resolve(true);
            else resolve(false);
        }else{
            resolve(false);
        }
    });
}


module.exports = {
    getLastSubmissionNumber,
    addSubmission,
    findIfSubExists,
    getSubResult,
    findIfUserExists,
    getTask,
    doesUserHavePermissionToTask,

}
