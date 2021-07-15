const express = require("express");

const PORT = process.env.PORT || 3001;

const path = require('path');
const app = express();
const fs = require('fs');                                                                           // file system
const bodyParser = require('body-parser');                                                          // For POST requests
const { exec } = require('child_process');                                                          // for executing the programs

var queue = [];
const AVAILABLE_MEMORY = 1000 * 1000 * 1800;                                                        // 1.8 GB
var usedMemory = 0;

var currentSubmissionNumber = 0;
var submissionID = 0;



app.use(bodyParser.json());

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
        let mem = Math.max(Math.round(memoryLimit*1024), 100);
        command = 'ulimit -v ' + mem + ' & ' + command;
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
async function createFile(path, value){                                                             // creates a file in `path` directory
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
    if(queue[0].memory + usedMemory > AVAILABLE_MEMORY) return ;

    usedMemory += queue[0].memory;
    var ths = queue[0];
    queue.shift();                                                                                  // removes first element O(N)

    if(ths.type == 'compilation'){
        console.log('compilation!');
        executeCommand(ths.command, ths.time, ths.memory).then((data) => {                          // compiles
            if(data.error){
                returnVerdict(ths.id, data.error, false);
            }else{
                compiled(ths.taskInfo, ths.id, ths.execPath, ths.taskName);
            }
        });
    }else if(ths.type == 'test'){                                                                   // if its a test, runs it
        runTest(ths.inpPath, ths.execPath, ths.time, ths.memory).then((data) => {
            extractResult(data, ths.outPath).then((final) => {
                console.log('ID: ' + ths.id + ', testo Nr.: ' + ths.testNum + ', res: ');           // `final` is the result of the test
                console.log(final);
            });
        });
        //results[i] = extractResult(pb, outPath);
    }
}
setInterval(checkQueue, 50);                                                                        // checks the queue every 50ms
function compiled(info, ID, execPath, taskName){

    for(var i = 1; i <= info.tests; i++){                                                           // loops through the tests
        const inpPath = path.join(__dirname, '/tasks/' + taskName + '/tests/input/' + i + '.in');
        const outPath = path.join(__dirname, '/tasks/' + taskName + '/tests/output/' + i + '.out');
        if(!fileExists(inpPath) || !fileExists(outPath)) return ["Wrong test data!"];               // this shouldn't ever happen!
        queue.push({outPath: outPath, inpPath: inpPath, execPath: execPath, time: info.time_limit, memory: info.memory_limit, id: ID, testNum: i, type: 'test'});
    }
}
function returnVerdict(ID, verdict, compiled){
    if(!compiled){                                                                                  // `verdict` will be compilation error
        console.log('' + ID + ' did not compile:');
        console.log(verdict);
        console.log('-----');
    }else{

    }
}
async function runTest(inputPath, execPath, timeLimit, memoryLimit){                                // runs the test with given
                                                                                                    // test and returns
                                                                                                    // {error, stdout_file, stderr}

    var ret = {error: null, stdout: {}, stderr: {}};                                                // initializes the return value
    var curNum = currentSubmissionNumber++;
    var outputName = path.join(__dirname, '/submissionsFolder/outputOf' + curNum + '.out');

    await executeCommand('cat ' + inputPath + ' | time ' + execPath + ' > ' + outputName, timeLimit, memoryLimit).then((data) => {    // then excetute the code with this input
        ret.error = data.error;                                                                     // and set the return data to the executed data
        ret.stdout = outputName;
        ret.stderr = data.stderr;
    });

    return new Promise((resolve, reject) => {                                                       // to be async, we return a promise
        resolve(ret);
    });
}
function findPattern(where, what){                                                                  // return true if 'what' is found within 'where'
    return where.includes(what);
}
async function extractResult(test, correctOutput){                                                  // takes the output of command and gets result in normal form

    return new Promise ((resolve, reject) => {
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
        let command = 'echo "' + correctOutput + ' ' + test.stdout + '" | ' + path.join(__dirname, '/additionalPrograms/comparison');
        executeCommand(command, 10000, 10)
            .then((data) => {
                removeFile(test.stdout).then(() => {
                    if(data.stdout == 'Yes') resolve({points: 1, message: 'AC'});
                    if(data.stdout == 'No') resolve({points: 0, message: 'WA'});
                });
            });

    });
}

async function runCode(code, taskName){

    const pth = path.join(__dirname, './tasks/' + taskName + '/info.json');                         // path to info.json
    if(!fileExists(pth)) return ["The task doesn't exist!"];                                        // if it doesnt exist (this should never happen!)
    const info = require(pth);                                                                      // gets the info.json.

    var curNum = currentSubmissionNumber++;                                                         // different file names, for safety
    var ID = submissionID++;

    var codePath = path.join(__dirname, '/submissionsFolder/code' + curNum + '.cpp');               // the path to cpp file
    var execPath = path.join(__dirname, '/submissionsFolder/' + curNum + '.out');                   // the path to executable

    await createFile(codePath, code);                                                               // creates the cpp file

    var compilationCommand = 'g++ -DEVAL -O3 -fsanitize=undefined -std=c++17 -o ' + execPath + ' ' + codePath;
    queue.push({command: compilationCommand, time: 10000, memory: 500, type: 'compilation', after: compiled, taskInfo: info, id: ID, execPath: execPath, taskName: taskName});
}

/*
// Have Node serve the files for our built React app. Uncomment this before deploying the WHOLE app.
app.use(express.static(path.resolve(__dirname, '../client/build')));
*/

app.post('/code', function(req, res) {
    var thisCode = req.body.code;
    res.send({mes: "Code received"});
    runCode(thisCode, 'task-001');

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
