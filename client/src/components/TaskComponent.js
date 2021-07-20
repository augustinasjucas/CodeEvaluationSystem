import React, { useState, useEffect } from 'react';
import CodeInputBox from './CodeInputBox'
import Api from '../api.js'

function TaskComponent(props) {
    const [testResult, setTestResult] = useState('');
    const [statement, changeStatement] = useState('Loading');

    const escapedNewLineToLineBreakTag = (string) => {
        return string.split('\n').map((item, index) => {
            return (index === 0) ? item : [<br key={index} />, item]
        })
    }
    const checkForResult = (index) => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.checkForResult(index, username, password).then((data) => {
            if(data.result){
                setTestResult(JSON.stringify(data.result));
            }else{
                setTimeout(checkForResult, 200, index);
            }
        });
    };

    const onSubmitOfCode = (code) => {
        var username = (props.Cookies.get('username') ? props.Cookies.get('username') : '');
        var password = (props.Cookies.get('password') ? props.Cookies.get('password') : '');
        Api.submitCode(code, username, password).then((data) => {
            setTimeout(checkForResult, 200, data.submissionNumer);
        });
    };
    const getTaskData = (taskName) => {
        Api.getTaskData(taskName, username, password).then((data) => {
            data.statement += '\nLaiko limitas: ' + data.timeLimit + 'ms\nAtminties limitas: ' + data.memoryLimit + 'MB\n';
            changeStatement(escapedNewLineToLineBreakTag(data.statement));
        });

    };
    useEffect(() => {
        getTaskData(props.taskName);
    }, []);
    return (
        <div>
            <div>{statement}</div>
            <CodeInputBox placeholder='input the code!' onSubmit={onSubmitOfCode}/>
            <div>{testResult}</div>
            <button onClick={Api.getAllTaskNames.bind(this, props.Cookies)}>Get tasks</button>
        </div>
      );
}

export default TaskComponent;
