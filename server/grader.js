const path = require('path');
const fs = require('fs');                                                                           // file system
const { exec } = require('child_process');                                                          // for executing the programs

var queue = [];
const AVAILABLE_MEMORY = 1000 * 1000 * 1500;                                                        // 1.5 GB
const AVAILABLE_THREADS = 4;                                                                        // How many procceses at a time?

var usedMemory = 0;
var currentProcesses = 0;

var submissions = [];
var currentSubmissionNumber = 0;

function evaluateSubtasks(compiled, result, taskName){
    if(!compiled) return 0.0;
    const pth = path.join(__dirname, './tasks/' + taskName + '/info.json');                         // path to info.json
    const info = require(pth);
    const subtasks = info.subtasks;
    var sum = 0;
    var total = 0;
    for(var i = 0; i < subtasks.length; i++){
        var th = subtasks[i].points;
        total += th;
        for(var j = 0; j < subtasks[i].tests.length; j++){
            if(result[subtasks[i].tests[j] + 1].points == 0) {
                th = 0;
                break;
            }
        }
        sum += th;
    }
    return sum / total * 100;
}
function evaluateSubtasksFully(compiled, result, taskName){
    if(!compiled) return 0.0;
    const pth = path.join(__dirname, './tasks/' + taskName + '/info.json');                         // path to info.json
    const info = require(pth);
    const subtasks = info.subtasks;
    var sum = 0;
    var total = 0;
    var ret = [];
    for(var i = 0; i < subtasks.length; i++){
        var th = subtasks[i].points;
        total += th;
        for(var j = 0; j < subtasks[i].tests.length; j++){
            if(result[subtasks[i].tests[j] + 1].points == 0) {
                th = 0;
                break;
            }
        }
        ret.push({...subtasks[i], received: th});
        sum += th;
    }
    return ret;
}

function createEmptySubmission(numOfTests, ID){                                                                   // creates empty submission (in database) and returns its ID
    submissions[ID] = {tests: [], compiled: true, testCount: numOfTests, compilationError: null};
}

function addOneTestToSubmission(ID, testIndex, val, codePath, execPath, taskName, returnVerdict, username){                             // adds the result of one test to the DB
    submissions[ID].tests[testIndex] = val;
    submissions[ID].testCount--;
    if(submissions[ID].testCount == 0) {
        removeFile(codePath).then(() => {removeFile(execPath).then(() => {                            // before returning, removes .cpp and executable files.
            returnVerdict(ID, submissions[ID].tests, true, taskName, username);
        })});

    }
}
function setSubmissionAsUncompiled(ID, error){
    submissions[ID].compiled = false;
    submissions[ID].compilationError = error;
}

var submissionID = 0;

async function fileExists (path) {                                                                  // checks whether the file
    try {                                                                                           // exists
        await fs.access(path);
        return true;
    }catch {
        return false;
    }
}
function executeCommand (command, timeLimit, memoryLimit) {                                         // executes a command asynchronously
                                                                                                    // used with await or .then
    return new Promise((resolve, reject) => {
        let mem = Math.max(Math.round((memoryLimit + 16)*1024), 100);                               // add 16MB to memory limit for libraries
        command = 'ulimit -s unlimited && ulimit -v ' + mem + ' && ' + command;
        exec(command, {timeout: timeLimit, maxBuffer: 1024*1024*40}, (error, stdout, stderr) => {   // allow 40MB to be cout'ed
            resolve({ error, stderr, stdout});
        });
    });
}
async function removeFile(path){                                                                    // removes a file in `path` directory
    return new Promise ((resolve, reject) => {
        fs.unlink(path, function (err) {
            if (err) {
                reject();
                return ;
            }
            resolve();
        });
    });

}
function createFile(path, value){                                                             // creates a file in `path` directory
    return new Promise((resolve, reject) => {
        fs.writeFile(path, value, function (err) {
            if (err) {
                reject();
                return ;
            }
            resolve();
        });
    });
}

function checkQueue(){
    if(queue.length == 0) return ;
    if(queue[0].memory * 1024 * 1024 + usedMemory > AVAILABLE_MEMORY) return ;
    if(currentProcesses+1 > AVAILABLE_THREADS) return ;                                                                    // ALLOWS JUST ONE TO BE PROCCESED AT A TIME
    currentProcesses++;
    usedMemory += queue[0].memory * 1024 * 1024;
    var ths = queue[0];
    queue.shift();                                                                                  // removes first element O(N)
    if(ths.type == 'compilation'){
        executeCommand(ths.command, ths.time, ths.memory).then((data) => {                          // compiles

            usedMemory -= ths.memory * 1024 * 1024;
            currentProcesses--;
            if(data.error){
                removeFile(ths.codePath).then(() => {                                               // before returning, removes .cpp file
                    setSubmissionAsUncompiled(ths.id, data.error);
                    ths.returnVerdict(ths.id, data.error, false, ths.taskName, ths.username);
                });
            }else{
                compiled(ths.taskInfo, ths.id, ths.execPath, ths.codePath, ths.taskName, ths.returnVerdict, ths.username);
            }
        });
    }else if(ths.type == 'test'){                                                                   // if its a test, runs it
        runTest(ths.inpPath, ths.execPath, ths.time, ths.memory).then((data) => {
            extractResult(data, ths.outPath).then((final) => {
                addOneTestToSubmission(ths.id, ths.testNum, final, ths.codePath, ths.execPath, ths.taskName, ths.returnVerdict, ths.username);
                usedMemory -= ths.memory * 1024 * 1024;
                currentProcesses--;
            });
        });
    }
}
setInterval(checkQueue, 40);                                                                        // checks the queue every 50ms
function compiled(info, ID, execPath, codePath, taskName, returnVerdict, username){

    for(var i = 1; i <= info.tests; i++){                                                           // loops through the tests
        const inpPath = path.join(__dirname, '/tasks/' + taskName + '/tests/input/' + i + '.in');
        const outPath = path.join(__dirname, '/tasks/' + taskName + '/tests/output/' + i + '.out');
        if(!fileExists(inpPath) || !fileExists(outPath)) return ["Wrong test data!"];               // this shouldn't ever happen!
        queue.push({outPath: outPath, inpPath: inpPath, execPath: execPath, codePath: codePath, time: info.time_limit, memory: info.memory_limit, id: ID, testNum: i, taskName: taskName, returnVerdict: returnVerdict, type: 'test', username: username});
    }
}

