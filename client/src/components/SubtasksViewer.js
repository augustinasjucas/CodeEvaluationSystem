import React from 'react';
import OneSubtaskResult from './OneSubtaskResult';

const SubtasksViewer = (props) => {
    var subtasks = props.Subtasks;
    var ret = subtasks.map((subtask, index) => (<OneSubtaskResult Key={index} Index={index} Subtask={subtask}/>));
    return (
        <div>
            Subtask results:
            <table className="subtasksTable">
                {ret}
            </table>
        </div>
    );
}

export default SubtasksViewer;
