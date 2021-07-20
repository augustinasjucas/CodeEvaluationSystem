import React, { useState, useEffect } from 'react';
import CodeInputBox from './CodeInputBox.js'
import Api from '../api.js'

const TaskDisplay = (props) => {
    const [currentTaskOnScreen, changeCurrentTaskOnScreen] = useState('');
    const [testResult, setTestResult] = useState('');
    const [statement, changeStatement] = useState('Loading');

    const escapedNewLineToLineBreakTag = (string) => {
        return string.split('\n').map((item, index) => {
            return (index === 0) ? item : [<br key={index} />, item]
        })
    }
    const checkForResult = (index) => {
        Api.checkForResult(index, 'insertUsername', 'insertHashedPassword').then((data) => {
            if(data.result){
                setTestResult(JSON.stringify(data.result));
            }else{
                setTimeout(checkForResult, 200, index);
            }
        });
    };

    const onSubmitOfCode = (code) => {
        Api.submitCode(code, 'insertUsername', 'insertHashedPassword').then((data) => {
            setTimeout(checkForResult, 200, data.submissionNumer);
        });
    };
    const getTaskData = (taskName) => {
        Api.getTaskData(taskName, 'insertUsername', 'insertHashedPassword').then((data) => {
            data.statement += '\nLaiko limitas: ' + data.timeLimit + 'ms\nAtminties limitas: ' + data.memoryLimit + 'MB\n';
            changeStatement(escapedNewLineToLineBreakTag(data.statement));
        });

    };
    useEffect(() => {
        if(props.TaskName != '' && currentTaskOnScreen != props.TaskName){
            changeCurrentTaskOnScreen(props.TaskName);
            getTaskData(props.TaskName);
            console.log('getTaskData "' + props.TaskName + '"' );
        }
    });
    if(props.TaskName != ''){
        return (
            <div>
                <div>{statement}</div>
                <CodeInputBox placeholder='input the code!' onSubmit={onSubmitOfCode}/>
                <div>{testResult}</div>
            </div>
          );
    }else{
        return (
            <div>

            </div>
        );
    }

}

export default TaskDisplay;
