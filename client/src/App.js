import React, { useState, useEffect } from 'react';
import SamplePage from './components/SamplePage.js'
import LoginPage from './components/LoginPage.js'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie';
import Api from './api.js'

function App() {
    const [cookies, changeCookies] = useState(new Cookies);
    const [loggedIn, changeLoggedIn] = useState(Api.checkIfLoggedIn(cookies));

    const logOut = () => {
        cookies.set('loggedIn', false, { path: '/' });
        cookies.set('username', '', { path: '/' });
        cookies.set('password', '', { path: '/' });
        changeLoggedIn(false);
    }

    if(loggedIn){                                                               // if logged in, return the page
        console.log('logged in, loacl var: ' + loggedIn + ', cehck: ' + Api.checkIfLoggedIn(cookies));
        return (
            <Router>
                <div className="App">
                    <Switch>
                        <Route path="/login">
                            <Redirect to="/" />
                        </Route>
                        <Route path="/sample">
                            <SamplePage />
                        </Route>
                        <Route path="/">
                            <div>Logged in!</div>
                            <button onClick={logOut}>Log out</button>
                        </Route>
                    </Switch>
                </div>
            </Router>
          );
    }else{                                                                      // if not logged in return /login
        return (
            <Router>
                <div className="App">
                    <Switch>
                        <Route path="/login">

                            <LoginPage changeLoggedIn={changeLoggedIn} />
                        </Route>
                        <Route path="/">
                            <Redirect to="/login" />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
