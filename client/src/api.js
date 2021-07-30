const DB_LINK = 'localhost:3000';
class Api {
    constructor (){

    }

    static async checkIfUserExists (username, password) {
        const requestOptions = {                                    // creating the request
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password})
        };
        var ret = false;
        await fetch(DB_LINK + '/login', requestOptions)                           // sends POST request to server with the code
            .then(response => response.json())                          // converts response to json
            .then((data) => {
                ret = data;
            });
        return ret;
    };
    static checkIfLoggedIn(cookies){
        if(!cookies.get('loggedIn')) return false;
        return cookies.get('loggedIn') == 'true';
    }
    static getAllTaskNames(cookies){
        var username = (!cookies.get('username') ? '' : cookies.get('username'));
        var password = (!cookies.get('password') ? '' : cookies.get('password'));
        return new Promise ((resolve, reject) => {
            const requestOptions = {                                    // creating the request
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username: username, password: password})
            };
            var ret = false;
            fetch(DB_LINK + '/getUserTasks', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    ret = data;
                    resolve(ret);
                });
        });
    }
    static getTaskData(taskName, username, password) {
        const requestOptions = {                                    // creating the request
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({taskName: taskName, username: username, password: password})
        };
        return new Promise((resolve, reject) => {
            fetch(DB_LINK + '/getTaskData', requestOptions)                       // sends POST request to server with the code
                .then(response => response.json())                      // converts respinse to json
                .then((data) => {
                    if(!data.statement) resolve({});
                    resolve(data);
                });
        });
    };
    static checkForResult (index, username, password){
        const requestOptions = {                                    // creating the request
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({submissionID: index, username: username, password: password})
        };
        return new Promise((resolve, reject) => {
            fetch(DB_LINK + '/getResult', requestOptions)                         // sends POST request to server with the code
                .then(response => response.json())                      // converts response to json
                .then((data) => {
                    resolve(data);
                });
        });
    };

    static submitCode(code, task, username, password) {
        const requestOptions = {                                    // creating the request
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({code: code, taskName: task, username: username, password: password})
        };
        return new Promise ( (resolve, reject) => {
            fetch(DB_LINK + '/submit', requestOptions)                            // sends POST request to server with the code
                .then(response => response.json())                      // converts respinse to json
                .then((data) => {
                    resolve(data);
                });
        });
    };
    static getSubmissionData(id, username, password){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({submissionID: id, username: username, password: password})
        };
        return new Promise ( (resolve, reject) => {
            fetch(DB_LINK + '/getResult', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    console.log('THE PRIMARY DATA IS: ');
                    console.log(data);
                    resolve(data);
                });
        });
    }
    static getSubmissions(task, username, password){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password, taskName: task})
        };
        return new Promise ( (resolve, reject) => {
            fetch(DB_LINK + '/getSubmissions', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }
    static registerNewUser(username, password, firstName, lastName){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password, firstName: firstName, lastName: lastName})
        };
        return new Promise ( (resolve, reject) => {
            if(username == '' || password == '' || firstName == '' || lastName == '') {
                resolve({mes: 'Empty fields!'});
                return ;
            }

            fetch(DB_LINK + '/register', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    console.log('Resolve ' + data);
                    resolve(data);
                });
        });
    }
    static createNewContest(username, password, contestName){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password, contestName: contestName})
        };
        return new Promise ( (resolve, reject) => {

            fetch(DB_LINK + '/createNewContest', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }
    static getAllContests(username, password){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password})
        };

        return new Promise ( (resolve, reject) => {

            fetch(DB_LINK + '/getAllContests', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }
    static getAllTasksOfContest(username, password, id){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password, contestID: id})
        };
        return new Promise ( (resolve, reject) => {

            fetch(DB_LINK + '/getNeededTasksOfContest', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }
    static addTaskToContest(username, password, contestID, taskName){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password, contestID: contestID, taskName: taskName})
        };
        return new Promise ( (resolve, reject) => {

            fetch(DB_LINK + '/addTaskToContest', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }
    static removeTaskFromContest(username, password, contestID, taskName){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password, contestID: contestID, taskName: taskName})
        };
        return new Promise ( (resolve, reject) => {

            fetch(DB_LINK + '/removeTaskFromContest', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }
    static getAllSubmissions(username, password){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password})
        };
        return new Promise ( (resolve, reject) => {

            fetch(DB_LINK + '/getAllSubmissions', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }
    static changeScore(username, password, newScore, submission, changeFunction){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password, newScore: newScore, submissionID: submission})
        };
        return new Promise ( (resolve, reject) => {

            fetch(DB_LINK + '/changeScore', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    if(data){
                        changeFunction(newScore);
                    }
                });
        });
    }
    static checkIfAdmin(username, password){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password})
        };
        return new Promise ( (resolve, reject) => {
            fetch(DB_LINK + '/checkIfAdmin', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }
    static getAllContestsSolver(username, password) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password})
        };
        return new Promise ( (resolve, reject) => {
            fetch(DB_LINK + '/getAllContestsAsSolver', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }
    static changeVisibility(username, password, contestID, val){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password, contestID: contestID, newVal: val})
        };
        return new Promise ( (resolve, reject) => {
            fetch(DB_LINK + '/changeHidingOfContest', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }
    static getContestData(username, password, contestID){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password, contestID: contestID})
        };
        return new Promise ( (resolve, reject) => {
            fetch(DB_LINK + '/getContestData', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    resolve(data);
                });
        });

    }
    static getAllTasksOfContestUser(username, password, id){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password, contestID: id})
        };
        return new Promise ( (resolve, reject) => {

            fetch(DB_LINK + '/getNeededTasksOfContestUser', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }
    static getLeaderboard(username, password, id){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: username, password: password, contestID: id})
        };
        return new Promise ( (resolve, reject) => {

            fetch(DB_LINK + '/getLeaderboard', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    resolve(data);
                });
        });
    }
}
export default Api;
