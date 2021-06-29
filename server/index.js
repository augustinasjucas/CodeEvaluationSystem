const express = require("express");

const PORT = process.env.PORT || 3001;

const path = require('path');
const app = express();
const fs = require('fs');                                                                   // file system
const bodyParser = require('body-parser');                                                  // For POST requests
const { exec } = require('child_process');                                                  // for executing the programs

var currentSubmissionNumber = 0;

app.use(bodyParser.json());

async function fileExists (path) {                                                          // checks whether the file
    try {                                                                                   // exists
        await fs.access(path);
        return true;
    }catch {
        return false;
    }
}
function executeCommand (command) {                                                         // executes a command asynchronously
                                                                                            // return a promise, which can later be
                                                                                            // used with await or .then
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            resolve({ error, stderr, stdout});
        });
  });
}
async function removeFile(path){                                                            // removes a file in `path` directory
    fs.unlink(path, function (err) {
        if (err) {
            throw err;
        }
    });
}
async function createFile(path, value){                                                     // creates a file in `path` directory
    fs.writeFile(path, value, function (err) {
        if (err) {
            throw err;
        }
    });
}
async function runTest(inputPath, code){                                                    // runs the test with given
                                                                                            // test and returns
                                                                                            // {error, stdout, stderr}

    var curNum = currentSubmissionNumber++;                                                 // in order not to get messed up, different
                                                                                            // names are used

                                                                                            // the name of cpp file
    var codePath = path.join(__dirname, '/submissionsFolder/code' + curNum + '.cpp');       // the path to cpp file
    var execPath = path.join(__dirname, '/submissionsFolder/' + curNum + '.out');           // the path to executable

    await createFile(codePath, code);                                                       // creates the .cpp file with given code

    //console.log('Compiling test with codeName: ' + curNum);
    var ret = {error: null, stdout: {}, stderr: {}};                                        // initializes the return value
    await executeCommand('g++ -std=c++17 -o ' + execPath + ' ' + codePath).then((data) => { // compiles
        if(data.error) ret = data;                                                          // if couldnt compile,this data will be returned
    });
    if(!ret.error){                                                                         // if compiled
        await executeCommand('cat ' + inputPath + ' | ' + execPath).then((data) => {        // then excetute the code with this input
            ret = data;                                                                     // and set the return data to the executed data
        });
    }

    await removeFile(codePath);                                                             // after everything, remove used files
    await removeFile(execPath);

    return new Promise((resolve, reject) => {                                               // to be async, we return a promise
        resolve(ret);
    });

}

async function runCode(code, taskName){

    const pth = path.join(__dirname, './tasks/' + taskName + '/info.json');                 // path to info.json
    if(!fileExists(pth)) return ["The task doesn't exist!"];                                // if it doesnt exist (this should never happen!)
    const info = require(pth);                                                              // gets the info.json.

    var results = [];                                                                       // prepare to store all test results
    for(var i = 1; i <= info.tests; i++){                                                   // loops through the tests
        const inpPath = path.join(__dirname, '/tasks/' + taskName + '/tests/input/' + i + '.in');
        const outPath = path.join(__dirname, '/tasks/' + taskName + '/tests/output/' + i + '.out');
        if(!fileExists(inpPath) || !fileExists(outPath)) return ["Wrong test data!"];       // this shouldn't ever happen!
        let pb = runTest(inpPath, code);                                                    // runs the code with this test
        results[i] = pb;                                                                    // stores the promise of the result in the array
    }
    await Promise.all(results);                                                             // wait until all results' promises are done
    return results;
}

/*
// Have Node serve the files for our built React app. Uncomment this before deploying the WHOLE app.
app.use(express.static(path.resolve(__dirname, '../client/build')));
*/

app.post('/code', function(req, res) {
    var thisCode = req.body.code;
    res.send({mes: "Code received"});
    const ret = runCode(thisCode, 'task-001');
    ret.then((ret) => console.log(ret));

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
