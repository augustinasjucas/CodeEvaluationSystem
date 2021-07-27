import React, { useState } from 'react';
import Api from '../api.js'
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import OneTaskSelector from './OneTaskSelector.js';
import { Link }  from 'react-router-dom';
import OneContestSelectorUser from './OneContestSelectorUser.js'

const TaskSelector = (props) => {
    const contests = props.ContestList;
    console.log('contests:');
    console.log(contests);
    var contestList = contests.map((contest) => <OneContestSelectorUser key={contest.id} Contest={contest} />);
    return (
        <div>
            <center><h3>Contest list:</h3></center>
            <table className='taskListTable'>{contestList}</table>
        </div>
    );
}
export default TaskSelector;
