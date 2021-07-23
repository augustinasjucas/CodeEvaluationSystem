import React from 'react';

const OneTestResult = (props) => {
    return (
        <div>
            <tr className="testResultRow">
            <td className="testIndex">{props.Index}</td>
            <td className="testMessage">{props.Test.message}</td>
            <td className="testPoints">{props.Test.points} / 1</td>
            </tr>
        </div>
    );
}

export default OneTestResult;
