import React, { useState } from 'react';
import CodeInputBox from './components/CodeInputBox'
function App() {
    const [testResult, setTestResult] = useState('');
    const checkForResult = (index) => {
        const requestOptions = {                                    // creating the request
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({submissionID: index})
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
    }

    const onSubmitOfCode = (code) => {
        const requestOptions = {                                    // creating the request
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({code: code})
        };
        fetch('/submit', requestOptions)                            // sends POST request to server with the code
            .then(response => response.json())                      // converts respinse to json
            .then((data) => {
                setTimeout(checkForResult, 200, data.submissionNumer);
            });
    }
    return (
        <div className="App">
            <CodeInputBox placeholder='input the code!' onSubmit={onSubmitOfCode}/>
            <div>{testResult}</div>
        </div>
      );
}

export default App;
