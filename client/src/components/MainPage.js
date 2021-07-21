import React, { useState, useEffect } from 'react';
import Api from '../api.js'
import TaskSelector from './TaskSelector.js'
import TaskDisplay from './TaskDisplay.js'

const MainPage = (props) => {
    const [taskNames, changeTaskNames] = useState([]);  //
    const [currentTask, changeCurrentTask] = useState('');

    // downloads all tasknames of this user once.                                                                        
    useEffect(() => {
        Api.getAllTaskNames(props.Cookies).then((data) => changeTaskNames(data));
    }, []);

    // changes the task that is currently on the screen
    const chooseTask = (task) => {
        changeCurrentTask(task.id);
    };
    return (
        <div>
            <div>Logged in!</div>
            <button onClick={props.logOut}>Log out</button>
            <br />
            <TaskSelector TaskNames={taskNames} ChooseTask={chooseTask} />
            <TaskDisplay Cookies={props.Cookies} TaskName={currentTask} />
        </div>
    );
}

export default MainPage;
