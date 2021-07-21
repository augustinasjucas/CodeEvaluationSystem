import React from 'react';
import OneTestResult from './OneTestResult';

const TestViewer = (props) => {
    var tests = props.Tests;
    props.Tests.shift();
    var ret = tests.map((test, index) => (<OneTestResult Index={index} Test={test}/>));
    return (
        <div>
            Test results:
            <table style={{border: "1px solid black"}}>
                {ret}
            </table>
        </div>
    );
}

export default TestViewer;
