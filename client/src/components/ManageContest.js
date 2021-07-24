import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../api.js'

const ManageContest = (props) => {
    var { id } = useParams();
    const [contestOnScreen, changeContestOnScreen] = useState(-1);
    const loadData = (id) => {

    }
    useEffect(() => {
        if(contestOnScreen === id){
            return ;
        }
        changeContestOnScreen(id);
        loadData(id);
    });
    return (
        <div>
            Managing contest {id}
        </div>
    );
}

export default ManageContest;
