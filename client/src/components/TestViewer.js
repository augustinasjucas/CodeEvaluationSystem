import React from 'react';
import OneTestResult from './OneTestResult';

const TestViewer = (props) => {
    var tests = props.Tests;
    props.Tests.shift();
    var ret = tests.map((test, index) => (<OneTestResult Index={index} Test={test}/>));
    return (
        <div>
            Test results:
            <table className="testResultsTable">
                {ret}
            </table>
        </div>
    );
}

export default TestViewer;
