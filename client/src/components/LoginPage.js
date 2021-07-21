import React, { useState } from 'react';
import Api from '../api.js'
import Cookies from 'universal-cookie';

const LoginPage = (props) => {

    const hash = (val) => {                                                     // TODO: change this!
        return val;
    }

    // stores what is in the input field:
    const [username, changeUsername] = useState('');
    const [password, changePassword] = useState('');

    const [cookies, changeCookies] = useState(new Cookies);

    const handleUsernameChange = (e) => {
        changeUsername(e.target.value);
    };
    const handlePasswordChange = (e) => {
        changePassword(e.target.value);
    };

    // when logging in, checks if user exists
    const onLogin = (username, password) => {
        Api.checkIfUserExists(username, password).then((exists) => {
            if(exists){
                cookies.set('loggedIn', true, { path: '/' });
                cookies.set('username', username, { path: '/' });
                cookies.set('password', password, { path: '/' });
                props.changeLoggedIn(true);
            }else{
                alert('does not exist!');                                       // TODO: change this!
            }
        });
    };
    const submit = () => {
        onLogin(username, hash(password));
    };
    return (
        <div className="LoginPage">
            Login page! Submit page is in /sample. Username: insertUsername, password: insertHashedPassword<br /><br />
            <input type="text" placeholder="Username" onChange={handleUsernameChange} /> <br />
            <input type="password" placeholder="Password" onChange={handlePasswordChange} /> <br />
            <button onClick={submit}>Submit!</button>
        </div>
      );
}

export default LoginPage;
