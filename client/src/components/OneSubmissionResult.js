import React from 'react';
import { Link } from 'react-router-dom'

const OneSubmissionResult = (props) => {
    return (
        <div>
            <Link to={'/submission/' + props.Submission.index} >
                <tr style={{border: "1px solid black"}}>
                    <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Submission.index}</td>
                    <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Submission.name}</td>
                    <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Submission.score} / 100 </td>
                    <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Submission.time}</td>
                </tr>
            </Link>

        </div>
    );
}
           // <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.message}</td>
            // <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.points} / 1</td>

export default OneSubmissionResult;