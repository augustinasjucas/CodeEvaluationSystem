import React, { useState, useEffect } from 'react';
import Api from '../api.js'

const Leaderboard = (props) => {

    const leaderboard = props.Leaderboard.leaderboard;
    const users = props.Leaderboard.users;
    const tasks = props.Leaderboard.tasks;

    const viewRow = (row, index) => {
        var ret = row.map((res) => <td className="leaderboardCol">{res}</td>);
        return (
            <tr>
                <th className="leaderboardCol">{users[index]}</th>
                {ret}
            </tr>
        )
    };
    const frontRow = (
        <tr>
            <th className="leaderboardCol"></th>
            {tasks.map((task) => <th className="leaderboardCol">{task}</th>)}
        </tr>
    );
    console.log('Leaderboard props: ');
    console.log(props);
    var viewLeaderbord = leaderboard.map((row, index) => ( <>{viewRow(row, index)}</>));


    return (
        <div>
            <table>
                {frontRow}
                {viewLeaderbord}
            </table>
        </div>
    );

}

export default Leaderboard;
