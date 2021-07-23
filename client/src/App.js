import React, { useState } from 'react';
import LoginPage from './components/LoginPage.js'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie';
import Api from './api.js'
import MainPage from './components/MainPage.js'
import ViewSubmission from './components/ViewSubmission.js'
import Home from './components/Home.js'
import MathJax from 'mathjax3-react';
import RegistrationPage from './components/RegistrationPage.js'
import ManagerPage from './components/ManagerPage.js'
import ManageContest from './components/ManageContest.js'

function App() {
    const [cookies ] = useState(new Cookies);
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
                            <Route path='/manager/contest/:id'>
                                <ManageContest Cookies={cookies}/>
                            </Route>
                            <Route path='/manager' >
                                <ManagerPage Cookies={cookies} />
                            </Route>
                            <Route path='/register'>
                                <Redirect to='/' />
                            </Route>
                            <Route path="/task/:taskName">
                                <MainPage Cookies={cookies} logOut={logOut}/>
                            </Route>
                            <Route path="/submission/:id">
                                <ViewSubmission Logout={logOut}Cookies={cookies} />
                            </Route>
                            <Route path="/login">
                                <Redirect to="/" />
                            </Route>
                            <Route path="/">
                                <Home Cookies={cookies} Logout={logOut} />
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
                        <Route path="/register">
                            <RegistrationPage changeLoggedIn={changeLoggedIn}/>
                        </Route>
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
