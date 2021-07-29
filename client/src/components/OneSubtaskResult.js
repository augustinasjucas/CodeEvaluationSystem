import React from 'react';

const OneSubtaskResult = (props) => {

    return (
        <tr className="subtaskResultRow">
            <td className={"subtaskIndex" + (props.Subtask.received == props.Subtask.points ? ' solved' : ' unsolved')}> {props.Index}</td>
            <td className={"subtaskIndex" + (props.Subtask.received == props.Subtask.points ? ' solved' : ' unsolved')}> {props.Subtask.received} / {props.Subtask.points} </td>
            <td className={"subtaskFirstFailed" + (props.Subtask.received == props.Subtask.points ? ' solved' : ' unsolved')}> {props.Subtask.passed}</td>
        </tr>
    );

}
           // <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.message}</td>
            // <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.points} / 1</td>

export default OneSubtaskResult;
