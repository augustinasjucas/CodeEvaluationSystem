import React from 'react';
import { Link } from 'react-router-dom'

const OneContestSelector = (props) => {
    return (
        <tr className="oneTaskSelectorRow">
            <td className="oneTaskSelectorCol"> {props.Contest.id} </td>
            <td className="oneTaskSelectorCol">{props.Contest.name}</td>
            <td className="oneTaskSelectorCol"><Link to={'/contest/' + props.Contest.id}>Select</Link></td>
        </tr>
    );
}
export default OneContestSelector;
