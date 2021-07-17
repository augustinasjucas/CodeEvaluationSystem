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
}
export default Api;
