import React, { useState, useEffect } from 'react';
import Api from '../api.js'
import { Link } from 'react-router-dom';
import Menu from './Menu.js';
import TaskSelector from './TaskSelector.js'
import ContestSelector from './ContestSelector'
const Home = (props) => {
    const [contests, changeContests] = useState([]);  //
    useEffect(() => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username')  : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password')  : '');
        Api.getAllContestsSolver(username, password).then((data) => {
            console.log('downloaded contests: ');
            console.log(data);
            changeContests(data)
        });
    }, []);

    return (
        <div className="homePageDiv">
            <Menu Username={props.Cookies.get('username')} Logout={props.Logout} />
            <ContestSelector ContestList={contests} />
        </div>
    );

}
           // <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.message}</td>
            // <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.points} / 1</td>

export default Home;
