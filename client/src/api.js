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
        await fetch('/login', requestOptions)                           // sends POST request to server with the code
            .then(response => response.json())                          // converts response to json
            .then((data) => {
                ret = data;
            });
        return ret;
    };
    static checkIfLoggedIn(cookies){
        //console.log('checkinam, ar prisijungta:')
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
            fetch('/getUserTasks', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    ret = data;
                    resolve(ret);
                    console.log('ret: ');
                    console.log(ret);
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
            fetch('/getTaskData', requestOptions)                       // sends POST request to server with the code
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
            fetch('/getResult', requestOptions)                         // sends POST request to server with the code
                .then(response => response.json())                      // converts response to json
                .then((data) => {
                    resolve(data);
                });
        });
    };

    static submitCode(code, username, password) {
        const requestOptions = {                                    // creating the request
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({code: code, username: username, password: password})
        };
        return new Promise ( (resolve, reject) => {
            fetch('/submit', requestOptions)                            // sends POST request to server with the code
                .then(response => response.json())                      // converts respinse to json
                .then((data) => {
                    resolve(data);
                });
        });
    };
}
export default Api;
