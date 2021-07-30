import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../api.js'
import Leaderboard from './Leaderboard.js'

const ManageContest = (props) => {

    var { id } = useParams();
    const [contest, changeContest] = useState({name: '', hidden: true});
    const [contestOnScreen, changeContestOnScreen] = useState(-1);
    const [myTasks, changeMyTasks] = useState([]);
    const [availableTasks, changeAvailableTasks] = useState([]);
    const [selectedTask, changeSelectedTask] = useState('');
    const [remTask, changeRemTask] = useState('');
    const [leaderboard, changeLeaderboard] = useState({leaderboard: [], users: [], tasks: []});

    const makeHidden = () => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.changeVisibility(username, password, contestOnScreen, true);
    }
    const makeVisible = () => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.changeVisibility(username, password, contestOnScreen, false);
    }
    const changeRemovableTask = (e) => {
        changeRemTask(e.target.value);
    }
    const chooseSelectedTask = (e) => {
        changeSelectedTask(e.target.value);
    }
    const addTask = () => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.addTaskToContest(username, password, id, selectedTask).then((data) => {
        });
    }
    const removeTask = () => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        console.log('selected task: ' + remTask);
        Api.removeTaskFromContest(username, password, id, remTask).then((data) => {
        });
    }
    const loadData = () => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.getAllTasksOfContest(username, password, id).then((data) => {
            changeMyTasks(data.mine);
            changeAvailableTasks(data.missing);
            if(!data.mine.includes(remTask)) {
                changeRemTask(data.mine[0]);
            }
            if(!data.missing.includes(selectedTask)) {
                changeSelectedTask(data.missing[0]);
            }
        });
        Api.getContestData(username, password, id).then((data) => {
            console.log(data);
            changeContest(data);
        });
        Api.getLeaderboard(username, password, id).then((data) => {
            console.log('getLeaderboard:');
            console.log(data);
            changeLeaderboard(data);
        });
    }

    useEffect(() => {
        if(contestOnScreen === id){
            return ;
        }
        changeContestOnScreen(id);
        loadData(id);
    });
    var selector = availableTasks.map((task) => (<option value={task}> {task} </option>));
    var myTasksView = myTasks.map((task) => (<span>{task}, </span>));
    var myTasksDel = myTasks.map((task) =>  (<option value={task.taskname}> {task} </option>));
    var leaderboardView = (<Leaderboard Leaderboard={leaderboard} Cookies={props.Cookies} />);
    return (
        <div>
            Managing contest {id}, name: {contest.name} <br />  <br />

            My tasks: {myTasksView} <br />
            <select onChange={changeRemovableTask} >
                {myTasksDel}
            </select>
            <button onClick={removeTask}>Remove the task!</button>
            <br /><br />

            Missing tasks:
            <select onChange={chooseSelectedTask} >
                {selector}
            </select>
            <button onClick={addTask}>Add the task!</button>
            <br /> <br />
            Contest is {(contest.hidden ? 'hidden' : 'visible')}
            <button onClick={makeHidden}>Hide contest!</button>
            <button onClick={makeVisible}>Unhide contest!</button>
            <br />
            <br />
            {leaderboardView}

        </div>
    );
}

export default ManageContest;
