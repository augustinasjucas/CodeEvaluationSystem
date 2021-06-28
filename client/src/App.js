import React from 'react';
import CodeInputBox from './components/CodeInputBox'
function App() {


    const onSubmitOfCode = (code) => {
        const requestOptions = {                                    // creating the request
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({code: code})
        };
        fetch('/code', requestOptions)                              // sends POST request to server with the code
            .then(response => response.json())                      // converts respinse to json
            .then(data => console.log(data));                       // received back 'data'.
    }
    return (
        <div className="App">
            <CodeInputBox placeholder='input the code!' onSubmit={onSubmitOfCode}/>
        </div>
      );
}

export default App;
