import React, { useState, useEffect } from 'react';
import CodeInputBox from './CodeInputBox'

function SamplePage() {
    const [testResult, setTestResult] = useState('');
    const [statement, changeStatement] = useState('Loading');

    const escapedNewLineToLineBreakTag = (string) => {
        return string.split('\n').map((item, index) => {
            return (index === 0) ? item : [<br key={index} />, item]
        })
    }
    const checkForResult = (index) => {
        const requestOptions = {                                    // creating the request
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({submissionID: index, username: 'insertUsername', password: 'insertHashedPassword'})
        };
        console.log('checkinam!');
        fetch('/getResult', requestOptions)                         // sends POST request to server with the code
            .then(response => response.json())                      // converts response to json
            .then((data) => {
                if(data.result){
                    setTestResult(JSON.stringify(data.result));
                }else{
                    setTimeout(checkForResult, 200, index);
                }
            });
    };

    const onSubmitOfCode = (code) => {
        const requestOptions = {                                    // creating the request
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({code: code, username: 'insertUsername', password: 'insertHashedPassword'})
        };
        fetch('/submit', requestOptions)                            // sends POST request to server with the code
            .then(response => response.json())                      // converts respinse to json
            .then((data) => {
                setTimeout(checkForResult, 200, data.submissionNumer);
            });
    };
    const getTaskData = (taskName) => {
        const requestOptions = {                                    // creating the request
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({taskName: taskName, username: 'insertUsername', password: 'insertHashedPassword'})
        };
        fetch('/getTaskData', requestOptions)                       // sends POST request to server with the code
            .then(response => response.json())                      // converts respinse to json
            .then((data) => {
                data.statement += '\nLaiko limitas: ' + data.timeLimit + 'ms\nAtminties limitas: ' + data.memoryLimit + 'MB\n';
                changeStatement(escapedNewLineToLineBreakTag(data.statement));
            });
    };
    useEffect(() => {getTaskData('task-001')});
    return (
        <div>
            <div>{statement}</div>
            <CodeInputBox placeholder='input the code!' onSubmit={onSubmitOfCode}/>
            <div>{testResult}</div>
        </div>
      );
}

export default SamplePage;
