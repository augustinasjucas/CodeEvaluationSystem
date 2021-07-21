import React, { useState, useEffect } from 'react';
import Api from '../api.js';
import OneSubmissionResult from './OneSubmissionResult.js';

const SubmissionsList = (props) => {
    const [currentTaskOnScreen, changeCurrentTaskOnScreen] = useState('');
    const [submissions, changeSubmissions] = useState([]);
    const getSubmissions = (username, password, taskName) => {
        Api.getSubmissions(taskName, username, password).then((data) => {
            console.log('it is now ');
            console.log(data);
            changeSubmissions(data.reverse());
        });
    };

    // checks if new task is on screen OR if this component needs to be updated
    // and if it does, then updates it by getting submissions from the server.
    useEffect(() => {
        if((props.TaskName != '' && currentTaskOnScreen != props.TaskName) || props.HaveToUpdate){
            changeCurrentTaskOnScreen(props.TaskName);
            props.ChangeHaveToUpdate(false);
            var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
            var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
            Api.checkIfUserExists(username, password).then((exists) => {
                if(!exists) return ;
                getSubmissions(username, password, props.TaskName);
            });
        }
    });
    console.log(submissions);

    var ret = submissions.map(sub => (<OneSubmissionResult key={sub.index} Submission={sub}/>));
    return (
        <table>
            {ret}
        </table>
    );
}

export default SubmissionsList;