function runTest(inputPath, execPath, timeLimit, memoryLimit){                                // runs the test with given
                                                                                                    // test and returns
                                                                                                    // {error, stdout_file, stderr}

    var ret = {error: null, stdout: {}, stderr: {}};                                                // initializes the return value
    var curNum = currentSubmissionNumber++;
    var outputName = path.join(__dirname, '/submissionsFolder/outputOf' + curNum + '.out');
    return new Promise((resolve, reject) => {                                                       // to be async, we return a promise
        executeCommand('cat ' + inputPath + ' | time ' + execPath + ' > ' + outputName, timeLimit, memoryLimit).then((data) => {    // then excetute the code with this input
             // if(inputPath == '/home/augustinasjucas/Documents/SistemaAA/server/tasks/robotai/tests/input/1.in')
             //  fs.readFile(outputName, 'utf-8', (err, data) => {
             //      console.log('runs test ' + inputPath + ', result is ' + data);
             //   });
            ret.error = data.error;                                                                     // and set the return data to the executed data
            ret.stdout = outputName;
            ret.stderr = data.stderr;
            resolve(ret);
        });
    });



}
function findPattern(where, what){                                                                  // return true if 'what' is found within 'where'
    return where.includes(what);
}
function extractResult(test, correctOutput){                                                  // takes the output of command and gets result in normal form

    return new Promise ((resolve, reject) => {
        //console.log('test:');
        //console.log(test);
        if(test.error && test.error.killed){                                                        // should only kill when TLE is the result
            resolve({points: 0, message: 'TLE'});
        }
        if(findPattern(test.stderr, 'runtime error')){
            resolve({points: 0, message: 'RTE'});                                                   // Signed integer overflow is RTE! :(
        }
        if(findPattern(test.stderr, 'terminated abnormally')){
            resolve({points: 0, message: 'ABN'});
        }
        if(findPattern(test.stderr, 'segmentation fault')){
            resolve({points: 0, message: 'SEG'});
        }
        if(findPattern(test.stderr, 'signal 9')){
            resolve({points: 0, message: 'SIG9'});
        }
        if(findPattern(test.stderr, 'signal 11')){
            resolve({points: 0, message: 'SIG11'});
        }
        if(findPattern(test.stderr, 'terminated')){
            resolve({points: 0, message: 'ABN'});
        }
        if(findPattern(test.stderr, 'error')){
            resolve({points: 0, message: 'ABN'});
        }
        let command = 'echo "' + correctOutput + ' ' + test.stdout + '" | ' + path.join(__dirname, '/additionalPrograms/comparison');
        executeCommand(command, 10000, 10)
            .then((data) => {

                // if(test.stdout == '/home/augustinasjucas/Documents/SistemaAA/server/submissionsFolder/outputOf1.out')
                //  fs.readFile(correctOutput, 'utf-8', (err, cor) => {
                //      fs.readFile(test.stdout, 'utf-8', (errM, mine) => {
                //          console.log('runs test ' + 1 + ', correct result is "' + cor + '", mine is "' + mine + '", error is ' + errM);
                //
                //      });
                //   });
                  removeFile(test.stdout).then(() => {
                      if(data.stdout == 'Yes') resolve({points: 1, message: 'AC'});
                      if(data.stdout == 'No') resolve({points: 0, message: 'WA'});
                  });
            });

    });
}

async function runCode(code, taskName, ID, username, returnVerdict){

    const pth = path.join(__dirname, './tasks/' + taskName + '/info.json');                         // path to info.json
    if(!fileExists(pth)) return ["The task doesn't exist!"];                                        // if it doesnt exist (this should never happen!)
    const info = require(pth);                                                                      // gets the info.json.

    var curNum = currentSubmissionNumber++;                                                         // different file names, for safety
    createEmptySubmission(info.tests, ID);
    var codePath = path.join(__dirname, '/submissionsFolder/code' + curNum + '.cpp');               // the path to cpp file
    var execPath = path.join(__dirname, '/submissionsFolder/' + curNum + '.out');                   // the path to executable

    await createFile(codePath, code);                                                               // creates the cpp file

    var compilationCommand = 'g++ -DEVAL -O3 -fsanitize=undefined -std=c++17 -o ' + execPath + ' ' + codePath;
    queue.push({command: compilationCommand, time: 10000, memory: 500, type: 'compilation', after: compiled, taskInfo: info, id: ID, execPath: execPath, codePath: codePath, taskName: taskName, username: username, returnVerdict: returnVerdict});
}


module.exports = {
    runCode,
    createFile,
    evaluateSubtasks,
    evaluateSubtasksFully
}
