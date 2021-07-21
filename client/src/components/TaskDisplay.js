import React, { useState, useEffect } from 'react';
import CodeInputBox from './CodeInputBox.js'
import Api from '../api.js'

const TaskDisplay = (props) => {
    const [currentTaskOnScreen, changeCurrentTaskOnScreen] = useState('');
    const [testResult, setTestResult] = useState('');
    const [statement, changeStatement] = useState('Loading');

    // converts all \n to <br /> in the statement
    const escapedNewLineToLineBreakTag = (string) => {
        return string.split('\n').map((item, index) => {
            return (index === 0) ? item : [<br key={index} />, item]
        })
    }

    // asks if submission was evaluated every 200s
    const checkForResult = (index) => {
        Api.checkForResult(index, 'insertUsername', 'insertHashedPassword').then((data) => {
            if(data.result){
                setTestResult(JSON.stringify(data));
            }else{
                setTimeout(checkForResult, 200, index);
            }
        });
    };

    // submits code and starts checking for evaluation
    const onSubmitOfCode = (code) => {
        Api.submitCode(code, currentTaskOnScreen, 'insertUsername', 'insertHashedPassword').then((data) => {
            setTimeout(checkForResult, 200, data.submissionNumer);
        });
    };

    // gets all data of the task from server: TL, ML, statement, etc.
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
        }
    });

    // if some task is on the screen
    if(props.TaskName != ''){
        return (
            <div>
                <div>{statement}</div>
                <CodeInputBox placeholder='input the code!' onSubmit={onSubmitOfCode}/>
                <div>{testResult}</div>
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
