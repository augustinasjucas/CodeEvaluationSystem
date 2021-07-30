const fs = require('fs');
const path = require('path');
const dbPool = require('./dbPool.js');

const MAX_USER_NUMBER = 50;                                                 // max 50 users in the system (to prevent attacks)

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
                console.log('result:');
                console.log(result);
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
   console.log('Adding submission to DB. score: ' + score);
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

// Gets an array of subissions of a user to a specific task
function findSubmissions(username, task){
    return new Promise((resolve, reject) => {
        var tableName = 'user_submissions_' + username;
        dbPool.query(
            'SELECT * FROM ' + tableName + ' WHERE task=($1)',
            [task],
            (err, result) => {
                if (err) {
                    console.log('DB error: ' + err);
                    resolve([]);
                    return ;
                }
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
        resolve(true);
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

// Finds how many users are in DB
function howManyUsers(){
    return new Promise((resolve, reject) => {
        dbPool.query('SELECT count(*) AS count FROM users' + ';', (err, rs) => {
            if(err){
                console.log('error in DB: ');
                console.log(err);
            }
            resolve(parseInt(rs.rows[0].count))
        });
    });
}

// Checks if such username already exists
function doesUsernameExist(username){
    return new Promise((resolve, reject) => {
        dbPool.query('SELECT * FROM users WHERE username=($1)', [username], (err, rs) => {
            if(err){
                console.log('error in DB: ');
                console.log(err);
                resolve(true);
            }
            resolve(rs.rows.length > 0);
        });
    });
}

// Adds the username, password, firstName, lastName to the users  table
// and creates the submission table for this user.
function registerUser(username, password, firstName, lastName){
    return new Promise((resolve, reject) => {
        doesUsernameExist(username).then((exists) =>{
            if(exists){
                resolve('Username in use!');
                return ;
            }
            howManyUsers().then((res) => {
                if(res >= MAX_USER_NUMBER) {
                    resolve('Too many users in the system!');
                    return ;
                }
                dbPool.query(
                     `INSERT INTO users (username, password, firstName, lastName, isAdmin)
                      VALUES ($1, $2, $3, $4, $5)`,
                     [username, password, firstName, lastName, 'false'],
                     (err, result) => {
                         if (err) {
                             console.log("DB error occured here: ");
                             console.log(err);
                             resolve('DB error');
                             return ;
                         }
                         dbPool.query("CREATE TABLE user_submissions_" + username + "(index INT NOT NULL, task VARCHAR(100) NOT NULL, time timestamp default current_timestamp, name VARCHAR(100) NOT NULL, score real)", (err, res) => {
                            if(err){
                                console.log("DB error occured: ");
                                console.log(err);
                                resolve('DB error');
                                return ;
                            }
                            resolve('Success!');
                        });
                     }
                 );
            });
        });
    });
}
function checkIfUserIsAdmin(username){
    return new Promise((resolve, reject) => {
        dbPool.query(
            'SELECT * FROM users WHERE username=($1) AND isAdmin=($2)',
            [username, 'true'],
            (err, result) => {
                if (err) {
                    console.log('DB error: ' + err);
                    resolve(false);
                    return ;
                }
                const rows = result.rows;
                if(rows.length == 0) resolve(false);
                resolve(true);
            }
        );
    });
}

// Adds a row into the contests table with the name of the contest
// Then creates tables contest_users_id and contest_tasks_id for storing
// the tasks and the users of the contest.
function createContest(contestName){
    return new Promise((resolve, reject) => {
        dbPool.query(   //INSERT INTO persons (lastname,firstname) VALUES ('Smith', 'John') RETURNING id;
            'INSERT INTO contests (name, hidden) VALUES ($1, $2) RETURNING id',
            [contestName, true],
            (err, result) => {
                if (err) {
                    console.log('DB error: ' + err);
                    resolve(false);
                    return ;
                }
                const id = result.rows[0].id;
                dbPool.query("CREATE TABLE contest_tasks_" + id + " (taskname VARCHAR(100) NOT NULL)", (err, res) => {
                   if(err){
                       console.log("DB error occured: ");
                       console.log(err);
                       resolve(-1);
                       return ;
                   }
                   dbPool.query("CREATE TABLE contest_users_" + id + " (username VARCHAR(100) NOT NULL)", (err, res) => {
                      if(err){
                          console.log("DB error occured: ");
                          console.log(err);
                          resolve(-1);
                          return ;
                      }
                      resolve(id);
                  });
               });
            }
        );
    });
}

function getAllContests(){
    return new Promise((resolve, reject) => {
        dbPool.query('SELECT * FROM contests', (err, res) => {
            if(err){
                console.log('DB error ' + err);
                resolve([]);
                return ;
            }
            resolve(res.rows);
        });
    });
}
function getAllUnhiddenContests(){
    return new Promise((resolve, reject) => {
        dbPool.query('SELECT * FROM contests WHERE hidden=($1)', [false], (err, res) => {
            if(err){
                console.log('DB error ' + err);
                resolve([]);
                return ;
            }
            resolve(res.rows);
        });
    });
}
function checkIfContestExists(contestID){
    return new Promise((resolve, reject) => {
        dbPool.query('SELECT * FROM contests WHERE id=($1)', [contestID], (err, res) => {
            if(err) {
                console.log('DB error: ' + err);
                resolve(false);
                return ;
            }
            resolve(res.rows.length >= 1);
        });
    });
}
function changeContestHiding(contestID, val){
    return new Promise((resolve, reject) => {
        dbPool.query('UPDATE contests SET hidden=($1) WHERE id=($2)', [val, contestID], (err, result) => {
            if (err){
                console.log('DB error: ' + err);
                resolve(false);
                return ;
            }
            resolve(true);
        });
    });
}
function addTaskToContest(taskName, contestID){
    return new Promise((resolve, reject) => {
        dbPool.query('SELECT * FROM contest_tasks_' + contestID + ' WHERE taskname=($1)', [taskName], (err, res) => {
            if(res.rows.length){
                resolve(false);
                return ;
            }
            var qu = 'INSERT INTO contest_tasks_' + contestID + ' (taskname) VALUES ($1)';
            dbPool.query(qu, [taskName], (err, res) => {
                if(err) {
                    console.log('DB error: ' + err);
                    console.log(err);
                    resolve(false);
                    return ;
                }
                resolve(true);
            });
        });

    });
}

function removeTaskFromContest(taskName, contestID){
    return new Promise((resolve, reject) => {
        var qu = 'DELETE FROM contest_tasks_' + contestID + ' WHERE taskname=($1)';
        dbPool.query(qu, [taskName], (err, res) => {
            if(err) {
                console.log('DB error: ' + err);
                console.log(err);
                resolve(false);
                return ;
            }
            resolve(true);
        });
    });


}
function getAllTasksOfContest(contestID){
    return new Promise((resolve, reject) => {
        dbPool.query('SELECT * FROM contest_tasks_' + contestID, [], (err, res) => {
            if(err) {
                console.log('DB error:' + err);
                return ;
            }
            resolve(res.rows);
        });
    });
}
function getAllTasks(){
    return new Promise((resolve, reject) => {
        fs.readdir(path.join(__dirname, './tasks'), (err, files) => {
            if(err){
                console.log('FS error: ' + err);
                resolve([]);
                return ;
            }
            resolve(files);
        });
    });
}
function getAllSubmissions(index){                                               // returns the result of `index` submission
    return new Promise((resolve, reject) => {
        dbPool.query(
            'SELECT * FROM submissions',
            (err, result) => {
                if (err){
                    console.log('DB error: ' + err);
                    resolve([]);
                    return ;
                }
                resolve(result.rows);
            }
        );
    });
}
function changeScore(index, score){                                               // returns the result of `index` submission
    return new Promise((resolve, reject) => {
        dbPool.query(
            'UPDATE submissions SET score=($1) WHERE index=($2) RETURNING username', [score, index],
            (err, result) => {
                if (err){
                    console.log('DB error: ' + err);
                    resolve(false);
                    return ;
                }
                var usr = result.rows[0].username;

                dbPool.query('UPDATE user_submissions_' + usr + ' SET score=($1) WHERE index=($2)', [score, index], (err, result) => {
                    if (err){
                        console.log('DB error: ' + err);
                        resolve(false);
                        return ;
                    }
                    resolve(true);
                });


            }
        );
    });
}
function getContestData(contestID){
    return new Promise((resolve, reject) => {
        dbPool.query('SELECT * FROM contests WHERE id=($1)' , [contestID], (err, res) => {
            if(err ) {
                console.log('DB error:' + err);
                return ;
            }
            if(res.rows.length == 0){
                resolve({});
                return ;
            }
            resolve(res.rows[0]);
        });
    });
}
function getScoreForTask(username, task){
    return new Promise((resolve, reject) => {
        dbPool.query('SELECT MAX(score) AS score FROM user_submissions_' + username + ' WHERE task=($1)' , [task], (err, res) => {
            if(err ) {
                console.log('DB error:' + err);
                return ;
            }
            if(!res.rows[0].score){
                resolve(0);
                return ;
            }
            resolve(res.rows[0].score);
        });
    });
}
function getAllUsers(){
    return new Promise((resolve, reject) => {
        dbPool.query('SELECT * FROM users' , [], (err, res) => {
            if(err ) {
                console.log('DB error:' + err);
                return ;
            }
            resolve(res.rows);
        });
    });
}
function getScoreForTaskHere(user, task, i, j){
    return new Promise((resolve, reject) => {
        getScoreForTask(user, task).then((score) => {
            resolve({score: score, i: i, j: j});
        });
    });
}
async function getLead(users, tasks){
    var ret = [];
    console.log('get lead: ');
    console.log(tasks);
    console.log(users);
    for(var i = 0; i < users.length; i++){
        var ths = [];
        for(var j = 0; j < tasks.length; j++){
            await getScoreForTaskHere(users[i], tasks[j], i, j).then((res) => {
                ths[res.j] = res.score;
            });
        }
        ret[i] = ths;
    }
    return new Promise((resolve, reject) => {
        resolve(ret);
    });
}
function getLeaderboard(contest){
    return new Promise((resolve, reject) => {
        getAllTasksOfContest(contest).then((data) => {
            var tasks = data.map((task) => task.taskname);
            getAllUsers().then((users1) => {
                var users = users1.map((user) => user.username);
                getLead(users, tasks).then((ret) => {
                    resolve({leaderboard: ret, users: users, tasks: tasks});
                });
            });

        });
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
    findSubmissions,
    registerUser,
    createContest,
    checkIfUserIsAdmin,
    checkIfContestExists,
    addTaskToContest,
    getAllTasksOfContest,
    getAllTasks,
    removeTaskFromContest,
    getAllSubmissions,
    changeScore,
    getAllContests,
    changeContestHiding,
    getAllUnhiddenContests,
    getContestData,
    getScoreForTask,
    getLeaderboard
}
