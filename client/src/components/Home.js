import React, { useState, useEffect } from 'react';
import Api from '../api.js'
import { Link } from 'react-router-dom';
import Menu from './Menu.js';
import TaskSelector from './TaskSelector.js'
const Home = (props) => {
    const [taskNames, changeTaskNames] = useState([]);  //
    useEffect(() => {
        Api.getAllTaskNames(props.Cookies).then((data) => changeTaskNames(data));
    }, []);

    return (
        <div className="homePageDiv">
            <Menu Username={props.Cookies.get('username')} Logout={props.Logout} />
            <TaskSelector TaskNames={taskNames} />
        </div>
    );

}
           // <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.message}</td>
            // <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.points} / 1</td>

export default Home;
