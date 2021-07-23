const fs = require('fs');
const path = require('path');
const dbPool = require('./dbPool.js');

var submissions = [];                                                       // temporary. has:
//var users =[{username: 'insertUsername', password: 'insertHashedPassword'}];// temporary. has: username(string), password(string)

function getLastSubmissionNumber(){                                         // return the number of the last submission
    // TODO: optimize a bit (so that only one query is required)
    return new Promise((resolve, reject) => {
        // checking if there are any submissions
        dbPool.query(
            'SELECT * FROM submissions',
            [],
            (err, result) => {
                if (err) reject();
                const rows = result.rows;
                console.log(' submissions row length: ' + rows.length);
                if (rows.length == 0) resolve(0);
                else {
                    // if there are any submissions, getting the biggest index
                    dbPool.query(
                        'SELECT MAX(index) AS largestid FROM submissions',
                        [],
                        (err, result) => {
                            if (err) reject();
                            const rows = result.rows;
                            //console.log('finding last submisssion number: ');
                            //console.log(rows);
                            const num = rows[0]['largestid'];
                            //console.log(num);
                            resolve(num);
                        }
                    );
                }

            }
        );
    });
}

function addSubmission(index, compiled, result, codePath, taskName, username, score, subtasks){
                                                                            // index - the number of the submission
                                                                            // compiled - true/false
                                                                            // result - error message if not compiled, array of test results else
                                                                            // codePath - path to the code
                                                                            // taskName - the shortname to the task
                                                                            // username - person, who submitted
                                                                            // score - score for this subtask
                                                                            // subtasks - an array of subtasks during this submission
   // TODO: also add user id ; do not add index (make it auto increment)
   const pth = path.join(__dirname, './tasks/' + taskName + '/info.json');                         // path to info.json
   const info = require(pth);
   const nameOfTheTask = info.name;
   dbPool.query('DELETE FROM submissions WHERE index=' + index + ';', (err, rs) => {
       if(err){
           console.log('DB error occured: ');
           console.log(err);
       }
       dbPool.query(
            `INSERT INTO submissions (index, compiled, result, codepath, taskname, username, score, subtasks)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [index, compiled, JSON.stringify(result), codePath, taskName, username, score, JSON.stringify(subtasks)],
            (err, result) => {
                if (err) {
                    console.log("DB error occured here: ");
                    console.log(err);
                    console.log('subtasks is ');
                    console.log(subtasks);
                }
            }
        );
   });

    var tableName = 'user_submissions_' + username;
    dbPool.query('DELETE FROM ' + tableName + ' WHERE index=' + index + ';', (err, rs) => {
        dbPool.query(
            `INSERT INTO ` + tableName + ` (index, task, score, name)
             VALUES ($1, $2, $3, $4)`,
            [index, taskName, score, nameOfTheTask],
            (err, result) => {
                if (err) {
                    console.log("DB error occured: ");
                    console.log(err);
                }
            }
        );
    });

}
function findSubmissions(username, task){
    return new Promise((resolve, reject) => {
        var tableName = 'user_submissions_' + username;
        dbPool.query(
            'SELECT * FROM ' + tableName + ' WHERE task=($1)',
            [task],
            (err, result) => {
                if (err) reject();
                const rows = result.rows;
                resolve(rows);
            }
        );
    });
}
function findIfSubExists(index){                                            // finds whether submission `index` is in DB and returns true/false
    return new Promise((resolve, reject) => {

        dbPool.query(
            'SELECT * FROM submissions WHERE index=($1)',
            [index],
            (err, result) => {
                if (err) reject();
                const rows = result.rows;
                if (rows.length == 0) resolve(false);
                resolve(true);
            }
        );
    });
}
function getSubResult(index){                                               // returns the result of `index` submission
    return new Promise((resolve, reject) => {
        dbPool.query(
            'SELECT * FROM submissions WHERE index=($1)',
            [index],
            (err, result) => {
                if (err) reject();
                const rows = result.rows;
                if(rows.length == 0) resolve({});
                resolve(rows[0]);
            }
        );
    });
}

async function findIfUserExists(username, password){

    // console.log("Finding user, username: " + username + ' password: ' + password);
    return new Promise((resolve, reject) => {

        console.log('query from ' + username);
        dbPool.query(
            'SELECT * FROM users WHERE username=($1) AND password=($2)',
            [username, password],
            (err, result) => {
                if (err) reject();
                const rows = result.rows;
                if (rows.length == 0) resolve(false);
                resolve(true);
            }
        );
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
function doesTaskExists(taskName){
    return new Promise((resolve, reject) => {
        var pathToInfo = path.join(__dirname, 'tasks/' + taskName + '/info.json');
        if(fs.existsSync(pathToInfo)) {
            resolve(true);
        }else{
            resolve(false);
        }
    });
}

async function findAllTasksOfUser(username){
    const getDirectories = fs.readdirSync(path.join(__dirname, 'tasks'), { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
    var ret = [];
    for(var i = 0; i < getDirectories.length; i++){
        var has, task;
        await doesUserHavePermissionToTask(getDirectories[i], username).then((data) => {has = data; });
        await getTask(getDirectories[i]).then((data) => {task = data.name});
        if(has){
            ret.push({id: getDirectories[i], name: task});
        }

    }
    return new Promise((resolve, reject) => {
        resolve(ret);
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
    findAllTasksOfUser,
    doesTaskExists,
    findSubmissions
}
