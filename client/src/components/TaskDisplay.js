import React, { useState, useEffect } from 'react';
import Api from '../api.js'
import CodeInputBox from './CodeInputBox.js'
import SubmissionsList from './SubmissionsList.js'


const TaskDisplay = (props) => {
    const [currentTaskOnScreen, changeCurrentTaskOnScreen] = useState('');
    const [testResult, setTestResult] = useState('');
    const [statement, changeStatement] = useState('Loading');
    const [haveToUpdateSubmissions, changeHaveToUpdateSubmissions] = useState(true);

    // converts all \n to <br /> in the statement
    const escapedNewLineToLineBreakTag = (string) => {
        return string.split('\n').map((item, index) => {
            return (index === 0) ? item : [<br key={index} />, item]
        })
    }

    // asks if submission was evaluated every 200s
    const checkForResult = (index) => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.checkForResult(index, username, password).then((data) => {
            if(data.result){
                setTestResult(JSON.stringify(data));
            }else{
                setTimeout(checkForResult, 200, index);
            }
        });
    };

    // submits code and starts checking for evaluation
    const onSubmitOfCode = (code) => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.submitCode(code, currentTaskOnScreen, username, password).then((data) => {
            setTimeout(checkForResult, 200, data.submissionNumer);
        });
    };

    // gets all data of the task from server: TL, ML, statement, etc.
    const getTaskData = (taskName) => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.getTaskData(taskName, username, password).then((data) => {
            data.statement += '\nLaiko limitas: ' + data.timeLimit + 'ms\nAtminties limitas: ' + data.memoryLimit + 'MB\n';
            changeStatement(escapedNewLineToLineBreakTag(data.statement));
        });

    };
    useEffect(() => {
        if(props.TaskName != '' && currentTaskOnScreen != props.TaskName){
            changeCurrentTaskOnScreen(props.TaskName);
            getTaskData(props.TaskName);
        }
    });

    // if some task is on the screen
    if(props.TaskName != ''){
        return (
            <div>
                <div>{statement}</div>
                <CodeInputBox placeholder='input the code!' onSubmit={onSubmitOfCode}/>
                <SubmissionsList Cookies={props.Cookies} TaskName={currentTaskOnScreen} HaveToUpdate={haveToUpdateSubmissions} ChangeHaveToUpdate={changeHaveToUpdateSubmissions}/>
            </div>
          );

    // if no task is on the screen:
    }else{
        return (
            <div>
            </div>
        );
    }

}

export default TaskDisplay;
