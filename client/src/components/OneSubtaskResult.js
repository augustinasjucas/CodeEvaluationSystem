import React from 'react';

const OneSubtaskResult = (props) => {

    return (
        <div>
            <tr className="subtaskResultRow">
                <td className="subtaskIndex"> {props.Index}</td>
                <td className="subtaskPoints"> {props.Subtask.received} / {props.Subtask.points} </td>
            </tr>
        </div>
    );

}
           // <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.message}</td>
            // <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.points} / 1</td>

export default OneSubtaskResult;
