import React, { useState, useEffect } from 'react';
import Api from '../api.js'
import TaskSelector from './TaskSelector.js'
import TaskDisplay from './TaskDisplay.js'
import { useParams } from 'react-router-dom';
import Menu from './Menu.js'

const ContestViewer = (props) => {
    const [currentContest, changeCurrentContest] = useState('');
    const [tasks, changeTasks] = useState([]);
    const [contestData, changeContestData] = useState({name: '', id: ''});
    var { id } = useParams();
    const getContestData = () => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.getContestData(username, password, id).then((data) => {
            changeContestData(data);
        });
        Api.getAllTasksOfContestUser(username, password, id).then((data) => {
            changeTasks(data);
        });
    }
    useEffect(() => {
        if(id && currentContest != id){
            changeCurrentContest(id);
            getContestData();
        }
    });
    return (
        <div className="mainPageDiv">
            <Menu Username={props.Cookies.get('username')} Logout={props.logOut} />
            <center><h3>{contestData.name}</h3></center>
            <TaskSelector Cookies={props.Cookies} TaskNames={tasks} />
        </div>
    );
}

export default ContestViewer;
