import React from 'react';

const OneTestResult = (props) => {
    return (
        <tr className="testResultRow">
            <td className={"testIndex" + (props.Test.points == 1 ? ' solved' : ' unsolved')}>{props.Index}</td>
            <td className={"testMessage" + (props.Test.points == 1 ? ' solved' : ' unsolved')}>{props.Test.message}</td>
            <td className={"testPoints" + (props.Test.points == 1 ? ' solved' : ' unsolved')}>{props.Test.points} / 1</td>
        </tr>
    );
}

export default OneTestResult;
