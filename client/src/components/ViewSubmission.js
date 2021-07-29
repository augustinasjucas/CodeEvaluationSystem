import React, { useState, useEffect } from 'react';
import Api from '../api.js'
import { useParams } from 'react-router-dom';
import TestViewer from './TestViewer.js'
import { CopyBlock, atomOneLight as theme } from "react-code-blocks";
import SubtasksViewer from './SubtasksViewer'
import Menu from './Menu.js'
const ViewSubmission = (props) => {
    const convertToBr = (string) => string.split('\n').map((item, index) => (index === 0) ? item : [<br key={index} />, item])
    const [submissionOnScreen, changeSubmissionOnScreen] = useState(-1);
    const [result, changeResult] = useState({subtasks: [], result: -1, code: '', score: -1});
    const [isAdmin, changeIsAdmin] = useState(false);
    const [newScore, changeNewScore] = useState('');
    var { id } = useParams();
    const changerFun = (newScore) => {
        changeResult({...result, score: newScore});
    };
    const changeThisScore = () => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.changeScore(username, password, newScore, submissionOnScreen, changerFun);
    };
    const setScore = (e) => {
        changeNewScore(e.target.value);
    }
    // downloads submission `id` from server
    const loadData = (id) => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.getSubmissionData(id, username, password).then((data) => {
            console.log('submission data: ');
            console.log(data);
            changeResult(data);
        });
        Api.checkIfAdmin(username, password).then((is) => {
            changeIsAdmin(is);
        });
    };

    useEffect(() => {
        if(submissionOnScreen === id){
            return ;
        }
        changeSubmissionOnScreen(id);
        loadData(id);
    });
    if(Object.keys(result).length == 0){
        return (
            <div>
                Loading..
            </div>
        );
    }else{
        var resultPart;
        if(!result.compiled){
            resultPart = (<div>Compilation error: <br /><code><pre> {(result.result == -1 ? '' : convertToBr(result.result))} </pre></code></div>);
        }else{
            resultPart = (<TestViewer Tests={result.result} /> );
        }
        var subtaskPart = (<SubtasksViewer Subtasks={result.subtasks} />);
        var changer = (<div></div>);
        if(isAdmin){
            changer = (
                <div>
                    <input type="text" onChange={setScore} placeholder="New score" />
                    <button onClick={changeThisScore}>Change score!</button>
                </div>
            );
        }
        return (
            <div className="submissionViewerPage">
                <Menu Username={props.Cookies.get('username')} Logout={props.Logout} />
                <div className="scorePart"> Score: {result.score} </div>
                {changer}
                <div className="compilationResultPart">Compilation: {result.compiled ? 'successful' : 'unsuccessful'} </div>
                {subtaskPart}
                <br /><br />
                {/*resultPart*/} <br />
                Code: <br />
                <CopyBlock
                  text={result.code}
                  language={'c'}
                  showLineNumbers={true}
                  wrapLines
                  theme={theme}
                />

            </div>
        );
    }
}

export default ViewSubmission;
