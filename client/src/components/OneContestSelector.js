import React from 'react';
import { Link } from 'react-router-dom'

const OneContestSelector = (props) => {
    return (
        <tr>
            <td> {props.Contest.id} </td>
            <td>{props.Contest.name}</td>
            <td><Link to={'/manager/contest/' + props.Contest.id}>Select</Link></td>
        </tr>
    );
}
export default OneContestSelector;
