import React, { useState, useEffect } from 'react';
import Api from '../api.js'
import OneContestSelector from './OneContestSelector.js'
import OneSubmissionResult from './OneSubmissionResult.js'

const ManagerPage = (props) => {
    const [contestName, changeContestName] = useState('');
    const [contests, changeContests] = useState([]);
    const [needToLoadContests, changeNeedToLoadContests] = useState(true);
    const [allSubmissions, changeAllSubmissions] = useState([]);

    const changeNewName = (e) => {
        changeContestName(e.target.value);
    }
    const createNewContest = () => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.createNewContest(username, password, contestName).then((data) => {
            changeNeedToLoadContests(true);
        });
    }
    const getAllSubmissions = () => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.getAllSubmissions(username, password).then((data) => {
            changeAllSubmissions(data);
            console.log(data);
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
        var int = setInterval(() => {changeNeedToLoadContests(true)}, 5000);
        getAllSubmissions();
        return () => {
            clearInterval(int);
        }
    }, []);
    var contestSelector = contests.map((contest) => <OneContestSelector Contest={contest}/>);
    var submissionsSelector = allSubmissions.map((sub) => <OneSubmissionResult ShowUsername={true} Submission={sub} /> );
    return (
        <div>
            <input placeholder="Name of the new contest" onChange={changeNewName}></input>
            <button onClick={createNewContest}>Create new contest</button>
            <br />
            <br />
            <table>
                {contestSelector}
            </table>

            <br /> <br />
            <table className="submissionListTable">
                {submissionsSelector}
            </table>
        </div>
    );
}

export default ManagerPage;
