var submissions = [];

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

module.exports = {
    getLastSubmissionNumber,
    addSubmission,
    findIfSubExists,
    getSubResult,

}
