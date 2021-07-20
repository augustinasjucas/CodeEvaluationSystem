import React, { useState } from 'react';
import Api from '../api.js'
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
const TaskSelector = (props) => {
    const taskNames = props.TaskNames;
    var taskList = taskNames.map((task) => <button key={task.id} onClick={props.ChooseTask.bind(this, task)}>{task.name}</button>);
    return (<div>{taskList}</div>);
}
TaskSelector.propTypes = {
    TaskNames: PropTypes.array
};
export default TaskSelector;
