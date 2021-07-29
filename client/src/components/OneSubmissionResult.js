import React from 'react';
import { Link } from 'react-router-dom'

const OneSubmissionResult = (props) => {
    var sc = (props.Submission.score == 100 ? ' solved' : (props.Submission.score == 0 ? ' unsolved' : ' partialSolved'));
    props.Submission.time = props.Submission.time.replace(/T/, ' ').replace(/\..+/, '');
    if(props.Submission.score == -1){                                       // if not evaluated yet
        return (
                <tr className="submissionResultRow">
                    <td className="submissionResultIndex">{props.Submission.index}</td>
                    <td className="submissionResultNameOfTask">{props.Submission.name}</td>
                    <td className="submissionResultScore"> Waiting </td>
                    <td className="submissionResultTime">{props.Submission.time}</td>
                </tr>
        );

    }else if(!props.ShowUsername){
        return (
            <div>
                <Link to={'/submission/' + props.Submission.index} >
                    <tr className="submissionResultRow">
                        <td className={"submissionResultIndex" + sc}>{props.Submission.index}</td>
                        <td className={"submissionResultNameOfTask" + sc}>{props.Submission.name}</td>
                        <td className={"submissionResultScore" + sc}>{props.Submission.score} / 100 </td>
                        <td className={"submissionResultTime" + sc}>{props.Submission.time}</td>
                    </tr>
                </Link>

            </div>
        );
    }else{
        return (
            <div>
                <Link to={'/submission/' + props.Submission.index} >
                    <tr className="submissionResultRow">
                        <td className={"submissionResultIndex" + sc}>{props.Submission.index}</td>
                        <td className={"submissionResultUsername" + sc}>{props.Submission.username}</td>
                        <td className={"submissionResultNameOfTask" + sc}>{props.Submission.taskname}</td>
                        <td className={"submissionResultScore" + sc}>{props.Submission.score} / 100 </td>
                        <td className={"submissionResultTime" + sc}>{props.Submission.time}</td>
                    </tr>
                </Link>

            </div>
        );
    }
}
           // <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.message}</td>
            // <td style={{borderBottom: "1px solid black", borderCollapse:"collapse"}}>{props.Test.points} / 1</td>

export default OneSubmissionResult;
