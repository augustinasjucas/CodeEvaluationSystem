import React, { useState } from 'react';
import Api from '../api.js'
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import OneTaskSelector from './OneTaskSelector.js';
import { Link }  from 'react-router-dom';

const TaskSelector = (props) => {
    const taskNames = props.TaskNames;
    var taskList = taskNames.map((task) => <OneTaskSelector key={task.id} Task={task} />);
    return (<table className='taskListTable'>{taskList}</table>);
}
TaskSelector.propTypes = {
    TaskNames: PropTypes.array
};
export default TaskSelector;
