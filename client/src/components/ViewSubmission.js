import React, { useState, useEffect } from 'react';
import Api from '../api.js'
import { useParams } from 'react-router-dom';
import TestViewer from './TestViewer.js'
import { CopyBlock, atomOneLight as theme } from "react-code-blocks";
import SubtasksViewer from './SubtasksViewer'
import Menu from './Menu.js'
const ViewSubmission = (props) => {
    const [submissionOnScreen, changeSubmissionOnScreen] = useState(-1);
    const [result, changeResult] = useState({});

    var { id } = useParams();


    // downloads submission `id` from server
    const loadData = (id) => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.getSubmissionData(id, username, password).then((data) => {
            changeResult(data);
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
            resultPart = (<div>Compilation error: <br /> {JSON.stringify(result.result)} </div>);
        }else{
            resultPart = (<TestViewer Tests={result.result} /> );
        }
        var subtaskPart = (<SubtasksViewer Subtasks={result.subtasks} />);

        return (
            <div className="submissionViewerPage">
                <Menu Username={props.Cookies.get('username')} Logout={props.Logout} />
                <div className="scorePart"> Score: {result.score} </div>
                <div className="compilationResultPart">Compilation: {result.compiled ? 'successful' : 'unsuccessful'} </div>
                {subtaskPart}
                <br /><br />
                {resultPart} <br />
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
