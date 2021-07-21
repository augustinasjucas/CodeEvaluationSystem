import React from 'react';

const OneTestResult = (props) => {
    console.log(props.Test);
    return (
        <div>
            <tr style={{border: "1px solid black"}}>
            <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Index}</td>
            <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.message}</td>
            <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.points} / 1</td>
            </tr>
        </div>
    );
}

export default OneTestResult;
