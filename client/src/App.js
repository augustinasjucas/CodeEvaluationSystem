import React, { useState, useEffect } from 'react';
import SamplePage from './components/SamplePage.js'
import LoginPage from './components/LoginPage.js'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>

                    <Route path="/sample">
                        <SamplePage />
                    </Route>
                    <Route path="/">
                        <LoginPage />
                    </Route>
                </Switch>
            </div>
        </Router>
      );
}

export default App;
