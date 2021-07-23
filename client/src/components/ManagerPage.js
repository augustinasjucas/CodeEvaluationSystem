import React, { useState, useEffect } from 'react';
import Api from '../api.js'
import OneContestSelector from './OneContestSelector.js'
const ManagerPage = (props) => {
    const [contestName, changeContestName] = useState('');
    const [contests, changeContests] = useState([]);
    const [needToLoadContests, changeNeedToLoadContests] = useState(true);

    const changeNewName = (e) => {
        changeContestName(e.target.value);
    }
    const createNewContest = () => {
        Api.createNewContest(props.Cookies.get('username'), props.Cookies.get('password'), contestName).then((data) => {
            changeNeedToLoadContests(true);
        });
    }
    useEffect(() => {
        if(needToLoadContests){
            changeNeedToLoadContests(false);
            Api.getAllContests(props.Cookies.get('username'), props.Cookies.get('password')).then((data) => {
                changeContests(data);
            });
        }
    });
    useEffect(() => {
        setInterval(() => {changeNeedToLoadContests(true)}, 5000);
    }, []);
    var contestSelector = contests.map((contest) => <OneContestSelector Contest={contest}/>);
    return (
        <div>
            <input placeholder="Name of the new contest" onChange={changeNewName}></input>
            <button onClick={createNewContest}>Create new contest</button>
            <br />
            <br />
            <table>
                {contestSelector}
            </table>
        </div>
    );
}

export default ManagerPage;
