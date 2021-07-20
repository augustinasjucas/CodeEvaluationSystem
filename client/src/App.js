import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage.js'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie';
import Api from './api.js'
import MainPage from './components/MainPage.js'

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
        return (
            <Router>
                <div className="App">
                    <Switch>
                        <Route path="/login">
                            <Redirect to="/" />
                        </Route>
                        <Route path="/">
                            <MainPage Cookies={cookies} logOut={logOut}/>
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
