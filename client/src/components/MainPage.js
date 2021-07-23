import React, { useState, useEffect } from 'react';
import Api from '../api.js'
import TaskSelector from './TaskSelector.js'
import TaskDisplay from './TaskDisplay.js'
import { useParams } from 'react-router-dom';
import Menu from './Menu.js'

const MainPage = (props) => {
    const [currentTask, changeCurrentTask] = useState('');
    var { taskName } = useParams();
    // downloads all tasknames of this user once.

    // changes the task that is currently on the screen
    useEffect(() => {
        console.log(taskName);
        if(taskName && currentTask != taskName){
            changeCurrentTask(taskName);
        }
    });
    return (
        <div className="mainPageDiv">
            <Menu Username={props.Cookies.get('username')} Logout={props.logOut} />
            <TaskDisplay Cookies={props.Cookies} TaskName={currentTask} />
        </div>
    );
}

export default MainPage;
