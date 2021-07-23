import React, { useState } from 'react';
import Api from '../api.js'
import Cookies from 'universal-cookie';
import sha256 from 'js-sha256'
const RegistrationPage = (props) => {

    const hash = (val) => {
        console.log('' + val + ' -> ' + sha256(val));
        return sha256(val);
    }

    // stores what is in the input field:
    const [username, changeUsername] = useState('');
    const [password, changePassword] = useState('');
    const [firstName, changeFirstName] = useState('');
    const [lastName, changeLastName] = useState('');

    const [cookies, changeCookies] = useState(new Cookies);

    const handleUsernameChange = (e) => {
        changeUsername(e.target.value);
    };
    const handlePasswordChange = (e) => {
        changePassword(e.target.value);
    };
    const handleFirstNameChange = (e) => {
        changeFirstName(e.target.value);
    };
    const handleLastNameChange = (e) => {
        changeLastName(e.target.value);
    };

    // when logging in, checks if user exists
    const onRegister = (username, password, firstName, lastName) => {
        Api.registerNewUser(username, password, firstName, lastName).then((registered) => {
            console.log(registered);
            if(registered.mes == 'Success!'){
                cookies.set('loggedIn', true, { path: '/' });
                cookies.set('username', username, { path: '/' });
                cookies.set('password', password, { path: '/' });
                props.changeLoggedIn(true);
            }else{
                console.log('mes: ' + registered);
                alert(registered.mes);                                              // TODO: change this!
            }
        });
    };
    const submit = () => {
        console.log('submit!');
        onRegister(username, hash(password), firstName, lastName);
    };
    /*
        Username: insertUsername, password: insertHashedPassword; <br />
        Username: admin, password: admin <br />
    */
    return (
        <div className="loginPage">
            <div className="loginHolder">
                <h2>Register page</h2>
                <input className="loginField" type="text" placeholder="Username" onChange={handleUsernameChange} /> <br />
                <input className="loginField" type="password" placeholder="Password" onChange={handlePasswordChange} /> <br />
                <input className="loginField" type="text" placeholder="First name" onChange={handleFirstNameChange} /> <br />
                <input className="loginField" type="text" placeholder="Last name" onChange={handleLastNameChange} /> <br />

                <button className="loginSubmitButton" onClick={submit}>Submit!</button>
            </div>
        </div>
      );
}

export default RegistrationPage;
